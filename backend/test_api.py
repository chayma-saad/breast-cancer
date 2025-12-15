"""
Quick test to check if backend API is working
"""
import requests
import sys

try:
    # Test root endpoint
    response = requests.get("http://localhost:8000/", timeout=5)
    print(f"✓ Backend is running: {response.status_code}")
    print(f"  Response: {response.json()}")
except requests.exceptions.ConnectionError:
    print("✗ Backend is NOT running on port 8000")
    print("  Start it with: py -m uvicorn main:app --host 0.0.0.0 --port 8000")
    sys.exit(1)
except Exception as e:
    print(f"✗ Error connecting to backend: {e}")
    sys.exit(1)

try:
    # Test metrics endpoint
    response = requests.get("http://localhost:8000/metrics", timeout=5)
    print(f"✓ Metrics endpoint works: {response.status_code}")
except Exception as e:
    print(f"✗ Metrics endpoint error: {e}")

print("\nBackend is ready for predictions!")

