import sys
import os
current = os.path.dirname(os.path.realpath(__file__))
sys.path.append(current)
sys.path.append(os.path.dirname(current))

import app
import pytest 

@pytest.fixture(scope="session")
def test():
    pass 