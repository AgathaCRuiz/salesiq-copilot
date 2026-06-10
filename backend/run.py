import uvicorn
import os
from pathlib import Path
from dotenv import load_dotenv

# Carrega configurações locais do .env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    
    print(f"Iniciando o servidor SalesIQ Copilot em http://{host}:{port} ...")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
