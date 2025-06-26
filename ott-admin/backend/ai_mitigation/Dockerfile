FROM python:3.8
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./app /code/app
WORKDIR /code/app
CMD ["python3", "main.py"]
