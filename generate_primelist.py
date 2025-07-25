import pandas as pd
import numpy as np

def is_prime(n):
    """
    Check if a number is prime using trial division
    """
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # Check odd divisors up to sqrt(n)
    for i in range(3, int(np.sqrt(n)) + 1, 2):
        if n % i == 0:
            return False
    return True

def generate_5_digit_primes():
    """
    Generate all 5-digit prime numbers (10000 to 99999)
    """
    primes = []
    
    # Start from the first 5-digit number
    start = 10000
    end = 99999
    
    print(f"Generating 5-digit primes from {start} to {end}...")
    print("This may take a few minutes...")
    
    # Check each number in the range
    for num in range(start, end + 1):
        if is_prime(num):
            primes.append(num)
        
        # Progress indicator every 10000 numbers
        if num % 10000 == 0:
            print(f"Checked up to {num}, found {len(primes)} primes so far...")
    
    return primes

def save_primelist_csv(primes, filename='primelist.csv'):
    """
    Save the list of primes to a CSV file
    """
    df = pd.DataFrame({'prime': primes})
    df.to_csv(filename, index=False)
    print(f"Saved {len(primes)} primes to {filename}")

def main():
    print("Starting 5-digit prime generation...")
    
    # Generate all 5-digit primes
    primes = generate_5_digit_primes()
    
    print(f"\nGeneration complete!")
    print(f"Found {len(primes)} five-digit primes")
    print(f"First few primes: {primes[:10]}")
    print(f"Last few primes: {primes[-10:]}")
    
    # Save to CSV
    save_primelist_csv(primes)
    
    # Display some statistics
    print(f"\nStatistics:")
    print(f"Total 5-digit primes: {len(primes)}")
    print(f"Percentage of 5-digit numbers that are prime: {len(primes)/90000*100:.2f}%")
    
    return primes

if __name__ == "__main__":
    primes = main()
