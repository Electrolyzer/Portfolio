// Enhanced Primel Solver Frontend JavaScript - GitHub Pages Version
// Supports both Auto Demo and Manual modes

class PrimelSolverGitHub {
    constructor() {
        this.gameHistory = [];
        this.remainingPrimes = 8363;
        this.currentMode = 'auto'; // 'auto' or 'manual'
        this.autoGame = {
            target: null,
            currentGuess: 0,
            isPlaying: false,
            isPaused: false,
            speed: 'normal',
            gameBoard: []
        };
        this.primeList = this.generatePrimeList();
        this.initializeEventListeners();
        this.initializeGame();
    }

    generatePrimeList() {
        // Generate a subset of 5-digit primes for demo purposes
        const primes = [
            10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093,
            10099, 10103, 10111, 10133, 10139, 10141, 10151, 10159, 10163, 10169,
            10177, 10181, 10193, 10211, 10223, 10243, 10247, 10253, 10259, 10267,
            10271, 10273, 10289, 10301, 10303, 10313, 10321, 10331, 10333, 10337,
            10343, 10357, 10369, 10391, 10399, 10427, 10429, 10433, 10453, 10457,
            12953, 15923, 17389, 19427, 23719, 29173, 31397, 37199, 41299, 43291,
            47293, 53197, 59393, 61291, 67297, 71293, 73297, 79193, 83297, 89197,
            91199, 97291, 98317, 99991
        ];
        return primes;
    }

    initializeEventListeners() {
        // Mode toggle buttons
        document.getElementById('autoDemoBtn').addEventListener('click', () => {
            this.switchMode('auto');
        });

        document.getElementById('manualModeBtn').addEventListener('click', () => {
            this.switchMode('manual');
        });

        // Auto demo controls
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewAutoGame();
        });

        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        document.getElementById('stepBtn').addEventListener('click', () => {
            this.stepAutoGame();
        });

        document.getElementById('speedControl').addEventListener('change', (e) => {
            this.autoGame.speed = e.target.value;
        });

        document.getElementById('targetPrime').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        // Manual mode controls
        document.getElementById('addGuessBtn').addEventListener('click', () => {
            this.addManualGuess();
        });

        document.getElementById('getSuggestionsBtn').addEventListener('click', () => {
            this.getManualSuggestions();
        });

        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearManualHistory();
        });

        // Manual mode input handlers
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('feedbackInput').focus();
            }
        });

        document.getElementById('feedbackInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addManualGuess();
            }
        });

        // Input validation
        document.getElementById('guessInput').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        document.getElementById('feedbackInput').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^012]/g, '');
        });
    }

    initializeGame() {
        this.createGameBoard();
        this.switchMode('auto');
        this.updateAutoGameStats(8363, 0, null);
        this.showMessage('Demo initialized - Starting auto demo...', 'info');
        
        // Auto-start the first demo
        setTimeout(() => {
            this.startNewAutoGame();
        }, 2000);
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.getElementById('autoDemoBtn').classList.toggle('active', mode === 'auto');
        document.getElementById('manualModeBtn').classList.toggle('active', mode === 'manual');
        
        // Show/hide mode sections
        document.getElementById('autoDemoMode').classList.toggle('active', mode === 'auto');
        document.getElementById('manualMode').classList.toggle('active', mode === 'manual');
        
        if (mode === 'manual') {
            this.updateManualGameStats(this.remainingPrimes, this.gameHistory.length);
        }
    }

    createGameBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < 6; row++) {
            const guessRow = document.createElement('div');
            guessRow.className = 'guess-row';
            guessRow.id = `row-${row}`;
            
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'game-cell';
                cell.id = `cell-${row}-${col}`;
                guessRow.appendChild(cell);
            }
            
            gameBoard.appendChild(guessRow);
        }
    }

    startNewAutoGame() {
        // Get target prime
        const targetInput = document.getElementById('targetPrime');
        let target = targetInput.value.trim();
        
        if (!target) {
            // Random prime
            target = this.primeList[Math.floor(Math.random() * this.primeList.length)];
            targetInput.placeholder = target.toString();
        } else {
            target = parseInt(target);
            if (!this.validateGuess(target.toString())) {
                this.showMessage('Please enter a valid 5-digit prime', 'error');
                return;
            }
        }

        // Initialize auto game
        this.autoGame = {
            target: target,
            currentGuess: 0,
            isPlaying: true,
            isPaused: false,
            speed: document.getElementById('speedControl').value,
            gameBoard: [],
            availablePrimes: [...this.primeList]
        };

        // Reset UI
        this.createGameBoard();
        this.updateGameStatus('Game started! Calculating first guess...');
        this.updateAutoGameStats(this.primeList.length, 0, target);
        
        // Update controls
        document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
        document.getElementById('newGameBtn').textContent = 'New Game';
        
        // Start the game loop
        setTimeout(() => this.playAutoGameStep(), 1000);
    }

    async playAutoGameStep() {
        if (!this.autoGame.isPlaying || this.autoGame.isPaused) return;
        
        if (this.autoGame.currentGuess >= 6) {
            this.endAutoGame(false);
            return;
        }

        // Calculate optimal guess
        this.updateGameStatus('Calculating optimal guess...');
        this.showAutoLoadingSpinner(true);
        
        // Simulate calculation delay
        await this.delay(this.getSpeedDelay());
        
        const optimalGuess = this.calculateOptimalGuess();
        const feedback = this.calculateFeedback(optimalGuess, this.autoGame.target);
        
        // Display the guess on the board
        this.displayGuessOnBoard(this.autoGame.currentGuess, optimalGuess, feedback);
        
        // Update game state
        this.autoGame.gameBoard.push({ guess: optimalGuess, feedback });
        this.autoGame.currentGuess++;
        
        // Filter available primes based on feedback
        this.autoGame.availablePrimes = this.filterPrimes(this.autoGame.availablePrimes, optimalGuess, feedback);
        
        // Update stats
        this.updateAutoGameStats(this.autoGame.availablePrimes.length, this.autoGame.currentGuess, this.autoGame.target);
        
        // Generate and display suggestions for next guess
        this.displayAutoSuggestions();
        this.showAutoLoadingSpinner(false);
        
        // Check if won
        if (feedback.every(f => f === 2)) {
            this.endAutoGame(true);
            return;
        }
        
        // Continue to next guess
        this.updateGameStatus(`Guess ${this.autoGame.currentGuess}: ${optimalGuess} - Preparing next guess...`);
        
        if (this.autoGame.isPlaying && !this.autoGame.isPaused) {
            setTimeout(() => this.playAutoGameStep(), this.getSpeedDelay() * 2);
        }
    }

    stepAutoGame() {
        if (!this.autoGame.target) {
            this.showMessage('Start a new game first', 'error');
            return;
        }
        
        // If game is running, pause it first
        if (this.autoGame.isPlaying && !this.autoGame.isPaused) {
            this.autoGame.isPaused = true;
            document.getElementById('playPauseBtn').textContent = '▶️ Play';
        }
        
        // Execute one step
        if (this.autoGame.isPlaying) {
            this.playAutoGameStep();
        }
    }

    togglePlayPause() {
        if (!this.autoGame.target) {
            this.showMessage('Start a new game first', 'error');
            return;
        }
        
        this.autoGame.isPaused = !this.autoGame.isPaused;
        document.getElementById('playPauseBtn').textContent = this.autoGame.isPaused ? '▶️ Play' : '⏸️ Pause';
        
        if (!this.autoGame.isPaused && this.autoGame.isPlaying) {
            setTimeout(() => this.playAutoGameStep(), 500);
        }
    }

    calculateOptimalGuess() {
        // Simplified entropy calculation for demo
        if (this.autoGame.currentGuess === 0) {
            // Good starting guesses
            const startingGuesses = [12953, 15923, 17389];
            return startingGuesses[Math.floor(Math.random() * startingGuesses.length)];
        }
        
        // For subsequent guesses, pick from available primes
        if (this.autoGame.availablePrimes.length > 0) {
            return this.autoGame.availablePrimes[Math.floor(Math.random() * Math.min(10, this.autoGame.availablePrimes.length))];
        }
        
        return this.primeList[Math.floor(Math.random() * this.primeList.length)];
    }

    calculateFeedback(guess, target) {
        const guessStr = guess.toString().padStart(5, '0');
        const targetStr = target.toString().padStart(5, '0');
        const feedback = [0, 0, 0, 0, 0];
        
        // Check for correct positions (green)
        for (let i = 0; i < 5; i++) {
            if (guessStr[i] === targetStr[i]) {
                feedback[i] = 2;
            }
        }
        
        // Check for correct digits in wrong positions (yellow)
        for (let i = 0; i < 5; i++) {
            if (feedback[i] === 0) { // Not already green
                for (let j = 0; j < 5; j++) {
                    if (i !== j && feedback[j] !== 2 && guessStr[i] === targetStr[j]) {
                        feedback[i] = 1;
                        break;
                    }
                }
            }
        }
        
        return feedback;
    }

    filterPrimes(primes, guess, feedback) {
        return primes.filter(prime => {
            const testFeedback = this.calculateFeedback(guess, prime);
            return JSON.stringify(testFeedback) === JSON.stringify(feedback);
        });
    }

    displayGuessOnBoard(row, guess, feedback) {
        const guessStr = guess.toString().padStart(5, '0');
        
        for (let col = 0; col < 5; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            cell.textContent = guessStr[col];
            cell.classList.add('filled');
            
            // Add feedback styling with animation
            setTimeout(() => {
                cell.classList.add('cell-flip');
                setTimeout(() => {
                    if (feedback[col] === 2) {
                        cell.classList.add('correct');
                    } else if (feedback[col] === 1) {
                        cell.classList.add('partial');
                    } else {
                        cell.classList.add('incorrect');
                    }
                }, 300);
            }, col * 100);
        }
    }

    displayAutoSuggestions() {
        const suggestions = this.generateMockSuggestions(this.autoGame.availablePrimes.length);
        this.displaySuggestions(suggestions, 'suggestionsResults');
    }

    endAutoGame(won) {
        this.autoGame.isPlaying = false;
        this.autoGame.isPaused = false;
        
        const status = won ? 
            `🎉 Solved in ${this.autoGame.currentGuess} guesses! Target was ${this.autoGame.target}` :
            `😞 Game over! Target was ${this.autoGame.target}`;
        
        this.updateGameStatus(status);
        document.getElementById('gameStatus').classList.add(won ? 'won' : 'lost');
        document.getElementById('playPauseBtn').textContent = '▶️ Play';
        
        this.showMessage(won ? 'Puzzle solved!' : 'Game over!', won ? 'success' : 'error');
    }

    getSpeedDelay() {
        switch (this.autoGame.speed) {
            case 'slow': return 3000;
            case 'fast': return 800;
            default: return 1500; // normal
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateGameStatus(message) {
        const statusEl = document.getElementById('gameStatus');
        statusEl.innerHTML = `<p>${message}</p>`;
        statusEl.className = 'game-status'; // Reset classes
    }

    updateAutoGameStats(remainingPrimes, guessesMade, target) {
        document.getElementById('remainingPrimes').textContent = remainingPrimes.toLocaleString();
        document.getElementById('guessesMade').textContent = guessesMade;
        document.getElementById('targetDisplay').textContent = target || 'Hidden';
    }

    showAutoLoadingSpinner(show) {
        document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    }

    // Manual Mode Methods
    addManualGuess() {
        const guessInput = document.getElementById('guessInput');
        const feedbackInput = document.getElementById('feedbackInput');
        
        const guess = guessInput.value.trim();
        const feedback = feedbackInput.value.trim();

        if (!this.validateGuess(guess)) {
            this.showMessage('Please enter a valid 5-digit number', 'error');
            return;
        }

        if (!this.validateFeedback(feedback)) {
            this.showMessage('Please enter exactly 5 digits (0, 1, or 2)', 'error');
            return;
        }

        this.gameHistory.push({
            guess: parseInt(guess),
            feedback: feedback.split('').map(Number)
        });

        this.remainingPrimes = Math.max(1, Math.floor(this.remainingPrimes * this.getReductionFactor(feedback)));

        this.updateManualGuessHistory();
        this.updateManualGameStats(this.remainingPrimes, this.gameHistory.length);
        this.clearManualInputs();
        this.showMessage('Guess added successfully', 'success');
        this.clearManualSuggestions();
    }

    getManualSuggestions() {
        const loadingSpinner = document.getElementById('manualLoadingSpinner');
        const suggestionsResults = document.getElementById('manualSuggestionsResults');

        loadingSpinner.style.display = 'block';
        suggestionsResults.innerHTML = '';

        setTimeout(() => {
            const mockSuggestions = this.generateMockSuggestions(this.remainingPrimes);
            this.displaySuggestions(mockSuggestions, 'manualSuggestionsResults');
            this.showMessage('Suggestions generated (demo version)', 'success');
            loadingSpinner.style.display = 'none';
        }, 1500);
    }

    clearManualHistory() {
        this.gameHistory = [];
        this.remainingPrimes = 8363;
        this.updateManualGuessHistory();
        this.updateManualGameStats(this.remainingPrimes, 0);
        this.clearManualSuggestions();
        this.clearManualInputs();
        this.showMessage('Game history cleared', 'success');
    }

    updateManualGuessHistory() {
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
                this.showMessage('To remove a guess, please clear all history and re-enter your guesses', 'info');
            });
            
            guessEntry.appendChild(guessNumber);
            guessEntry.appendChild(guessDigits);
            guessEntry.appendChild(removeBtn);
            
            historyContainer.appendChild(guessEntry);
        });
    }

    updateManualGameStats(remainingPrimes, guessesMade) {
        document.getElementById('manualRemainingPrimes').textContent = remainingPrimes.toLocaleString();
        document.getElementById('manualGuessesMade').textContent = guessesMade;
    }

    clearManualSuggestions() {
        const suggestionsResults = document.getElementById('manualSuggestionsResults');
        suggestionsResults.innerHTML = '<p class="no-results">Enter your game state and click "Get Optimal Guesses" to see recommendations.</p>';
    }

    clearManualInputs() {
        document.getElementById('guessInput').value = '';
        document.getElementById('feedbackInput').value = '';
        document.getElementById('guessInput').focus();
    }

    // Shared Methods
    generateMockSuggestions(remainingCount = null) {
        const basePrimes = [12953, 15923, 17389, 19427, 23719];
        const suggestions = [];
        const count = remainingCount || this.remainingPrimes;

        for (let i = 0; i < Math.min(5, Math.max(1, count)); i++) {
            const prime = basePrimes[i] || this.primeList[Math.floor(Math.random() * this.primeList.length)];
            const entropy = (6.8 - i * 0.3 - (this.gameHistory.length || this.autoGame.currentGuess) * 0.2).toFixed(6);
            
            suggestions.push({
                prime: prime,
                entropy: parseFloat(entropy),
                rank: i + 1
            });
        }

        return suggestions;
    }

    displaySuggestions(suggestions, containerId) {
        const suggestionsResults = document.getElementById(containerId);
        
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

    getReductionFactor(feedback) {
        const greenCount = feedback.split('').filter(f => f === '2').length;
        const yellowCount = feedback.split('').filter(f => f === '1').length;
        
        if (greenCount === 5) return 0.0001;
        if (greenCount >= 3) return 0.1;
        if (greenCount >= 1) return 0.3;
        if (yellowCount >= 3) return 0.4;
        return 0.6;
    }

    validateGuess(guess) {
        return /^\d{5}$/.test(guess) && parseInt(guess) >= 10000 && parseInt(guess) <= 99999;
    }

    validateFeedback(feedback) {
        return /^[012]{5}$/.test(feedback);
    }

    showMessage(message, type = 'info') {
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
