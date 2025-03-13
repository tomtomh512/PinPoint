from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
import re

from models import db, User, Favorite, Planned, Category, Location
from config import ApplicationConfig
from search import searchQuery, searchID

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/searchQuery', methods=['GET'])
def search():
    query = request.args.get('query')
    lat = request.args.get('lat')
    long = request.args.get('long')

    searchResults = searchQuery(query, lat, long, 50)
    return jsonify({"results": searchResults})


@app.route('/searchID', methods=['GET'])
def searchbyID():
    id = request.args.get('id')

    searchResult = searchID(id)
    return jsonify({"result": searchResult})


# If logged in, return info on current logged in user
@app.route("/verify")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "username": user.username
    })


@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]

    # Password validation regex
    password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

    if not re.match(password_regex, password):
        return jsonify({
            "message": "Password must be at least 8 characters long, include one uppercase letter, "
                       "one lowercase letter, one number, and one special character."
        }), 400

    # If user exists with that username
    user_exists = User.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"message": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Issue session cookie
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    })


@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"message": "Incorrect username or password"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Incorrect username or password"}), 401

    # Issue session cookie
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "username": user.username
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/favorites", methods=["POST"])
def add_favorite():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    location_name = data.get("location_name")
    location_id = data.get("location_id")
    address = data.get("address")
    categories = data.get("categories", [])
    lat = data.get("lat")
    long = data.get("long")

    if not user_id or not location_name or not location_id or not address:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the location is already in favorites
    existing_favorite = Favorite.query.filter_by(user_id=user_id, location_id=location_id).first()
    if existing_favorite:
        return jsonify({"error": f"{location_name} is already in favorites"}), 409

    # Create favorite entry
    new_favorite = Favorite(user_id=user_id, location_name=location_name, location_id=location_id, address=address, lat=lat, long=long)
    db.session.add(new_favorite)

    # Ensure location exists in the locations table
    location = Location.query.filter_by(id=location_id).first()
    if not location:
        location = Location(id=location_id, name=location_name)
        db.session.add(location)

    # Process categories
    for category_data in categories:
        category_id = category_data.get("id")
        category_name = category_data.get("name")

        if not category_id or not category_name:
            continue

        category = Category.query.filter_by(id=category_id).first()
        if not category:
            category = Category(id=category_id, name=category_name)
            db.session.add(category)

        if category not in location.categories:
            location.categories.append(category)

    db.session.commit()

    return jsonify({"message": "Location added to favorites"}), 201


@app.route("/favorites", methods=["GET"])
def get_favorites():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    favorites = Favorite.query.filter_by(user_id=user_id).all()
    results = []

    for fav in favorites:
        location = Location.query.filter_by(id=fav.location_id).first()
        categories = [{"id": cat.id, "name": cat.name, "primary": False} for cat in
                      location.categories] if location else []

        results.append({
            "id": fav.id,
            "name": fav.location_name,
            "location_id": fav.location_id,
            "address": fav.address,
            "date_added": fav.date_added,
            "categories": categories,
            "lat": fav.lat,
            "long": fav.long,
            "listing_type": "favorite"
        })

    return jsonify({"results": results})


@app.route("/favorites/<favorite_id>", methods=["DELETE"])
def remove_favorite(favorite_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    favorite = Favorite.query.filter_by(id=favorite_id, user_id=user_id).first()
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Favorite removed successfully"}), 200



@app.route("/planned", methods=["POST"])
def add_planned():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    location_name = data.get("location_name")
    location_id = data.get("location_id")
    address = data.get("address")
    categories = data.get("categories", [])
    lat = data.get("lat")
    long = data.get("long")

    if not user_id or not location_name or not location_id or not address:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the location is already in planned locations
    existing_planned = Planned.query.filter_by(user_id=user_id, location_id=location_id).first()
    if existing_planned:
        return jsonify({"error": f"{location_name} is already in planned"}), 409

    # Create planned entry
    new_planned = Planned(user_id=user_id, location_name=location_name, location_id=location_id, address=address, lat=lat, long=long)
    db.session.add(new_planned)

    # Ensure location exists in the locations table
    location = Location.query.filter_by(id=location_id).first()
    if not location:
        location = Location(id=location_id, name=location_name)
        db.session.add(location)

    # Process categories
    for category_data in categories:
        category_id = category_data.get("id")
        category_name = category_data.get("name")

        if not category_id or not category_name:
            continue

        category = Category.query.filter_by(id=category_id).first()
        if not category:
            category = Category(id=category_id, name=category_name)
            db.session.add(category)

        if category not in location.categories:
            location.categories.append(category)

    db.session.commit()

    return jsonify({"message": "Location added to planned"}), 201


@app.route("/planned", methods=["GET"])
def get_planned():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    planned_locations = Planned.query.filter_by(user_id=user_id).all()
    results = []

    for planned in planned_locations:
        location = Location.query.filter_by(id=planned.location_id).first()
        categories = [{"id": cat.id, "name": cat.name, "primary": False} for cat in
                      location.categories] if location else []

        results.append({
            "id": planned.id,
            "name": planned.location_name,
            "location_id": planned.location_id,
            "address": planned.address,
            "date_added": planned.date_added,
            "categories": categories,
            "lat": planned.lat,
            "long": planned.long,
            "listing_type": "planned"
        })

    return jsonify({"results": results})


@app.route("/planned/<planned_id>", methods=["DELETE"])
def remove_planned(planned_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    planned = Planned.query.filter_by(id=planned_id, user_id=user_id).first()
    if not planned:
        return jsonify({"error": "Planned location not found"}), 404

    db.session.delete(planned)
    db.session.commit()

    return jsonify({"message": "Planned location removed successfully"}), 200



if __name__ == '__main__':
    app.run(debug=True)
