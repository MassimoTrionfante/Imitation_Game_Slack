import functools
from flask import redirect, request, session, url_for, render_template
from werkzeug.security import check_password_hash, generate_password_hash
from flask_pymongo import PyMongo


