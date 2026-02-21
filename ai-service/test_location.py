"""
Quick test: Simulate a user in Ahmednagar to verify fallback city logic.
Run: python test_location.py
"""
from app.services.places_service import PlacesService

# Ahmednagar, Maharashtra coordinates
LAT = 19.0952
LNG = 74.7496

print(f"\n{'='*50}")
print(f"Testing with Ahmednagar coords: {LAT}, {LNG}")
print(f"{'='*50}\n")

service = PlacesService()
results = service.search_nearby_vets(LAT, LNG)

print(f"\n{'='*50}")
print(f"Results: {len(results)} clinics found")
if results:
    r = results[0]
    print(f"  is_nearby_fallback : {r.get('is_nearby_fallback')}")
    print(f"  user_city          : {r.get('user_city')}")
    print(f"  fallback_city      : {r.get('fallback_city')}")
    print(f"\nFirst result: {r.get('name')}")
    print(f"Address     : {r.get('address', '')[:80]}...")
else:
    print("  No results found.")
print(f"{'='*50}\n")
