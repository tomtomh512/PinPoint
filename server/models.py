from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import datetime

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)


class Favorites(db.Model):
    __tablename__ = "favorites"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)
    location_name = db.Column(db.String(255), nullable=False)
    location_id = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    lat = db.Column(db.Float, nullable=False)
    long = db.Column(db.Float, nullable=False)

    user = db.relationship("User", backref="favorites")


class Planned(db.Model):
    __tablename__ = "planned"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)
    location_name = db.Column(db.String(255), nullable=False)
    location_id = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    lat = db.Column(db.Float, nullable=False)
    long = db.Column(db.Float, nullable=False)

    user = db.relationship("User", backref="planned")


# Many-to-Many Association Table
location_category = db.Table(
    "location_category",
    db.Column("location_id", db.String(255), db.ForeignKey("locations.id"), primary_key=True),
    db.Column("category_id", db.String(32), db.ForeignKey("categories.id"), primary_key=True)
)


class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), unique=True, nullable=False)


class Location(db.Model):
    __tablename__ = "locations"
    id = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    categories = db.relationship("Category", secondary=location_category, backref="locations")
