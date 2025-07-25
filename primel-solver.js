// Primel Solver Frontend JavaScript

class PrimelSolver {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.gameHistory = [];
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

    async initializeGame() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/initialize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.updateGameStats(data.remaining_primes, 0);
                this.showMessage('Game initialized successfully', 'success');
            } else {
                this.showMessage(`Error: ${data.error}`, 'error');
            }
        } catch (error) {
            this.showMessage('Failed to connect to API. Make sure the Flask server is running.', 'error');
            console.error('API Error:', error);
        }
    }

    async addGuess() {
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

        try {
            const response = await fetch(`${this.apiBaseUrl}/add_guess`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    guess: guess,
                    feedback: feedback
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Add to local history
                this.gameHistory.push({
                    guess: parseInt(guess),
                    feedback: feedback.split('').map(Number)
                });

                // Update UI
                this.updateGuessHistory();
                this.updateGameStats(data.remaining_primes, data.guesses_made);
                this.clearInputs();
                this.showMessage('Guess added successfully', 'success');

                // Clear previous suggestions
                this.clearSuggestions();
            } else {
                this.showMessage(`Error: ${data.error}`, 'error');
            }
        } catch (error) {
            this.showMessage('Failed to add guess. Check API connection.', 'error');
            console.error('API Error:', error);
        }
    }

    async getSuggestions() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const suggestionsResults = document.getElementById('suggestionsResults');

        // Show loading spinner
        loadingSpinner.style.display = 'block';
        suggestionsResults.innerHTML = '';

        try {
            const response = await fetch(`${this.apiBaseUrl}/get_suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.displaySuggestions(data.suggestions);
                this.showMessage(data.message, 'success');
            } else {
                this.showMessage(`Error: ${data.error}`, 'error');
                suggestionsResults.innerHTML = '<p class="no-results">No suggestions available</p>';
            }
        } catch (error) {
            this.showMessage('Failed to get suggestions. Check API connection.', 'error');
            suggestionsResults.innerHTML = '<p class="no-results">Failed to load suggestions</p>';
            console.error('API Error:', error);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    async clearHistory() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/clear_history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.gameHistory = [];
                this.updateGuessHistory();
                this.updateGameStats(data.remaining_primes, data.guesses_made);
                this.clearSuggestions();
                this.clearInputs();
                this.showMessage('Game history cleared', 'success');
            } else {
                this.showMessage(`Error: ${data.error}`, 'error');
            }
        } catch (error) {
            this.showMessage('Failed to clear history. Check API connection.', 'error');
            console.error('API Error:', error);
        }
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

    async removeGuess(index) {
        // For simplicity, we'll rebuild the entire game state
        // In a more sophisticated implementation, you might want to support removing individual guesses
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
    new PrimelSolver();
});
