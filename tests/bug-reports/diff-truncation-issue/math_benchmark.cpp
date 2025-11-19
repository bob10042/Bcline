#define _USE_MATH_DEFINES
#include <iostream>
#include <vector>
#include <chrono>
#include <random>
#include <map>
#include <memory>
#include <thread>
#include <mutex>
#include <cmath>
#include <iomanip>
#include <functional>
#include <stdexcept>
#include <cstdlib>

using namespace std;

/**
 * Complex number structure for FFT and other complex math operations.
 */
struct Complex {
    double real, imag;
    
    Complex(double r = 0.0, double i = 0.0) : real(r), imag(i) {}
    
    Complex operator+(const Complex& other) const {
        return Complex(real + other.real, imag + other.imag);
    }
    
    Complex operator-(const Complex& other) const {
        return Complex(real - other.real, imag - other.imag);
    }
    
    Complex operator*(const Complex& other) const {
        return Complex(
            real * other.real - imag * other.imag,
            real * other.imag + imag * other.real
        );
    }
    
    Complex& operator/=(double scalar) {
        real /= scalar;
        imag /= scalar;
        return *this;
    }
};

/**
 * 3D Vector class with dot and cross product operations.
 */
struct Vector3D {
    double x, y, z;
    
    Vector3D(double a = 0.0, double b = 0.0, double c = 0.0) : x(a), y(b), z(c) {}
    
    /**
     * Dot product.
     */
    double dot(const Vector3D& other) const {
        return x * other.x + y * other.y + z * other.z;
    }
    
    /**
     * Cross product.
     */
    Vector3D cross(const Vector3D& other) const {
        return Vector3D(
            y * other.z - z * other.y,
            z * other.x - x * other.z,
            x * other.y - y * other.x
        );
    }
};

/**
 * Quaternion class for 3D rotations and operations.
 */
struct Quaternion {
    double w, x, y, z;
    
    Quaternion(double a = 1.0, double b = 0.0, double c = 0.0, double d = 0.0)
        : w(a), x(b), y(c), z(d) {}
    
    /**
     * Quaternion multiplication.
     */
    Quaternion operator*(const Quaternion& other) const {
        return Quaternion(
            w * other.w - x * other.x - y * other.y - z * other.z,
            w * other.x + x * other.w + y * other.z - z * other.y,
            w * other.y - x * other.z + y * other.w + z * other.x,
            w * other.z + x * other.y - y * other.x + z * other.w
        );
    }
};

/**
 * Templated Matrix class with operator overloading for multiplication.
 */
template <typename T>
class Matrix {
public:
    vector<vector<T>> data;
    int rows, cols;
    
    Matrix(int r, int c) : rows(r), cols(c), data(r, vector<T>(c, static_cast<T>(0))) {}
    
    /**
     * Matrix multiplication operator - Optimized with loop interchange.
     * Uses i-k-j loop order for better cache locality and performance.
     * Time Complexity: O(n^3)
     * Space Complexity: O(n^2)
     * Cache Efficiency: Improved through sequential access pattern
     */
    Matrix operator*(const Matrix& other) const {
        if (cols != other.rows) {
            throw runtime_error("Matrix dimensions mismatch for multiplication");
        }

        Matrix result(rows, other.cols);
        // Optimized loop interchange (i-k-j instead of i-j-k)
        // This improves cache hit rate by accessing result row sequentially
        for (int i = 0; i < rows; ++i) {
            for (int k = 0; k < cols; ++k) {
                T a_ik = data[i][k];  // Cache this value
                for (int j = 0; j < other.cols; ++j) {
                    result.data[i][j] += a_ik * other.data[k][j];
                }
            }
        }
        return result;
    }
};

/**
 * Benchmark timer class using high-resolution clock.
 */
class BenchmarkTimer {
public:
    using clock_t = chrono::high_resolution_clock;
    chrono::time_point<clock_t> start_time;
    
    void start() {
        start_time = clock_t::now();
    }
    
    double elapsed_ms() const {
        return chrono::duration<double, milli>(clock_t::now() - start_time).count();
    }
};

/**
 * Function: sieve_primes
 * Purpose: Generate first N prime numbers using Sieve of Eratosthenes algorithm
 * Parameters:
 *   - count: Number of prime numbers to generate
 * Returns: vector<long long> containing the first 'count' prime numbers
 * Time Complexity: O(n log log n) where n is the upper limit
 * Space Complexity: O(n) for the boolean array
 * Algorithm: Uses the classical sieve method - marks multiples of each prime
 */
vector<long long> sieve_primes(int count) {
    const int limit = 200000;  // Sufficient for first 10k primes
    vector<bool> is_prime(limit + 1, true);
    is_prime[0] = is_prime[1] = false;
    
    for (int i = 2; i * i <= limit; ++i) {
        if (is_prime[i]) {
            for (int j = i * i; j <= limit; j += i) {
                is_prime[j] = false;
            }
        }
    }
    
    vector<long long> primes;
    for (int i = 2; primes.size() < static_cast<size_t>(count) && i <= limit; ++i) {
        if (is_prime[i]) {
            primes.push_back(i);
        }
    }
    return primes;
}

/**
 * Function: fft
 * Purpose: In-place Fast Fourier Transform using Cooley-Tukey algorithm
 * Parameters:
 *   - a: Reference to vector of Complex numbers (size must be power of 2)
 *   - invert: If true, performs inverse FFT; if false, performs forward FFT
 * Returns: void (modifies input vector in-place)
 * Time Complexity: O(n log n) where n is the size of input
 * Space Complexity: O(1) additional space (in-place algorithm)
 * Algorithm: Bit-reversal permutation followed by butterfly operations
 */
void fft(vector<Complex>& a, bool invert) {
    int n = a.size();
    
    // Bit reversal permutation
    for (int i = 1, j = 0; i < n; ++i) {
        int bit = n >> 1;
        for (; j >= bit; bit >>= 1) {
            j -= bit;
        }
        j += bit;
        if (i < j) {
            swap(a[i], a[j]);
        }
    }
    
    // Butterfly operations
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * M_PI / len * (invert ? -1 : 1);
        Complex wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            Complex w(1.0);
            for (int j = 0; j < len / 2; ++j) {
                Complex u = a[i + j], v = a[i + j + len / 2] * w;
                a[i + j] = u + v;
                a[i + j + len / 2] = u - v;
                w = w * wlen;
            }
        }
    }
    
    if (invert) {
        for (auto& x : a) {
            x /= static_cast<double>(n);
        }
    }
}

/**
 * Function: simpson_integral
 * Purpose: Numerical integration using Simpson's 1/3 rule for approximating definite integrals
 * Parameters:
 *   - f: Function to integrate (takes double, returns double)
 *   - a: Lower bound of integration
 *   - b: Upper bound of integration
 *   - n: Number of intervals (higher n = more accurate)
 * Returns: double approximation of the definite integral
 * Time Complexity: O(n) for n function evaluations
 * Space Complexity: O(1)
 * Algorithm: Weighted sum using pattern 1,4,2,4,2,...,4,1
 */
double simpson_integral(const function<double(double)>& f, double a, double b, int n) {
    double h = (b - a) / n;
    double sum = f(a) + f(b);
    for (int i = 1; i < n; ++i) {
        sum += (i % 2 == 0 ? 2 : 4) * f(a + i * h);
    }
    return sum * h / 3.0;
}

/**
 * Function: monte_carlo_pi_threaded
 * Purpose: Multi-threaded Monte Carlo Pi estimation for improved performance
 * Parameters:
 *   - samples: Total number of random points to generate
 *   - num_threads: Number of parallel threads to use (default 4)
 * Returns: double approximation of Pi (π)
 * Time Complexity: O(samples/num_threads) with parallelization
 * Space Complexity: O(num_threads) for thread-local counters
 * Algorithm: Divides work among threads, each samples portion of points,
 *            uses mutex to safely aggregate results from all threads
 */
double monte_carlo_pi_threaded(int samples, int num_threads = 4) {
    mutex mtx;
    int total_inside = 0;

    // Lambda function for each thread to execute
    auto worker = [&](int thread_samples) {
        random_device rd;
        mt19937 gen(rd());
        uniform_real_distribution<double> dis(0.0, 1.0);

        int local_inside = 0;
        for (int i = 0; i < thread_samples; ++i) {
            double x = dis(gen), y = dis(gen);
            if (x * x + y * y <= 1.0) {
                ++local_inside;
            }
        }

        // Thread-safe aggregation with mutex protection
        lock_guard<mutex> lock(mtx);
        total_inside += local_inside;
    };

    // Create and launch threads
    vector<thread> threads;
    int samples_per_thread = samples / num_threads;
    int remaining_samples = samples % num_threads;

    for (int t = 0; t < num_threads; ++t) {
        int thread_samples = samples_per_thread + (t < remaining_samples ? 1 : 0);
        threads.emplace_back(worker, thread_samples);
    }

    // Wait for all threads to complete
    for (auto& th : threads) {
        th.join();
    }

    return 4.0 * total_inside / samples;
}

/**
 * Recursive Fibonacci with memoization.
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
map<long long, long long> fib_memo;
long long fib_rec(long long n) {
    if (n <= 1) return n;
    if (fib_memo.find(n) != fib_memo.end()) {
        return fib_memo[n];
    }
    return fib_memo[n] = fib_rec(n - 1) + fib_rec(n - 2);
}

/**
 * Iterative Fibonacci.
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
long long fib_iter(long long n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;
    for (long long i = 2; i <= n; ++i) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}

/**
 * Function: newton_sqrt
 * Purpose: Calculate square root using Newton-Raphson iterative method
 * Parameters:
 *   - x: Number to find square root of (must be non-negative)
 *   - eps: Convergence threshold (default 1e-10 for high precision)
 * Returns: double approximation of √x
 * Time Complexity: O(log(1/eps)) - quadratic convergence rate
 * Space Complexity: O(1)
 * Algorithm: Iteratively improves guess using formula: next = (guess + x/guess) / 2
 *            Stops when |next - guess| < eps
 */
double newton_sqrt(double x, double eps = 1e-10) {
    if (x < 0) throw domain_error("Cannot compute sqrt of negative number");
    double guess = x / 2.0;
    while (true) {
        double next = (guess + x / guess) / 2.0;
        if (abs(next - guess) < eps) {
            return next;
        }
        guess = next;
    }
}

/**
 * Taylor series approximation for e^x
 */
double taylor_exp(double x, int terms = 20) {
    double result = 1.0;  // FIXED - corrected from 0.0 to 1.0
    double term = 1.0;
    for (int i = 1; i < terms; ++i) {
        term *= x / i;
        result += term;
    }
    return result;
}

int main() {
    BenchmarkTimer timer;
    cout << fixed << setprecision(8);
    
    cout << "=== Math Benchmark Suite ===<" << endl;
    
    // Matrix Multiplication (100x100)
    cout << "\n1. Matrix Multiplication (100x100):" << endl;
    {
        random_device rd;
        mt19937 gen(rd());
        uniform_real_distribution<double> dis(0.0, 1.0);
        
        timer.start();
        Matrix<double> A(100, 100), B(100, 100);
        for (int i = 0; i < 100; ++i) {
            for (int j = 0; j < 100; ++j) {
                A.data[i][j] = dis(gen);
                B.data[i][j] = dis(gen);
            }
        }
        auto C = A * B;
        double time_ms = timer.elapsed_ms();
        cout << "  Time: " << time_ms << " ms" << endl;
        cout << "  C[0][0]: " << C.data[0][0] << endl;
    }
    
    // Sieve of Eratosthenes (10k primes)
    cout << "\n2. Sieve of Eratosthenes (10k primes):" << endl;
    {
        timer.start();
        auto primes = sieve_primes(10000);
        double time_ms = timer.elapsed_ms();
        cout << "  Time: " << time_ms << " ms" << endl;
        cout << "  Last prime: " << primes.back() << endl;
    }
    
    // FFT (1024 points)
    cout << "\n3. FFT (1024 points):" << endl;
    {
        const int N = 1024;
        vector<Complex> signal(N);
        random_device rd;
        mt19937 gen(rd());
        uniform_real_distribution<double> dis(0.0, 1.0);
        for (int i = 0; i < N; ++i) {
            signal[i].real = sin(2 * M_PI * i / N) + 0.1 * dis(gen);
            signal[i].imag = 0.0;
        }
        
        timer.start();
        fft(signal, false);
        fft(signal, true);  // Inverse FFT
        double time_ms = timer.elapsed_ms();
        cout << "  Time: " << time_ms << " ms" << endl;
        cout << "  Reconstruction error (first): " << abs(sin(0) - signal[0].real) << endl;
    }
    
    // Simpson's Rule (sin(x) 0 to pi)
    cout << "\n4. Simpson's Rule Integral (sin(x), 0 to pi):" << endl;
    {
        timer.start();
        double result = simpson_integral([](double x) { return sin(x); }, 0.0, M_PI, 10000);
        double time_ms = timer.elapsed_ms();
        cout << "  Result: " << result << " (expected ~2.0)" << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }
    
    // Monte Carlo Pi (Multi-threaded)
    cout << "\n5. Monte Carlo Pi Multi-threaded (1M samples, 4 threads):" << endl;
    {
        timer.start();
        double pi_est = monte_carlo_pi_threaded(1000000, 4);
        double time_ms = timer.elapsed_ms();
        cout << "  Pi ≈ " << pi_est << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }
    
    // Fibonacci Recursive (memoized)
    cout << "\n6. Fibonacci Recursive Memoized (n=40):" << endl;
    {
        fib_memo.clear();
        timer.start();
        long long result = fib_rec(40);
        double time_ms = timer.elapsed_ms();
        cout << "  Fib(40) = " << result << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }
    
    // Fibonacci Iterative
    cout << "\n7. Fibonacci Iterative (n=40):" << endl;
    {
        timer.start();
        long long result = fib_iter(40);
        double time_ms = timer.elapsed_ms();
        cout << "  Fib(40) = " << result << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }
    
    // Newton-Raphson sqrt(2)
    cout << "\n8. Newton-Raphson sqrt(2):" << endl;
    {
        timer.start();
        double result = newton_sqrt(2.0);
        double time_ms = timer.elapsed_ms();
        cout << "  sqrt(2) ≈ " << result << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }
    
    // Quaternion operations (10k multiplications)
    cout << "\n9. Quaternion Operations (10k mults):" << endl;
    {
        Quaternion q1(1.0, 0.1, 0.2, 0.3);
        Quaternion q2(0.5, 0.4, 0.6, 0.7);
        Quaternion result = q1 * q2;
        
        timer.start();
        for (int i = 0; i < 10000; ++i) {
            result = result * q1;
        }
        double time_ms = timer.elapsed_ms();
        cout << "  Final w: " << result.w << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }
    
    // Vector3D operations
    cout << "\n10. Vector3D Cross Product:" << endl;
    {
        Vector3D v1(1.0, 0.0, 0.0);
        Vector3D v2(0.0, 1.0, 0.0);
        Vector3D cross = v1.cross(v2);
        cout << "  i x j = k: " << cross.z << endl;
    }

    // Taylor series e^x
    cout << "\n11. Taylor Series e^x (x=1, 20 terms):" << endl;
    {
        timer.start();
        double result = taylor_exp(1.0, 20);
        double time_ms = timer.elapsed_ms();
        cout << "  e^1 ≈ " << result << " (expected ~2.71828)" << endl;
        cout << "  Time: " << time_ms << " ms" << endl;
    }

    cout << "\n=== All benchmarks completed successfully! ===" << endl;
    return 0;
}
