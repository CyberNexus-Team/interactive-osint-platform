# scraper_service/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Espone la porta 8000 dove FastAPI sarà in ascolto
EXPOSE 8000

# Comando per avviare il server quando il container parte
CMD ["uvicorn", "scrape_service:app", "--host", "0.0.0.0", "--port", "8000"]
