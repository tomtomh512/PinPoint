from flask import Flask, request, jsonify
from search import searchInput

app = Flask(__name__)


@app.route('/search', methods=['GET'])
def search():
    searchQuery = request.args.get('search')
    searchResults = searchInput(searchQuery, 100)

    return jsonify({"results": searchResults})


if __name__ == '__main__':
    app.run(debug=True)