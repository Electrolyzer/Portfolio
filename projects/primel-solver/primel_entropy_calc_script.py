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

def main():
    # Load prime list
    prime_list = load_prime_list()
    print(f"Loaded {len(prime_list)} primes")
    
    # First guess analysis
    first_guess_feedback = [0, 2, 1, 1, 1]
    
    reduced_prime_list = prime_list_reducer(12539, first_guess_feedback, prime_list)
    print(f"After first guess, {len(reduced_prime_list)} primes remain")
    
    # Calculate entropy for all remaining primes
    entropies = np.zeros(len(reduced_prime_list))
    for i in range(len(reduced_prime_list)):
        entropies[i] = primel_entropy_calc(reduced_prime_list[i], reduced_prime_list)[0]
    
    # Find best guesses (top 3 by entropy)
    best_guess_indices = np.argsort(entropies)[-3:][::-1]  # Top 3 in descending order
    best_guesses = [reduced_prime_list[i] for i in best_guess_indices]
    best_guess_entropies = [entropies[i] for i in best_guess_indices]
    
    print(f"\nThe best guesses are: {best_guesses[0]}, {best_guesses[1]} and {best_guesses[2]} with entropies {best_guess_entropies[0]:.6f}, {best_guess_entropies[1]:.6f} and {best_guess_entropies[2]:.6f}")
    
    # Second guess analysis
    second_guess_feedback = [2, 2, 2, 0, 2]
    
    reduced_prime_list = prime_list_reducer(52973, second_guess_feedback, reduced_prime_list)
    print(f"After second guess, {len(reduced_prime_list)} primes remain")
    
    if len(reduced_prime_list) > 0:
        entropies = np.zeros(len(reduced_prime_list))
        for i in range(len(reduced_prime_list)):
            entropies[i] = primel_entropy_calc(reduced_prime_list[i], reduced_prime_list)[0]
        
        # Find best guess (top 1 by entropy)
        best_guess_index = np.argmax(entropies)
        best_guess = reduced_prime_list[best_guess_index]
        best_guess_entropy = entropies[best_guess_index]
        
        print(f"\nThe best guess is: {best_guess} with entropy {best_guess_entropy:.6f}")
    
    # Uncommented third guess section for completeness
    # third_guess_feedback = [1, 1, 0, 0, 2]
    # 
    # reduced_prime_list = prime_list_reducer(95971, third_guess_feedback, reduced_prime_list)
    # print(f"After third guess, {len(reduced_prime_list)} primes remain")
    # 
    # if len(reduced_prime_list) > 0:
    #     entropies = np.zeros(len(reduced_prime_list))
    #     for i in range(len(reduced_prime_list)):
    #         entropies[i] = primel_entropy_calc(reduced_prime_list[i], reduced_prime_list)[0]
    #     
    #     # Find best guesses (top 3 by entropy)
    #     best_guess_indices = np.argsort(entropies)[-3:][::-1]
    #     best_guesses = [reduced_prime_list[i] for i in best_guess_indices if i < len(reduced_prime_list)]
    #     best_guess_entropies = [entropies[i] for i in best_guess_indices if i < len(reduced_prime_list)]
    #     
    #     # Pad with None if fewer than 3 guesses available
    #     while len(best_guesses) < 3:
    #         best_guesses.append(None)
    #         best_guess_entropies.append(0.0)
    #     
    #     print(f"\nThe best guesses are: {best_guesses[0]}, {best_guesses[1]} and {best_guesses[2]} with entropies {best_guess_entropies[0]:.6f}, {best_guess_entropies[1]:.6f} and {best_guess_entropies[2]:.6f}")

if __name__ == "__main__":
    main()
