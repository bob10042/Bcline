#include <iostream>

// Calculates the nth Fibonacci number
long long fibonacci(int n) {
    /*
     * Computes the nth Fibonacci number iteratively.
     * fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2) for n > 1.
     * Efficient O(n) time with O(1) space.
     */
    if (n <= 1) return n;
    long long a = 0, b = 1, c;
    for (int i = 2; i <= n; ++i) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}

// Checks if a number is prime
bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
}

// Calculates the factorial of a number
long long factorial(int n) {
    if (n <= 1) return 1;
    return (long long)n * factorial(n - 1);
}

// Main function to test the implemented functions
int main() {
    std::cout << "Testing Sherlock model" << std::endl;
    for (int i = 0; i <= 20; ++i) {
        std::cout << "fib(" << i << ") = " << fibonacci(i) << std::endl;
    }
    std::cout << std::endl << "Prime number tests (2 to 50):" << std::endl;
    for (int i = 2; i <= 50; ++i) {
        std::cout << i << " is " << (isPrime(i) ? "prime" : "not prime") << std::endl;
    }
    std::cout << std::endl << "Interactive test:" << std::endl;
    int num;
    std::cout << "Enter a number for Fibonacci: ";
    std::cin >> num;
    std::cout << "fib(" << num << ") = " << fibonacci(num) << std::endl;
    std::cout << "Enter a number to check if prime: ";
    std::cin >> num;
    std::cout << num << " is " << (isPrime(num) ? "prime" : "not prime") << std::endl;
    return 0;
}