from typing import List

from pydantic import BaseModel


class CitiesRes(BaseModel):
    cities: List[str]
