FROM python:3.8
COPY ./requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt
WORKDIR /code/app
COPY ./app ./
COPY GeoIP2-City-Asia-Pacific.mmdb ./
ENV GEOIP_DB_PATH=/code/app/GeoIP2-City-Asia-Pacific.mmdb
# CMD ["gunicorn", "main:app", "--workers", "4",  "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:80"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
