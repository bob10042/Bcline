from setuptools import setup, find_packages

setup(
    name="calculator-test",
    version="0.1.0",
    packages=find_packages(),
    # SYNTAX ERROR: Missing closing bracket
    install_requires=[
        "numpy==1.24.0"
)
