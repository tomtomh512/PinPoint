import os
import requests

# Load API Key from ,env file
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('API_KEY')

# API URL
url = "https://discover.search.hereapi.com/v1/discover"


# Takes a query search and results limit
def searchInput(querySearch, lat, long, limit):

    params = {
        'at': lat + "," + long,
        'limit': limit,
        'q': querySearch,
        'apiKey': API_KEY
    }

    # Print the full GET URL
    # request = requests.Request('GET', url, params=params)
    # prepared = request.prepare()
    # print("GET URL:", prepared.url)

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
            lat = listing["position"]["lat"]
            long = listing["position"]["lng"]
            categories = listing.get("categories", [])
            contacts = listing.get("contacts", [])
            hours = listing.get("openingHours", [])

            results.append({
                "name": name,
                "id": id,
                "address": address,
                "lat": lat,
                "long": long,
                "categories": categories,
                "contacts": contacts,
                "hours": hours
            })

        return results

    else:
        return []