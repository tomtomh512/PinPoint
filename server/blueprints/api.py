from flask import Blueprint, request, jsonify
import os
import requests

# Load API Key from .env file
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('API_KEY')

api_bp = Blueprint("api", __name__)


@api_bp.route('/searchQuery', methods=['GET'])
def search():
    query = request.args.get('query')
    lat = request.args.get('lat')
    long = request.args.get('long')

    searchResults = searchQuery(query, lat, long, 50)
    return jsonify({"results": searchResults})


@api_bp.route('/searchID', methods=['GET'])
def searchbyID():
    id = request.args.get('id')

    searchResult = searchID(id)
    return jsonify({"result": searchResult})


def searchQuery(querySearch, lat, long, limit):
    params = {
        'at': lat + "," + long,
        'limit': limit,
        'q': querySearch,
        'apiKey': API_KEY
    }

    url = "https://discover.search.hereapi.com/v1/discover"

    # Print the full GET URL
    request = requests.Request('GET', url, params=params)
    prepared = request.prepare()
    print("GET URL:", prepared.url)

    response = requests.get(url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        resultList = data["items"]

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
                "location_id": id,
                "address": address,
                "lat": lat,
                "long": long,
                "categories": categories,
                "contacts": contacts,
                "hours": hours,
                "listing_type": "search"
            })

        return results

    else:
        return []


def searchID(hereID):
    params = {
        'id': hereID,
        'apiKey': API_KEY
    }

    url = "https://lookup.search.hereapi.com/v1/lookup"

    # Print the full GET URL
    request = requests.Request('GET', url, params=params)
    prepared = request.prepare()
    print("GET URL:", prepared.url)

    response = requests.get(url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        listing = response.json()

        name = listing["title"]
        id = listing["id"]
        address = listing["address"]["label"]
        lat = listing["position"]["lat"]
        long = listing["position"]["lng"]
        categories = listing.get("categories", [])
        contacts = listing.get("contacts", [])
        hours = listing.get("openingHours", [])

        result = {
            "name": name,
            "location_id": id,
            "address": address,
            "lat": lat,
            "long": long,
            "categories": categories,
            "contacts": contacts,
            "hours": hours
        }

        return result

    else:
        return {}
