import unittest
from calculator import Calculator

class TestCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = Calculator()

    def test_add(self):
        self.assertEqual(self.calc.add(5, 3), 8)

    def test_divide_by_zero(self):
        # This test will FAIL - no exception raised
        with self.assertRaises(ZeroDivisionError):
            self.calc.divide(10, 0)

    def test_power(self):
        # This test will FAIL - power returns None
        self.assertEqual(self.calc.power(2, 3), 8)

    def test_modulo_negative(self):
        # This test will FAIL - assertion error
        self.assertEqual(self.calc.modulo(10, -3), 1)

    def test_factorial_negative(self):
        # This test will FAIL - recursion error
        self.calc.factorial(-5)

    def test_nonexistent_method(self):
        # This test will FAIL - method doesn't exist
        self.calc.square_root(16)

if __name__ == '__main__':
    unittest.main()
