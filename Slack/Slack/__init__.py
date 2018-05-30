import os
import pymongo
from flask import Flask
from flask import render_template
from . import db

def create_app(test_config=None):
  app = Flask(__name__,instance_relative_config=True)

  if test_config is None:
    app.config.from_pyfile('config.py',silent=True)
  else:
    app.config.from_mapping(test_config)

  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  @app.route('/')
  def index():
    return render_template('index.html')

  @app.route('/signin')
  def signIn():
    return render_template('signin.html')

  @app.route('/signindomain')
  def signInDomain():
    return render_template('signindomain.html')

  @app.route('/main')
  def main():
    return render_template('main.html')

  @app.route('/register')
  def register():
    return render_template('register.html')

  @app.route('/insert')
  def insert():
    database = db.getDB()
    database = db.addDocument(database.collezione,{"nome":"dio"})    
    return "Documento aggiunto."    

  @app.route('/resetDB')
  def nuke():
    database = db.getDB()
    database = db.deleteAll(database.collezione)
    return "Collezione eliminata!"


  return app
