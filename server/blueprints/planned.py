from flask import Blueprint, request, jsonify, session
from models import db, Planned, Location, Category

planned_bp = Blueprint("planned", __name__)


@planned_bp.route("/planned", methods=["POST"])
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
    new_planned = Planned(user_id=user_id, location_name=location_name, location_id=location_id, address=address,
                          lat=lat, long=long)
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


@planned_bp.route("/planned", methods=["GET"])
def get_planned():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Get filters
    filters = []
    for key, value in request.args.items():
        if key == 'filters[]':
            filters.append(value)

    planned_locations = Planned.query.filter_by(user_id=user_id).all()

    # If filters are present, we need to filter the results based on the categories
    if filters:
        filtered_planned = []
        for plan in planned_locations:
            location = Location.query.filter_by(id=plan.location_id).first()
            if location:
                # Get the categories for the location
                categories = {cat.name for cat in location.categories}
                # Check if any of the filters match the location's categories
                if any(filter in categories for filter in filters):
                    filtered_planned.append(plan)
        planned_locations = filtered_planned  # Use the filtered planned list

    results = []

    # Prepare the results to return
    for plan in planned_locations:
        location = Location.query.filter_by(id=plan.location_id).first()
        categories = [{"id": cat.id, "name": cat.name, "primary": False} for cat in
                      location.categories] if location else []

        results.append({
            "id": plan.id,
            "name": plan.location_name,
            "location_id": plan.location_id,
            "address": plan.address,
            "date_added": plan.date_added,
            "categories": categories,
            "lat": plan.lat,
            "long": plan.long,
            "listing_type": "planned"
        })

    return jsonify({"results": results})


@planned_bp.route("/planned/<planned_id>", methods=["DELETE"])
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


@planned_bp.route("/planned/categories", methods=["GET"])
def get_planned_categories():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Get all planned locations for the user
    planned_locations = Planned.query.filter_by(user_id=user_id).all()
    category_set = set()

    # Collect unique categories from planned locations
    for planned in planned_locations:
        location = Location.query.filter_by(id=planned.location_id).first()
        if location:
            for category in location.categories:
                category_set.add((category.id, category.name))

    categories = [{"id": cat_id, "name": cat_name} for cat_id, cat_name in category_set]

    return jsonify({"categories": categories})

