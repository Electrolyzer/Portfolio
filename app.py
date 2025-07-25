from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from primel_entropy_calc import primel_entropy_calc
from prime_list_reducer import prime_list_reducer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables to store game state
prime_list = []
game_history = []

def load_prime_list():
    """Load prime list from CSV file"""
    try:
        df = pd.read_csv('primelist.csv')
        if 'prime' in df.columns:
            return df['prime'].tolist()
        else:
            return df.iloc[:, 0].tolist()
    except Exception as e:
        print(f"Error loading prime list: {e}")
        # Fallback list if CSV not found
        return [10007, 10009, 10037, 10039, 10061, 10067, 10069, 10079, 10091, 10093]

def validate_prime_guess(guess):
    """Validate that the guess is a 5-digit number"""
    try:
        guess_int = int(guess)
        return 10000 <= guess_int <= 99999
    except ValueError:
        return False

def validate_feedback(feedback):
    """Validate that feedback is exactly 5 digits of 0, 1, or 2"""
    if len(feedback) != 5:
        return False
    return all(c in '012' for c in feedback)

@app.route('/api/initialize', methods=['POST'])
def initialize_game():
    """Initialize a new game session"""
    global prime_list, game_history
    
    try:
        prime_list = load_prime_list()
        game_history = []
        
        return jsonify({
            'success': True,
            'total_primes': len(prime_list),
            'remaining_primes': len(prime_list),
            'message': 'Game initialized successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/add_guess', methods=['POST'])
def add_guess():
    """Add a guess and feedback to the game history"""
    global prime_list, game_history
    
    try:
        data = request.get_json()
        guess = data.get('guess', '').strip()
        feedback = data.get('feedback', '').strip()
        
        # Validate input
        if not validate_prime_guess(guess):
            return jsonify({
                'success': False,
                'error': 'Guess must be a 5-digit number'
            }), 400
        
        if not validate_feedback(feedback):
            return jsonify({
                'success': False,
                'error': 'Feedback must be exactly 5 digits (0, 1, or 2)'
            }), 400
        
        guess_int = int(guess)
        feedback_list = [int(c) for c in feedback]
        
        # Add to history
        game_history.append({
            'guess': guess_int,
            'feedback': feedback_list
        })
        
        # Update prime list based on this guess
        prime_list = prime_list_reducer(guess_int, feedback_list, prime_list)
        
        return jsonify({
            'success': True,
            'remaining_primes': len(prime_list),
            'guesses_made': len(game_history),
            'message': 'Guess added successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/get_suggestions', methods=['POST'])
def get_suggestions():
    """Get optimal next guesses based on current game state"""
    global prime_list, game_history
    
    try:
        if len(prime_list) == 0:
            return jsonify({
                'success': False,
                'error': 'No remaining primes match the given constraints'
            }), 400
        
        if len(prime_list) == 1:
            return jsonify({
                'success': True,
                'suggestions': [{
                    'prime': prime_list[0],
                    'entropy': 0.0,
                    'rank': 1
                }],
                'remaining_primes': 1,
                'message': 'Only one prime remaining!'
            })
        
        # Calculate entropy for remaining primes (limit to reasonable number for performance)
        candidates = prime_list[:min(len(prime_list), 100)]  # Limit for performance
        entropies = []
        
        for prime in candidates:
            try:
                entropy, _ = primel_entropy_calc(prime, prime_list)
                entropies.append((prime, entropy))
            except Exception as e:
                print(f"Error calculating entropy for {prime}: {e}")
                entropies.append((prime, 0.0))
        
        # Sort by entropy (descending) and get top 5
        entropies.sort(key=lambda x: x[1], reverse=True)
        top_suggestions = entropies[:5]
        
        suggestions = []
        for rank, (prime, entropy) in enumerate(top_suggestions, 1):
            suggestions.append({
                'prime': prime,
                'entropy': round(entropy, 6),
                'rank': rank
            })
        
        return jsonify({
            'success': True,
            'suggestions': suggestions,
            'remaining_primes': len(prime_list),
            'candidates_evaluated': len(candidates),
            'message': f'Found {len(suggestions)} optimal suggestions'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/clear_history', methods=['POST'])
def clear_history():
    """Clear game history and reset to initial state"""
    global prime_list, game_history
    
    try:
        prime_list = load_prime_list()
        game_history = []
        
        return jsonify({
            'success': True,
            'remaining_primes': len(prime_list),
            'guesses_made': 0,
            'message': 'Game history cleared'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/game_state', methods=['GET'])
def get_game_state():
    """Get current game state"""
    global prime_list, game_history
    
    return jsonify({
        'success': True,
        'remaining_primes': len(prime_list),
        'guesses_made': len(game_history),
        'history': game_history
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Primel Solver API is running',
        'version': '1.0.0'
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Initialize the prime list on startup
    prime_list = load_prime_list()
    print(f"Loaded {len(prime_list)} primes")
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
