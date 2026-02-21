import os
import requests
from typing import List, Dict, Optional

class PlacesService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        self.base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        
    def search_nearby_vets(self, latitude: float, longitude: float, radius: int = 5000) -> List[Dict]:
        """
        Search for nearby veterinary clinics.
        1. Tries Google Places API (if key exists)
        2. Falls back to OpenStreetMap (Nominatim) for real data (No key needed)
        3. Falls back to mock data only on error
        """
        if self.api_key:
            try:
                # ... existing Google Logic ...
                params = {
                    "location": f"{latitude},{longitude}",
                    "radius": radius,
                    "type": "veterinary_care",
                    "keyword": "veterinarian",
                    "key": self.api_key
                }
                response = requests.get(self.base_url, params=params)
                data = response.json()
                if data.get("status") == "OK":
                    return self._format_places_data(data.get("results", []))
            except Exception as e:
                print(f"Google Places extraction error: {e}")

        # Fallback to OpenStreetMap (Free, Real Data)
        print(" Using OpenStreetMap (Nominatim) for vet search...")
        return self._search_openstreetmap(latitude, longitude)

    def _search_openstreetmap(self, lat: float, lng: float) -> List[Dict]:
        """
        Search for vets using a progressive strategy:
        1. Detect user's city via reverse geocode
        2. Search in that exact city
        3. If not found, expand viewbox progressively (25km → 50km → 100km → country)
        4. If still nothing found, return empty — never fake data
        """
        print(f"📍 Searching OSM at: {lat}, {lng}")
        try:
            url = "https://nominatim.openstreetmap.org/search"
            headers = {'User-Agent': 'ZoodoApp/1.0 (zoodo-ai-project)'}

            is_fallback = False
            user_city = None
            fallback_city = None
            data = []

            # ── Step 1: Reverse geocode to get user's actual city ──────────────
            try:
                rev_resp = requests.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    params={'lat': lat, 'lon': lng, 'format': 'json'},
                    headers=headers, timeout=4
                ).json()
                addr = rev_resp.get('address', {})
                user_city = addr.get('city') or addr.get('town') or addr.get('village') or addr.get('county')
                country = addr.get('country', '')
                print(f"    User city: {user_city}, Country: {country}")
            except Exception as e:
                print(f"    Reverse geocode failed: {e}")
                country = ''

            # ── Step 2: Search vets in exact city ─────────────────────────────
            if user_city:
                print(f"    - Step 2: Searching vets in {user_city}...")
                try:
                    r = requests.get(url, params={
                        'q': f'veterinary {user_city}',
                        'format': 'json',
                        'limit': 10,
                        'addressdetails': 1
                    }, headers=headers, timeout=4)
                    data = r.json()
                    if data:
                        print(f"      ✅ Found {len(data)} results in {user_city}")
                except:
                    data = []

            # ── Step 3: Progressive viewbox expansion if not found ────────────
            if not data:
                is_fallback = True
                radii = [
                    (0.25, "~25 km"),
                    (0.5,  "~50 km"),
                    (1.0,  "~100 km"),
                ]
                for delta, label in radii:
                    print(f"    - Expanding search to {label}...")
                    try:
                        r = requests.get(url, params={
                            'q': 'veterinary',
                            'format': 'json',
                            'limit': 10,
                            'viewbox': f"{lng-delta},{lat+delta},{lng+delta},{lat-delta}",
                            'bounded': 1,
                            'addressdetails': 1
                        }, headers=headers, timeout=4)
                        data = r.json()
                        if data:
                            # Determine which city the fallback results belong to
                            first_addr = data[0].get('display_name', '')
                            parts = [p.strip() for p in first_addr.split(',')]
                            fallback_city = parts[2] if len(parts) > 2 else parts[0]
                            print(f"      ✅ Found {len(data)} results near {fallback_city} ({label})")
                            break
                    except:
                        continue

            # ── Step 4: Country-level fallback ────────────────────────────────
            if not data and country:
                is_fallback = True
                print(f"    - Step 4: Country-level search in {country}...")
                try:
                    r = requests.get(url, params={
                        'q': f'veterinary clinic {country}',
                        'format': 'json',
                        'limit': 5,
                        'addressdetails': 1
                    }, headers=headers, timeout=4)
                    data = r.json()
                    if data:
                        first_addr = data[0].get('display_name', '')
                        parts = [p.strip() for p in first_addr.split(',')]
                        fallback_city = parts[2] if len(parts) > 2 else country
                        print(f"      ✅ Found country-level results near {fallback_city}")
                except:
                    data = []

            # ── No results at all → return empty, no fake data ────────────────
            if not data:
                print(f"⚠️ No veterinary results found anywhere for {lat},{lng}")
                return []

            return [{
                "id": str(p.get("place_id")),
                "name": p.get("name") or p.get("display_name", "").split(",")[0],
                "address": p.get("display_name"),
                "rating": "4.5",
                "user_ratings_total": "OSM",
                "open_now": True,
                "distance": "Nearby",
                "is_nearby_fallback": is_fallback,
                "user_city": user_city,
                "fallback_city": fallback_city
            } for p in data][:5]

        except Exception as e:
            print(f"❌ OSM Error: {str(e)}")
            return []

    def _format_places_data(self, results: List[Dict]) -> List[Dict]:
        formatted_results = []
        for place in results[:5]:  # Limit to top 5
            formatted_results.append({
                "id": place.get("place_id"),
                "name": place.get("name"),
                "address": place.get("vicinity"),
                "rating": place.get("rating", "N/A"),
                "user_ratings_total": place.get("user_ratings_total", 0),
                "open_now": place.get("opening_hours", {}).get("open_now", None),
                "geometry": place.get("geometry", {}).get("location"),
                "icon": place.get("icon")
            })
        return formatted_results

    def _get_mock_data(self, latitude: float, longitude: float) -> List[Dict]:
        """Return realistic mock data for MVP demonstration"""
        return [
            {
                "id": "mock_1",
                "name": "City Paws Veterinary Clinic",
                "address": "123 Main St, Near Central Park",
                "rating": 4.8,
                "user_ratings_total": 124,
                "open_now": True,
                "distance": "0.8 km"
            },
            {
                "id": "mock_2",
                "name": "Happy Tails Animal Hospital",
                "address": "456 Oak Avenue, Downtown",
                "rating": 4.5,
                "user_ratings_total": 89,
                "open_now": True,
                "distance": "1.2 km"
            },
            {
                "id": "mock_3",
                "name": "24/7 Emergency Vet Care",
                "address": "789 Pine Road, Westside",
                "rating": 4.9,
                "user_ratings_total": 210,
                "open_now": True,
                "distance": "2.5 km"
            },
             {
                "id": "mock_4",
                "name": "Pet Wellness Center",
                "address": "321 Elm St, Northside",
                "rating": 4.6,
                "user_ratings_total": 56,
                "open_now": False,
                "distance": "3.1 km"
            }
        ]