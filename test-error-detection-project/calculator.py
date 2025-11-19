class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        # BUG: No zero division check
        return a / b

    def power(self, a, b):
        # BUG: Missing return statement
        result = a ** b

    def modulo(self, a, b):
        # BUG: Will crash on negative numbers
        assert b > 0
        return a % b

    def factorial(self, n):
        # BUG: No validation, will crash on negative
        if n == 0:
            return 1
        return n * self.factorial(n - 1)
