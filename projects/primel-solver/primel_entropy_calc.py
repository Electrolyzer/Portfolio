import numpy as np
import pandas as pd

def primel_entropy_calc(prime_guess, prime_list):
    """
    Calculates the entropy of a Primel Guess
    
    Args:
        prime_guess: 5-digit prime number guess
        prime_list: list of possible prime numbers
        
    Returns:
        entropy: calculated entropy value
        probability_bucket: matrix showing feedback patterns for each prime
    """
    
    # Extract digits from prime guess
    prime_guess_digits = np.zeros(5, dtype=int)
    for j in range(5):
        prime_guess_digits[j] = (prime_guess // (10 ** (4-j))) % 10
    
    probability_bucket = np.zeros((len(prime_list), 5), dtype=int)
    
    for i in range(len(prime_list)):
        # Extract digits from current prime in list
        prime_list_digits = np.zeros(5, dtype=int)
        for j in range(5):
            prime_list_digits[j] = (prime_list[i] // (10 ** (4-j))) % 10
        
        # Make a copy for manipulation
        prime_list_digits_copy = prime_list_digits.copy()
        
        # First pass: mark exact matches (green = 2)
        for j in range(5):
            if prime_guess_digits[j] == prime_list_digits[j]:
                probability_bucket[i, j] = 2
                prime_list_digits_copy[j] = -1  # Mark as used
        
        # Second pass: mark partial matches (yellow = 1)
        for j in range(5):
            if probability_bucket[i, j] != 2:  # Not already marked as exact match
                # Find if this digit exists elsewhere in the target
                match_indices = np.where(prime_list_digits_copy == prime_guess_digits[j])[0]
                if len(match_indices) > 0:
                    probability_bucket[i, j] = 1
                    prime_list_digits_copy[match_indices[0]] = -1  # Mark first match as used
    
    # Create 5D histogram for entropy calculation
    probability_bucket_2_electric_boogaloo = np.zeros((3, 3, 3, 3, 3))
    
    for i in range(len(probability_bucket)):
        pattern = probability_bucket[i, :]
        if all(0 <= p <= 2 for p in pattern):  # Valid pattern
            probability_bucket_2_electric_boogaloo[pattern[0], pattern[1], pattern[2], pattern[3], pattern[4]] += 1
    
    # Calculate entropy
    total_primes = len(prime_list)
    entropy = 0
    
    for count in probability_bucket_2_electric_boogaloo.flat:
        if count > 0:
            probability = count / total_primes
            entropy += probability * np.log2(total_primes / count)
    
    return entropy, probability_bucket
