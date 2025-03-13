from flask import Blueprint, request, jsonify, session
from models import db, Favorites, Location, Category

favorites_bp = Blueprint("favorites", __name__)


@favorites_bp.route("/favorites", methods=["POST"])
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
    existing_favorite = Favorites.query.filter_by(user_id=user_id, location_id=location_id).first()
    if existing_favorite:
        return jsonify({"error": f"{location_name} is already in favorites"}), 409

    # Create favorite entry
    new_favorite = Favorites(user_id=user_id, location_name=location_name, location_id=location_id, address=address,
                            lat=lat, long=long)
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


@favorites_bp.route("/favorites", methods=["GET"])
def get_favorites():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    favorites = Favorites.query.filter_by(user_id=user_id).all()
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


@favorites_bp.route("/favorites/<favorite_id>", methods=["DELETE"])
def remove_favorite(favorite_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    favorite = Favorites.query.filter_by(id=favorite_id, user_id=user_id).first()
    if not favorite:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Favorite removed successfully"}), 200


@favorites_bp.route("/favorites/categories", methods=["GET"])
def get_favorite_categories():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Get all favorite locations for the user
    favorites = Favorites.query.filter_by(user_id=user_id).all()
    category_set = set()

    # Collect unique categories from favorite locations
    for fav in favorites:
        location = Location.query.filter_by(id=fav.location_id).first()
        if location:
            for category in location.categories:
                category_set.add((category.id, category.name))

    categories = [{"id": cat_id, "name": cat_name} for cat_id, cat_name in category_set]

    return jsonify({"categories": categories})