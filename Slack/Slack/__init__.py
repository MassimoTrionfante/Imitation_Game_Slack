import os
from flask import Flask
from flask import render_template

def create_app(test_config=None):
  app = Flask(__name__,instance_relative_config=True)
  app.config.from_mapping(
    SERCET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
  )

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

  return app;
