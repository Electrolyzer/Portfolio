import numpy as np
import pandas as pd
from primel_entropy_calc import primel_entropy_calc
from prime_list_reducer import prime_list_reducer

def load_prime_list():
    """
    Load prime list from CSV file
    Assumes the CSV has a column named 'prime' or is a single column of primes
    """
    try:
        # Try loading as CSV with header
        df = pd.read_csv('primelist.csv')
        if 'prime' in df.columns:
            return df['prime'].tolist()
        else:
            # Assume first column contains primes
            return df.iloc[:, 0].tolist()
    except:
        # If CSV doesn't exist, create a sample list for testing
        print("Warning: primelist.csv not found. Using sample prime list.")
        return [10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093]

def get_feedback_input():
    """
    Get feedback from user input
    Returns list of 5 integers (0=gray, 1=yellow, 2=green)
    """
    while True:
        try:
            print("\nEnter feedback for each digit (0=gray/not in word, 1=yellow/wrong position, 2=green/correct position)")
            print("Example: 01212 means first digit gray, second yellow, third green, fourth yellow, fifth green")
            feedback_str = input("Enter 5-digit feedback: ").strip()
            
            if len(feedback_str) != 5:
                print("Error: Please enter exactly 5 digits")
                continue
                
            feedback = []
            valid = True
            for char in feedback_str:
                if char not in '012':
                    print("Error: Each digit must be 0, 1, or 2")
                    valid = False
                    break
                feedback.append(int(char))
            
            if valid:
                return feedback
                
        except KeyboardInterrupt:
            print("\nExiting...")
            exit()
        except:
            print("Error: Invalid input. Please try again.")

def get_guess_input():
    """
    Get guess from user input
    Returns 5-digit integer
    """
    while True:
        try:
            guess_str = input("Enter your 5-digit prime guess: ").strip()
            
            if len(guess_str) != 5:
                print("Error: Please enter exactly 5 digits")
                continue
                
            if not guess_str.isdigit():
                print("Error: Please enter only digits")
                continue
                
            guess = int(guess_str)
            if guess < 10000 or guess > 99999:
                print("Error: Please enter a 5-digit number (10000-99999)")
                continue
                
            return guess
            
        except KeyboardInterrupt:
            print("\nExiting...")
            exit()
        except:
            print("Error: Invalid input. Please try again.")

def display_best_guesses(reduced_prime_list, num_guesses=3):
    """
    Calculate and display the best guesses based on entropy
    """
    if len(reduced_prime_list) == 0:
        print("No primes remaining! Something went wrong.")
        return []
    
    if len(reduced_prime_list) == 1:
        print(f"\n🎉 CONGRATULATIONS! The answer must be: {reduced_prime_list[0]}")
        print("This is the only remaining possible prime!")
        return reduced_prime_list
    
    print(f"\nCalculating entropy for {len(reduced_prime_list)} remaining primes...")
    
    # Calculate entropy for all remaining primes
    entropies = np.zeros(len(reduced_prime_list))
    for i in range(len(reduced_prime_list)):
        entropies[i] = primel_entropy_calc(reduced_prime_list[i], reduced_prime_list)[0]
    
    # Find best guesses (top num_guesses by entropy)
    num_to_show = min(num_guesses, len(reduced_prime_list))
    best_guess_indices = np.argsort(entropies)[-num_to_show:][::-1]  # Top in descending order
    
    print(f"\nBest {num_to_show} guess{'es' if num_to_show > 1 else ''} by entropy:")
    for i, idx in enumerate(best_guess_indices):
        prime = reduced_prime_list[idx]
        entropy = entropies[idx]
        print(f"{i+1}. {prime} (entropy: {entropy:.6f})")
    
    return [reduced_prime_list[i] for i in best_guess_indices]

def main():
    print("=== Interactive Primel Solver ===")
    print("This tool helps you solve Primel using information theory!")
    print("\nFeedback codes:")
    print("0 = Gray (digit not in the target)")
    print("1 = Yellow (digit in target but wrong position)")
    print("2 = Green (digit in correct position)")
    
    # Load prime list
    prime_list = load_prime_list()
    print(f"\nLoaded {len(prime_list)} five-digit primes")
    
    reduced_prime_list = prime_list
    guess_number = 1
    
    while len(reduced_prime_list) > 1:
        print(f"\n{'='*50}")
        print(f"GUESS #{guess_number}")
        print(f"{'='*50}")
        print(f"Remaining possible primes: {len(reduced_prime_list)}")
        
        if guess_number == 1:
            print("\nFor your first guess, here are the pre-computed best starting options:")
            # Hardcoded best first guesses based on entropy calculation
            best_first_guesses = [
                (12953, 6.632274),
                (12539, 6.631809),
                (15923, 6.629907),
                (12739, 6.626544),
                (12893, 6.624787)
            ]
            print("\nBest 5 guesses by entropy:")
            for i, (prime, entropy) in enumerate(best_first_guesses):
                print(f"{i+1}. {prime} (entropy: {entropy:.6f})")
        else:
            display_best_guesses(reduced_prime_list, 3)
        
        # Get user's guess
        guess = get_guess_input()
        
        # Check if guess is in remaining list
        if guess not in reduced_prime_list:
            print(f"Warning: {guess} is not in the list of remaining possible primes.")
            continue_anyway = input("Continue anyway? (y/n): ").strip().lower()
            if continue_anyway != 'y':
                continue
        
        # Get feedback
        feedback = get_feedback_input()
        
        # Check if all green (solved)
        if feedback == [2, 2, 2, 2, 2]:
            print(f"\n🎉 CONGRATULATIONS! You solved it in {guess_number} guess{'es' if guess_number > 1 else ''}!")
            print(f"The answer was: {guess}")
            break
        
        # Reduce prime list based on feedback
        try:
            reduced_prime_list = prime_list_reducer(guess, feedback, reduced_prime_list)
            print(f"After filtering: {len(reduced_prime_list)} primes remain")
            
            if len(reduced_prime_list) == 0:
                print("❌ No primes match that feedback pattern!")
                print("Please check your feedback and try again.")
                # Reset to previous state would require keeping history
                print("You may need to restart the solver.")
                break
                
        except Exception as e:
            print(f"Error processing feedback: {e}")
            continue
        
        guess_number += 1
    
    if len(reduced_prime_list) == 1 and reduced_prime_list[0] != guess:
        print(f"\n🎉 Based on your feedback, the answer must be: {reduced_prime_list[0]}")
        print("This is the only remaining possible prime!")
    
    print("\nThanks for using the Interactive Primel Solver!")

if __name__ == "__main__":
    main()
