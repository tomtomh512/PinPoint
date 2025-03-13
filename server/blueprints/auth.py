from flask import Blueprint, request, jsonify, session
from flask_bcrypt import Bcrypt
import re
from models import db, User

auth_bp = Blueprint('auth', __name__)

bcrypt = Bcrypt()

# If logged in, return info on current logged in user
@auth_bp.route("/verify")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "username": user.username
    })


@auth_bp.route("/register", methods=["POST"])
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


@auth_bp.route("/login", methods=["POST"])
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


@auth_bp.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully"}), 200