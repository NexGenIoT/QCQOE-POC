FROM python:3.8
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt
WORKDIR /code/app
COPY ./app ./
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]