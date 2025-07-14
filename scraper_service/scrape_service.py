# scraper_service/scrape_service.py
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scrapegraphai.graphs import SmartScraperGraph
from dotenv import load_dotenv

# Carica le variabili d'ambiente (se presenti, utile per il futuro)
load_dotenv()

# Inizializza l'applicazione FastAPI
app = FastAPI()

# Definisci il modello dei dati per la richiesta in arrivo da n8n
# Questo assicura che i dati siano nel formato corretto
class ScrapeRequest(BaseModel):
    source: str
    prompt: str
    llm_model: str # es. "ollama/qwen2:0.5b"

@app.get("/")
def read_root():
    return {"status": "Scraper service is running"}

@app.post("/scrape")
async def scrape_website(request: ScrapeRequest):
    print(f"Received scrape request for source: {request.source} with model {request.llm_model}")
    
    # Configurazione per Scrapegraph-AI
    graph_config = {
        "llm": {
            "model": request.llm_model,
            # L'URL di base di Ollama sarà fornito tramite variabile d'ambiente
            # per la massima flessibilità in Docker.
            "base_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"), 
        },
        "embeddings": {
            "model": "ollama/nomic-embed-text",
            "base_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        },
        "verbose": True,
    }

    try:
        # Crea e esegui il grafo di scraping
        smart_scraper_graph = SmartScraperGraph(
            prompt=request.prompt,
            source=request.source,
            config=graph_config
        )
        
        result = await smart_scraper_graph.run()
        print("Scraping completed successfully.")
        return {"status": "success", "data": result}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
