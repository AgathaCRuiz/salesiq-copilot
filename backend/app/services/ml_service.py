import httpx
from typing import Dict, Any, List
from app.core.config import settings


class MLService:
    def __init__(self):
        self.base_url = settings.ML_API_BASE_URL
        self._access_token = settings.ML_ACCESS_TOKEN

    @property
    def headers(self):
        return {"Authorization": f"Bearer {self._access_token}"}

    async def _refresh_token(self) -> None:
        """Renova o token automaticamente via client_credentials."""
        url = "https://api.mercadolibre.com/oauth/token"
        body = (
            f"grant_type=client_credentials"
            f"&client_id={settings.ML_APP_ID}"
            f"&client_secret={settings.ML_SECRET_KEY}"
        )
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                url,
                content=body,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if response.status_code == 200:
                data = response.json()
                self._access_token = data.get("access_token", self._access_token)
                print(f"[MLService] Token renovado automaticamente.")
            else:
                print(f"[MLService] Falha ao renovar token: {response.status_code}")

    async def _get(self, url: str, params: Dict = None, retry: bool = True) -> Any:
        """GET com renovação automática de token em caso de 401."""
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params, headers=self.headers)

            if response.status_code == 401 and retry:
                print("[MLService] Token expirado, renovando...")
                await self._refresh_token()
                return await self._get(url, params=params, retry=False)

            try:
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as exc:
                raise RuntimeError(f"Erro ao consultar ML API: {str(exc)}")

    async def discover_categories(self, query: str) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/sites/MLB/domain_discovery/search"
        data = await self._get(url, params={"q": query, "limit": 5})
        return [
            {
                "category_id": item.get("category_id"),
                "category_name": item.get("category_name"),
                "domain_id": item.get("domain_id"),
                "domain_name": item.get("domain_name"),
            }
            for item in data
        ]

    async def get_category_info(self, category_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/categories/{category_id}"
        data = await self._get(url)
        path = [p.get("name") for p in data.get("path_from_root", [])]
        return {
            "category_id": category_id,
            "category_name": data.get("name"),
            "total_items": data.get("total_items_in_this_category", 0),
            "path": " > ".join(path),
        }

    async def get_category_attributes(self, category_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/categories/{category_id}/attributes"
        data = await self._get(url)

        brands = []
        key_attributes = []

        for attr in data:
            attr_id = attr.get("id", "")
            attr_name = attr.get("name", "")
            values = attr.get("values", []) or []
            tags = attr.get("tags") or {}
            is_hidden = tags.get("hidden", False) or tags.get("read_only", False)

            if attr_id == "BRAND" and values:
                brands = [v.get("name") for v in values[:10] if v.get("name")]

            if not is_hidden and values and attr_id not in ("BRAND", "GTIN", "MPN"):
                key_attributes.append({
                    "name": attr_name,
                    "values": [v.get("name") for v in values[:5] if v.get("name")]
                })

        return {
            "brands": brands,
            "key_attributes": key_attributes[:10],
            "total_attributes": len(data),
        }

    async def search_market_data(self, query: str) -> Dict[str, Any]:
        print(f"1. Descobrindo categorias para: '{query}'")
        categories = await self.discover_categories(query)

        if not categories:
            return {"query": query, "error": "Nenhuma categoria encontrada."}

        primary = categories[0]
        category_id = primary["category_id"]

        print(f"2. Buscando informações da categoria: {category_id}")
        category_info = await self.get_category_info(category_id)

        print(f"3. Buscando atributos da categoria")
        attributes = await self.get_category_attributes(category_id)

        return {
            "query": query,
            "category_id": category_id,
            "category_name": category_info["category_name"],
            "category_path": category_info["path"],
            "total_items_in_market": category_info["total_items"],
            "related_categories": [
                {"id": c["category_id"], "name": c["category_name"]}
                for c in categories[1:]
            ],
            "top_brands": attributes["brands"],
            "key_attributes": attributes["key_attributes"],
            "total_attributes": attributes["total_attributes"],
        }


ml_service = MLService()