import numpy as np
from primel_entropy_calc import primel_entropy_calc

def prime_list_reducer(guess, feedback, prime_list):
    """
    Reduces the prime list based on guess feedback
    
    Args:
        guess: the guessed prime number
        feedback: list of 5 integers (0=gray, 1=yellow, 2=green)
        prime_list: current list of possible primes
        
    Returns:
        reduced_prime_list: filtered list of primes matching the feedback pattern
    """
    
    # Get probability buckets for the guess
    _, probability_buckets = primel_entropy_calc(guess, prime_list)
    
    reduced_prime_list = []
    
    for i in range(len(prime_list)):
        if np.array_equal(probability_buckets[i, :], feedback):
            reduced_prime_list.append(prime_list[i])
    
    return reduced_prime_list
