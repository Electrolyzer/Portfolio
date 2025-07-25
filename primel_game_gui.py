import tkinter as tk
from tkinter import ttk, messagebox
import pandas as pd
import random
import numpy as np

class PrimelGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Primel - Guess the Prime!")
        self.root.geometry("600x800")
        self.root.configure(bg='#1a1a1a')
        
        # Game state
        self.prime_list = self.load_prime_list()
        self.secret_prime = None
        self.current_guess = 0
        self.max_guesses = 6
        self.game_over = False
        self.current_input = ""
        
        # GUI elements
        self.guess_entries = []
        
        self.setup_gui()
        self.new_game()
    
    def load_prime_list(self):
        """Load prime list from CSV file"""
        try:
            df = pd.read_csv('primelist.csv')
            if 'prime' in df.columns:
                return df['prime'].tolist()
            else:
                return df.iloc[:, 0].tolist()
        except:
            # Fallback list if CSV not found
            return [10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093]
    
    def setup_gui(self):
        """Setup the GUI elements"""
        # Title
        title_label = tk.Label(self.root, text="PRIMEL", font=("Helvetica", 32, "bold"), 
                              bg='#1a1a1a', fg='#ffffff')
        title_label.pack(pady=30)
        
        # Instructions
        instructions = tk.Label(self.root, 
                               text="Guess the 5-digit prime number!\nType to fill boxes • Enter to submit",
                               font=("Helvetica", 12), bg='#1a1a1a', fg='#b0b0b0', justify=tk.CENTER)
        instructions.pack(pady=10)
        
        # Game board frame
        game_frame = tk.Frame(self.root, bg='#1a1a1a')
        game_frame.pack(pady=30)
        
        # Create guess rows
        for i in range(self.max_guesses):
            row_frame = tk.Frame(game_frame, bg='#1a1a1a')
            row_frame.pack(pady=8)
            
            # Entry boxes for each digit
            entry_row = []
            
            for j in range(5):
                # Modern styled entry box
                entry = tk.Entry(row_frame, width=3, font=("Helvetica", 20, "bold"), 
                               justify=tk.CENTER, state='disabled',
                               bg='#2d2d2d', fg='#ffffff', 
                               disabledbackground='#2d2d2d', disabledforeground='#ffffff',
                               relief='flat', borderwidth=2,
                               highlightthickness=2, highlightcolor='#4a9eff')
                entry.pack(side=tk.LEFT, padx=4)
                entry_row.append(entry)
            
            self.guess_entries.append(entry_row)
        
        # Buttons frame
        button_frame = tk.Frame(self.root, bg='#1a1a1a')
        button_frame.pack(pady=30)
        
        self.submit_button = tk.Button(button_frame, text="SUBMIT", 
                                      command=self.submit_guess, font=("Helvetica", 12, "bold"),
                                      bg='#4a9eff', fg='white', padx=30, pady=10,
                                      relief='flat', borderwidth=0)
        self.submit_button.pack(side=tk.LEFT, padx=15)
        
        self.reset_button = tk.Button(button_frame, text="NEW GAME", 
                                     command=self.new_game, font=("Helvetica", 12, "bold"),
                                     bg='#ff6b6b', fg='white', padx=30, pady=10,
                                     relief='flat', borderwidth=0)
        self.reset_button.pack(side=tk.LEFT, padx=15)
        
        # Status label
        self.status_label = tk.Label(self.root, text="", font=("Helvetica", 14, "bold"), 
                                    bg='#1a1a1a', fg='#ffffff')
        self.status_label.pack(pady=20)
        
        # Secret prime display (for debugging - can be removed)
        self.debug_label = tk.Label(self.root, text="", font=("Helvetica", 10), 
                                   bg='#1a1a1a', fg='#666666')
        self.debug_label.pack(pady=5)
        
        # Bind keyboard events
        self.root.bind('<Key>', self.on_key_press)
        self.root.bind('<Return>', lambda e: self.submit_guess())
        self.root.bind('<BackSpace>', self.on_backspace)
        self.root.focus_set()
    
    def new_game(self):
        """Start a new game"""
        self.secret_prime = random.choice(self.prime_list)
        self.current_guess = 0
        self.game_over = False
        self.current_input = ""
        
        # Clear all entries and reset colors
        for i in range(self.max_guesses):
            for j in range(5):
                self.guess_entries[i][j].config(state='normal')
                self.guess_entries[i][j].delete(0, tk.END)
                self.guess_entries[i][j].config(state='disabled', 
                                              bg='#2d2d2d', 
                                              disabledbackground='#2d2d2d')
        
        self.submit_button.config(state='normal')
        
        self.status_label.config(text=f"Guess {self.current_guess + 1}/{self.max_guesses}")
        self.debug_label.config(text=f"Debug: Secret prime is {self.secret_prime}")
        
        self.root.focus_set()
    
    def on_key_press(self, event):
        """Handle key press events for live typing"""
        if self.game_over or self.current_guess >= self.max_guesses:
            return
        
        # Only handle digit keys
        if event.char.isdigit() and len(self.current_input) < 5:
            self.current_input += event.char
            self.update_current_row()
    
    def on_backspace(self, event):
        """Handle backspace key"""
        if self.game_over or self.current_guess >= self.max_guesses:
            return
        
        if len(self.current_input) > 0:
            self.current_input = self.current_input[:-1]
            self.update_current_row()
    
    def update_current_row(self):
        """Update the current guess row with typed input"""
        # Clear current row
        for j in range(5):
            self.guess_entries[self.current_guess][j].config(state='normal')
            self.guess_entries[self.current_guess][j].delete(0, tk.END)
            self.guess_entries[self.current_guess][j].config(state='disabled')
        
        # Fill with current input
        for i, digit in enumerate(self.current_input):
            self.guess_entries[self.current_guess][i].config(state='normal')
            self.guess_entries[self.current_guess][i].insert(0, digit)
            self.guess_entries[self.current_guess][i].config(state='disabled')
    
    def submit_guess(self):
        """Process a guess submission"""
        if self.game_over or self.current_guess >= self.max_guesses:
            return
        
        # Validate input
        if len(self.current_input) != 5:
            messagebox.showerror("Invalid Input", "Please enter exactly 5 digits.")
            return
        
        guess = int(self.current_input)
        
        if guess not in self.prime_list:
            messagebox.showwarning("Not a Prime", "That number is not in our list of 5-digit primes.")
            return
        
        # Process the guess
        self.process_guess(guess)
        
        # Clear input for next guess
        self.current_input = ""
        
        # Check win/lose conditions
        if guess == self.secret_prime:
            self.game_over = True
            self.status_label.config(text=f"🎉 Congratulations! You found the prime in {self.current_guess} guesses!")
            self.submit_button.config(state='disabled')
        elif self.current_guess >= self.max_guesses:
            self.game_over = True
            self.status_label.config(text=f"Game Over! The prime was {self.secret_prime}")
            self.submit_button.config(state='disabled')
        else:
            self.status_label.config(text=f"Guess {self.current_guess + 1}/{self.max_guesses}")
    
    def process_guess(self, guess):
        """Process a guess and update the display with background colors"""
        guess_digits = [int(d) for d in str(guess)]
        secret_digits = [int(d) for d in str(self.secret_prime)]
        
        # Calculate feedback
        feedback = self.calculate_feedback(guess_digits, secret_digits)
        
        # Apply background colors to the boxes
        for j in range(5):
            if feedback[j] == 2:  # Correct position
                bg_color = '#6aaa64'  # Green
            elif feedback[j] == 1:  # Wrong position
                bg_color = '#c9b458'  # Yellow
            else:  # Not in word
                bg_color = '#787c7e'  # Gray
            
            self.guess_entries[self.current_guess][j].config(
                disabledbackground=bg_color,
                bg=bg_color
            )
        
        self.current_guess += 1
    
    def calculate_feedback(self, guess_digits, secret_digits):
        """Calculate feedback for a guess (same logic as MATLAB version)"""
        feedback = [0] * 5
        secret_copy = secret_digits.copy()
        
        # First pass: exact matches
        for i in range(5):
            if guess_digits[i] == secret_digits[i]:
                feedback[i] = 2
                secret_copy[i] = -1  # Mark as used
        
        # Second pass: partial matches
        for i in range(5):
            if feedback[i] != 2:  # Not already exact match
                if guess_digits[i] in secret_copy:
                    feedback[i] = 1
                    # Remove first occurrence
                    idx = secret_copy.index(guess_digits[i])
                    secret_copy[idx] = -1
        
        return feedback

def main():
    root = tk.Tk()
    game = PrimelGame(root)
    root.mainloop()

if __name__ == "__main__":
    main()
