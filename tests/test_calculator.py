"""Comprehensive test suite with multiple failure types."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from calculator import add, subtract, multiply, divide, power, modulo, sqrt
import pytest

# These will PASS
def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 5) == -5
    assert subtract(-3, -1) == -2

def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 3) == -6
    assert multiply(0, 100) == 0

# These will FAIL with ZeroDivisionError
def test_divide_by_zero():
    """Test divide by zero - will CRASH."""
    result = divide(10, 0)  # ZeroDivisionError
    assert result is None

def test_modulo_by_zero():
    """Test modulo by zero - will CRASH."""
    result = modulo(10, 0)  # ZeroDivisionError
    assert result is None

# These will FAIL with AssertionError
def test_power_wrong():
    """Test power function - will FAIL."""
    assert power(2, 3) == 8  # Returns 6 (2*3 instead of 2**3)
    assert power(5, 2) == 25  # Returns 10

def test_sqrt_negative():
    """Test sqrt with negative - will FAIL."""
    result = sqrt(-4)
    assert result is None  # Returns complex number (2j)

# These will PASS (correct usage)
def test_divide_normal():
    assert divide(10, 2) == 5
    assert divide(7, 2) == 3.5

def test_power_normal():
    # Will still fail due to bug
    assert power(2, 2) == 4  # Returns 4 (correct by coincidence)
