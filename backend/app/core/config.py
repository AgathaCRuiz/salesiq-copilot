import os
from pathlib import Path
from dotenv import load_dotenv

# Define caminhos base
# Path desta pasta: backend/app/core
CORE_DIR = Path(__file__).resolve().parent
APP_DIR = CORE_DIR.parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

# Carrega o .env localizado em backend/.env
load_dotenv(dotenv_path=BACKEND_DIR / ".env")

class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    ML_API_BASE_URL: str = "https://api.mercadolibre.com"
    ML_APP_ID: str = os.getenv("ML_APP_ID", "")     
    ML_SECRET_KEY: str = os.getenv("ML_SECRET_KEY", "") 
    ML_ACCESS_TOKEN: str = os.getenv("ML_ACCESS_TOKEN", "") 
    KNOWLEDGE_DIR: Path = PROJECT_ROOT / "knowledge"
    
    # Validação simples
    def validate(self):
        if not self.GROQ_API_KEY or self.GROQ_API_KEY == "gsk_your_key_here":
            print("[Warning] GROQ_API_KEY não foi configurada ou possui o valor padrão.")

settings = Settings()
settings.validate()
