// Primel Solver Frontend JavaScript - GitHub Pages Version
// This version works without the Flask API by using mock data and client-side calculations

class PrimelSolverGitHub {
    constructor() {
        this.gameHistory = [];
        this.remainingPrimes = 8363; // Starting number of primes
        this.initializeEventListeners();
        this.initializeGame();
    }

    initializeEventListeners() {
        // Add guess button
        document.getElementById('addGuessBtn').addEventListener('click', () => {
            this.addGuess();
        });

        // Get suggestions button
        document.getElementById('getSuggestionsBtn').addEventListener('click', () => {
            this.getSuggestions();
        });

        // Clear history button
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // Enter key handlers
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('feedbackInput').focus();
            }
        });

        document.getElementById('feedbackInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addGuess();
            }
        });

        // Input validation
        document.getElementById('guessInput').addEventListener('input', (e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        document.getElementById('feedbackInput').addEventListener('input', (e) => {
            // Only allow 0, 1, 2
            e.target.value = e.target.value.replace(/[^012]/g, '');
        });
    }

    initializeGame() {
        this.updateGameStats(8363, 0);
        this.showMessage('Demo initialized - Note: This is a simplified version for GitHub Pages', 'info');
    }

    addGuess() {
        const guessInput = document.getElementById('guessInput');
        const feedbackInput = document.getElementById('feedbackInput');
        
        const guess = guessInput.value.trim();
        const feedback = feedbackInput.value.trim();

        // Validate inputs
        if (!this.validateGuess(guess)) {
            this.showMessage('Please enter a valid 5-digit number', 'error');
            return;
        }

        if (!this.validateFeedback(feedback)) {
            this.showMessage('Please enter exactly 5 digits (0, 1, or 2)', 'error');
            return;
        }

        // Add to local history
        this.gameHistory.push({
            guess: parseInt(guess),
            feedback: feedback.split('').map(Number)
        });

        // Simulate prime list reduction (simplified calculation)
        this.remainingPrimes = Math.max(1, Math.floor(this.remainingPrimes * this.getReductionFactor(feedback)));

        // Update UI
        this.updateGuessHistory();
        this.updateGameStats(this.remainingPrimes, this.gameHistory.length);
        this.clearInputs();
        this.showMessage('Guess added successfully', 'success');

        // Clear previous suggestions
        this.clearSuggestions();
    }

    getReductionFactor(feedback) {
        // Simulate how much the prime list would be reduced based on feedback
        const greenCount = feedback.split('').filter(f => f === '2').length;
        const yellowCount = feedback.split('').filter(f => f === '1').length;
        
        if (greenCount === 5) return 0.0001; // Almost solved
        if (greenCount >= 3) return 0.1;     // Very constraining
        if (greenCount >= 1) return 0.3;     // Somewhat constraining
        if (yellowCount >= 3) return 0.4;    // Yellow letters help
        return 0.6; // Mostly gray letters
    }

    getSuggestions() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const suggestionsResults = document.getElementById('suggestionsResults');

        // Show loading spinner
        loadingSpinner.style.display = 'block';
        suggestionsResults.innerHTML = '';

        // Simulate API delay
        setTimeout(() => {
            const mockSuggestions = this.generateMockSuggestions();
            this.displaySuggestions(mockSuggestions);
            this.showMessage('Suggestions generated (demo version)', 'success');
            loadingSpinner.style.display = 'none';
        }, 1500);
    }

    generateMockSuggestions() {
        // Generate realistic mock suggestions based on game state
        const basePrimes = [12953, 15923, 17389, 19427, 23719];
        const suggestions = [];

        for (let i = 0; i < Math.min(5, this.remainingPrimes); i++) {
            const prime = basePrimes[i] || (10000 + Math.floor(Math.random() * 89999));
            const entropy = (6.8 - i * 0.3 - this.gameHistory.length * 0.2).toFixed(6);
            
            suggestions.push({
                prime: prime,
                entropy: parseFloat(entropy),
                rank: i + 1
            });
        }

        return suggestions;
    }

    clearHistory() {
        this.gameHistory = [];
        this.remainingPrimes = 8363;
        this.updateGuessHistory();
        this.updateGameStats(this.remainingPrimes, 0);
        this.clearSuggestions();
        this.clearInputs();
        this.showMessage('Game history cleared', 'success');
    }

    validateGuess(guess) {
        return /^\d{5}$/.test(guess) && parseInt(guess) >= 10000 && parseInt(guess) <= 99999;
    }

    validateFeedback(feedback) {
        return /^[012]{5}$/.test(feedback);
    }

    updateGuessHistory() {
        const historyContainer = document.getElementById('guessHistory');
        
        if (this.gameHistory.length === 0) {
            historyContainer.innerHTML = '<p style="text-align: center; color: #6b7280; font-style: italic;">No guesses yet. Add your first guess above.</p>';
            return;
        }

        historyContainer.innerHTML = '';
        
        this.gameHistory.forEach((entry, index) => {
            const guessEntry = document.createElement('div');
            guessEntry.className = 'guess-entry';
            
            const guessNumber = document.createElement('span');
            guessNumber.className = 'guess-number';
            guessNumber.textContent = `${index + 1}.`;
            
            const guessDigits = document.createElement('div');
            guessDigits.className = 'guess-digits';
            
            const guessStr = entry.guess.toString().padStart(5, '0');
            for (let i = 0; i < 5; i++) {
                const digit = document.createElement('div');
                digit.className = 'guess-digit';
                digit.textContent = guessStr[i];
                
                // Add color based on feedback
                if (entry.feedback[i] === 2) {
                    digit.classList.add('correct');
                } else if (entry.feedback[i] === 1) {
                    digit.classList.add('partial');
                } else {
                    digit.classList.add('incorrect');
                }
                
                guessDigits.appendChild(digit);
            }
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-guess';
            removeBtn.innerHTML = '×';
            removeBtn.title = 'Remove this guess';
            removeBtn.addEventListener('click', () => {
                this.removeGuess(index);
            });
            
            guessEntry.appendChild(guessNumber);
            guessEntry.appendChild(guessDigits);
            guessEntry.appendChild(removeBtn);
            
            historyContainer.appendChild(guessEntry);
        });
    }

    removeGuess(index) {
        this.showMessage('To remove a guess, please clear all history and re-enter your guesses', 'info');
    }

    displaySuggestions(suggestions) {
        const suggestionsResults = document.getElementById('suggestionsResults');
        
        if (!suggestions || suggestions.length === 0) {
            suggestionsResults.innerHTML = '<p class="no-results">No suggestions available</p>';
            return;
        }

        suggestionsResults.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            
            const rank = document.createElement('div');
            rank.className = 'suggestion-rank';
            rank.textContent = suggestion.rank;
            
            const details = document.createElement('div');
            details.style.flex = '1';
            
            const prime = document.createElement('div');
            prime.className = 'suggestion-prime';
            prime.textContent = suggestion.prime;
            
            const entropy = document.createElement('div');
            entropy.className = 'suggestion-entropy';
            entropy.textContent = `Entropy: ${suggestion.entropy}`;
            
            details.appendChild(prime);
            details.appendChild(entropy);
            
            suggestionItem.appendChild(rank);
            suggestionItem.appendChild(details);
            
            suggestionsResults.appendChild(suggestionItem);
        });
    }

    updateGameStats(remainingPrimes, guessesMade) {
        document.getElementById('remainingPrimes').textContent = remainingPrimes.toLocaleString();
        document.getElementById('guessesMade').textContent = guessesMade;
    }

    clearSuggestions() {
        const suggestionsResults = document.getElementById('suggestionsResults');
        suggestionsResults.innerHTML = '<p class="no-results">Enter your game state and click "Get Optimal Guesses" to see recommendations.</p>';
    }

    clearInputs() {
        document.getElementById('guessInput').value = '';
        document.getElementById('feedbackInput').value = '';
        document.getElementById('guessInput').focus();
    }

    showMessage(message, type = 'info') {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            max-width: 300px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                messageEl.style.backgroundColor = '#10b981';
                break;
            case 'error':
                messageEl.style.backgroundColor = '#ef4444';
                break;
            case 'info':
            default:
                messageEl.style.backgroundColor = '#2563eb';
                break;
        }

        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
}

// Initialize the solver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PrimelSolverGitHub();
});
