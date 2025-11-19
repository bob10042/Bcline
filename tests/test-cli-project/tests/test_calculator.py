import sys
sys.path.insert(0, 'src')

from calculator import add, subtract, multiply, divide, power

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 5) == -5

def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 3) == -6

def test_divide():
    assert divide(10, 2) == 5
    # This will cause ZeroDivisionError
    assert divide(5, 0) == None

def test_power():
    assert power(2, 3) == 8  # Will fail: 2 * 3 = 6, not 8
    assert power(5, 2) == 25 # Will fail: 5 * 2 = 10, not 25
