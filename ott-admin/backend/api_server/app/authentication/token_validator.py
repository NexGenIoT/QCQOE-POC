import requests
from functools import wraps
from flask import request
from werkzeug.exceptions import abort

# Todo: check usage or delete

def validate_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('token')
        allow = False
        if token:
            url = 'http://13.233.225.220:8080/oauth/validate'  # TODO : Handle from config file
            res = requests.post(url, json={'token': token}, verify=False)
            if res.status_code == 200:
                if res.json()['validated']:
                    allow = True
        if allow:
            return f(*args, **kwargs)
        else:
            abort(401)

    return decorated_function
