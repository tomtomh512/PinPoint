import os
import requests

# Load API Key from ,env file
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('API_KEY')

# API URL
url = "https://discover.search.hereapi.com/v1/discover"


# Takes a query search and results limit
def searchInput(querySearch, limit):
    params = {
        'at': '40.730610,-73.93524',
        'limit': limit,
        'q': querySearch,
        'apiKey': API_KEY
    }

    nyc_counties = {"New York", "Kings", "Queens", "Bronx", "Richmond"}

    response = requests.get(url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        resultList = data["items"]

        # Return list of results
        results = []

        for listing in resultList:
            name = listing["title"]
            id = listing["id"]
            address = listing["address"]["label"]
            county = listing["address"]["county"]
            lat = listing["position"]["lat"]
            long = listing["position"]["lng"]

            # If the listing's county is not in NYC
            if county in nyc_counties:
                results.append({
                    "name": name,
                    "id": id,
                    "address": address,
                    "lat": lat,
                    "long": long
                })

        return results

    else:
        return []