import sys
import os
current = os.path.dirname(os.path.realpath(__file__))
sys.path.append(current)
sys.path.append(os.path.dirname(current))

import app
import test
import pytest

from app import main

class TestMain():
    def test_main(self,monkeypatch):
        pass 