from flask import Flask
from flask_session import Session
from flask_cors import CORS

from models import db
from config import ApplicationConfig

from server.blueprints.api import api_bp
from server.blueprints.auth import auth_bp
from server.blueprints.favorites import favorites_bp
from server.blueprints.planned import planned_bp

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(api_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(favorites_bp)
app.register_blueprint(planned_bp)


if __name__ == '__main__':
    app.run(debug=True)
