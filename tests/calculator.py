"""Calculator module with intentional bugs for testing."""

def add(a, b):
    """Add two numbers."""
    return a + b

def subtract(a, b):
    """Subtract b from a."""
    return a - b

def multiply(a, b):
    """Multiply two numbers."""
    return a * b

def divide(a, b):
    """Divide a by b with zero check."""
    if b == 0:
        return None
    return a / b

def power(a, b):
    """Raise a to power b."""
    return a ** b

def modulo(a, b):
    """Get remainder with zero check."""
    if b == 0:
        return None
    return a % b

def sqrt(n):
    """Square root with negative check."""
    if n < 0:
        return None
    return n ** 0.5
