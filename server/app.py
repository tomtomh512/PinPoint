from flask import Flask, request, jsonify
from flask_cors import CORS
from search import searchInput
import requests

app = Flask(__name__)


CORS(app, supports_credentials=True)


@app.route('/getLocation', methods=['GET'])
def get_location():
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    response = requests.get(f'http://ipinfo.io/{ip}/json')
    data = response.json()

    lat_long = data.get("loc")
    if lat_long:
        lat, long = lat_long.split(",")
        return jsonify({"lat": lat, "long": long})

    return jsonify({"error": "Location not found"}), 404


@app.route('/search', methods=['GET'])
def search():
    searchQuery = request.args.get('search')
    lat = request.args.get('lat')
    long = request.args.get('long')

    searchResults = searchInput(searchQuery, lat, long, 50)
    return jsonify({"results": searchResults})


if __name__ == '__main__':
    app.run(debug=True)
