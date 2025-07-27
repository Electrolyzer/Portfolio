# Primel Entropy-Based Solver

An intelligent solver for Primel (prime number Wordle) using information theory and entropy calculations to determine optimal guesses.

## Overview

This project implements an optimal strategy for solving Primel puzzles by applying information theory principles. The solver calculates the entropy of each potential guess to maximize information gain and minimize the expected number of guesses needed.

## Mathematical Foundation

The solver is based on the information theory approach to Wordle optimization, as explained in [3Blue1Brown's excellent video](https://www.youtube.com/watch?v=v68zYyaEmEA) on the mathematics behind optimal Wordle strategies.

### Entropy Formula

For each potential guess, we calculate how it would partition the remaining possible answers:

```
H = Σ p(pattern) × log₂(1/p(pattern))
```

Where `p(pattern)` is the probability of each possible feedback pattern occurring. This metric maximizes the expected information gain, ensuring that each guess minimizes the remaining uncertainty about the possible answers.

## Key Features

- **Entropy-based optimization**: Uses information theory to select optimal guesses
- **Prime number specialization**: Adapted specifically for 5-digit prime numbers
- **Interactive web demo**: Browser-based interface for testing the solver
- **Real-time calculations**: Dynamic updates as game state changes

## Files

- `primel-solver.html` - Interactive web demo
- `primel-solver.css` - Styling for the web interface
- `primel-solver-github.js` - Frontend JavaScript (GitHub Pages version)
- `primel_entropy_calc.py` - Core entropy calculation algorithm
- `prime_list_reducer.py` - Prime list filtering logic
- `interactive_primel_solver.py` - Command-line solver interface
- `primel_game_gui.py` - Tkinter-based game implementation
- `primelist.csv` - Database of 8,363 five-digit primes
- `generate_primelist.py` - Utility to generate prime number list

## Usage

### Web Version
Open [primel solver](https://electrolyzer.github.io/Portfolio/projects/primel-solver/primel-solver.html) in a web browser to use the interactive demo.

### Command Line
```bash
python interactive_primel_solver.py
```

### Python API
```python
from primel_entropy_calc import primel_entropy_calc
from prime_list_reducer import prime_list_reducer

# Calculate entropy for a guess
entropy, patterns = primel_entropy_calc(12953, prime_list)

# Filter prime list based on feedback
reduced_list = prime_list_reducer(12953, [0, 1, 2, 1, 2], prime_list)
```

## Algorithm Details

1. **Prime List Management**: Maintains a dynamic list of remaining valid 5-digit primes
2. **Feedback Processing**: Converts Wordle-style feedback (gray/yellow/green) into constraints
3. **Entropy Calculation**: For each candidate guess, calculates expected information gain
4. **Optimal Selection**: Ranks guesses by entropy to find the most informative options

## Performance

- **Prime Database**: 8,363 five-digit primes
- **Cache Optimization**: First set of suggestions is cached, as it is always the same
- **Calculation Speed**: Further suggestions typically less than 50 ms

## Technical Implementation

The solver uses NumPy for efficient numerical computations and implements the same feedback logic as the original Primel game:

- **Green (2)**: Correct digit in correct position
- **Yellow (1)**: Correct digit in wrong position  
- **Gray (0)**: Digit not in the target number

## Dependencies (For command line installation)

- Python 3.8+
- NumPy
- Pandas (for CSV handling)

## License

This project is for educational and portfolio purposes.
