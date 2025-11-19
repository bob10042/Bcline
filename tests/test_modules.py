import sys; sys.path.insert(0, 'src')
from module1 import func1
from module2 import func2
from module3 import func3

def test_module1():
    func1()  # Will crash

def test_module2():
    func2()  # Will raise

def test_module3():
    func3()  # Will error
