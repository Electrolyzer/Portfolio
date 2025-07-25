# Jesse's Portfolio - Primel Solver Project

A professional portfolio website showcasing an intelligent Primel solver based on information theory and entropy calculations.

## Project Overview

This portfolio features a **Primel Entropy-Based Solver** - an intelligent tool for solving Primel (prime number Wordle) using mathematical optimization techniques inspired by 3Blue1Brown's analysis of Wordle strategies.

### Key Features

- **Interactive Web Demo**: Live demonstration of the entropy-based solver
- **Professional Portfolio Site**: Clean, responsive design showcasing technical skills
- **Mathematical Foundation**: Implementation based on information theory principles
- **Real-time Calculations**: Dynamic entropy calculations for optimal guess selection
- **GitHub Pages Hosting**: Static hosting with no backend required

## Project Structure

```
Portfolio/
├── index.html                          # Main portfolio page
├── styles.css                          # Main stylesheet
├── script.js                           # Main portfolio JavaScript
├── README.md                           # This file
├── .gitignore                          # Git ignore file
└── projects/                           # Projects directory
    └── primel-solver/                  # Primel solver project
        ├── primel-solver.html          # Interactive demo page
        ├── primel-solver.css           # Project-specific styles
        ├── primel-solver-github.js     # Demo JavaScript
        ├── primel_entropy_calc.py      # Core entropy algorithm
        ├── prime_list_reducer.py       # Prime list filtering
        ├── interactive_primel_solver.py # Command-line solver
        ├── primel_game_gui.py          # Tkinter game
        ├── primelist.csv               # Database of 5-digit primes
        ├── generate_primelist.py       # Prime generation utility
        └── README.md                   # Project-specific README
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Modern web browser

### 1. View the Portfolio

**Live URL**: `https://electrolyzer.github.io/Portfolio/`

### 2. Local Development

To run locally, serve the files using a local web server:

```bash
# Using Python's built-in server
python -m http.server 8000

# Then visit http://localhost:8000
```

### 3. Test the Demo

1. Navigate to the Primel Solver demo page
2. Add guesses with their feedback patterns
3. Click "Get Optimal Guesses" to see entropy-based recommendations

Note: The web demo uses simplified calculations for GitHub Pages compatibility.

## Technical Implementation

### Information Theory Foundation

The solver uses entropy calculations to determine the optimal next guess. For each potential guess, it calculates how that guess would partition the remaining possible answers based on feedback patterns.

### Entropy Formula

```
H = Σ p(pattern) × log₂(1/p(pattern))
```

Where `p(pattern)` is the probability of each possible feedback pattern occurring.

### Core Algorithm

```python
def primel_entropy_calc(prime_guess, prime_list):
    # Extract digits from prime guess
    # Calculate feedback patterns for each possible answer
    # Generate entropy from feedback pattern distribution
    return entropy, probability_bucket
```

## Usage Examples

### Adding a Guess

1. Enter a 5-digit prime number (e.g., `10007`)
2. Enter the feedback pattern (e.g., `01212`)
   - `0` = Gray (digit not in target)
   - `1` = Yellow (digit in target, wrong position)
   - `2` = Green (digit in correct position)
3. Click "Add Guess"

### Getting Suggestions

After adding one or more guesses, click "Get Optimal Guesses" to see the top 5 recommended next guesses ranked by entropy.

## Customization

### Updating Contact Information

Edit the contact links in `index.html`:

```html
<a href="mailto:your.email@example.com" class="contact-link">
<a href="https://linkedin.com/in/yourprofile" class="contact-link">
<a href="https://github.com/yourusername" class="contact-link">
```

### Adding More Projects

Add new project cards to the projects section in `index.html`:

```html
<div class="project-card">
    <div class="project-image">
        <!-- Project image or placeholder -->
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Project description...</p>
        <!-- Tech tags and links -->
    </div>
</div>
```

### Modifying the About Section

Update the about text and skills in `index.html` to reflect your background and expertise.

## Deployment

This portfolio is deployed on **GitHub Pages** at: `https://electrolyzer.github.io/Portfolio/`

### Adding New Projects

The portfolio is structured to easily accommodate new projects:

1. Create a new folder in `projects/`
2. Add your project files (HTML, CSS, JS, etc.)
3. Update the main `index.html` to include your new project
4. Commit and push to GitHub

## Performance Considerations

- The web demo uses simplified entropy calculations for browser compatibility
- Calculations typically complete within 1-2 seconds for most game states
- The prime list contains 8,363 five-digit primes

## Mathematical Background

This project implements concepts from:

- **Information Theory**: Entropy calculations for optimal decision making
- **Number Theory**: Working with prime numbers and their properties
- **Game Theory**: Optimal strategy development for word-guessing games

### Inspiration

The mathematical approach is based on [3Blue1Brown's video](https://www.youtube.com/watch?v=v68zYyaEmEA) explaining the information theory behind optimal Wordle strategies.

## Browser Compatibility

- Requires modern browser with ES6+ support
- Tested on Chrome, Firefox, Safari, and Edge
- Mobile-responsive design

## Contributing

This is a personal portfolio project, but suggestions and improvements are welcome!

## License

This project is for educational and portfolio purposes. Feel free to use as inspiration for your own projects.

---

**Contact**: Update with your contact information
**Portfolio**: [Your Portfolio URL]
**GitHub**: [Your GitHub Profile]
