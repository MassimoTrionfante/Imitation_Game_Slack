# UTENTI IN db.Lasck.utenti (used for the registration/login form)
# email, username, workspace, nick, password
# CHAT IN db.Lasck.chat (used for loading stuff before doing anything)
# workspace, utente, numCanali
# CANALI IN db.Lasck.canali (used to store messages inside channels)
# workspace, numCanale, autore, messaggio, ora


import os
import pprint
import pymongo
import time
from flask import g, Flask, flash, render_template, redirect, request, session, url_for, jsonify
from pymongo import MongoClient
from bson.json_util import dumps

#Collect database method
def get_db():
  client = MongoClient('localhost',27017)
  db = client.Lasck
  return db

def create_app(test_config=None):
  app = Flask(__name__,instance_relative_config=True)
  app.config.from_mapping(SECRET_KEY='dev')

  if test_config is None:
    app.config.from_pyfile('config.py',silent=True)
  else:
    app.config.from_mapping(test_config)

  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  #Main page
  @app.route('/', methods=['GET','POST'])
  def index():
    session.clear() #Session clears at main page, since logout straight brings you in here
    if request.method=='POST':
      return redirect(url_for('register'))
    return render_template('index.html')

  #Sign in form
  @app.route('/signin', methods=['GET','POST'])
  def signIn():
    if request.method=='POST':
      email=request.form['email']
      workspace=request.form['workspace']
      password=request.form['password']

      error=None
      db=get_db()
      user = db.utenti.find_one({'email':email})
      work = db.utenti.find_one({'workspace':workspace})
      documento = db.utenti.find_one({'email':email,'workspace':workspace})
      checkpwd = db.utenti.find_one({'email':email,'workspace':workspace,'password':password})
      userId = db.utenti.find_one({'email':email,'workspace':workspace,'password':password})
      #Check that user is registered in Lasck + check that workspace exists
      if user is None:
        error= "ERROR: User does not exist!"
      elif work is None:
        error= "ERROR: Workspace does not exist!"
      #Check that user is inside that workspace
      elif documento is None:
        error= "ERROR: User isn't binded to that workspace!"
      #Check that user nailed password
      elif checkpwd is None:
        error= "ERROR: Password is incorrect!"

      if error is None:
        session.clear()
        session['user']= userId['username']
        session['email']= userId['email']
        session['work']= userId['workspace']
        return redirect(url_for('main'))
     
      flash(error)
    return render_template('signin.html')


  # UTENTI IN db.Lasck.utenti (used for the registration/login form)
  # email, username, workspace, nick, password
  # CANALI IN db.Lasck.canali (used to store messages inside channels)
  # workspace, numCanale, autore, messaggio, ora
  #Main chat ---------------------------------------------------------
  @app.route('/main', methods=['GET','POST'])
  def main():
    db=get_db()
    user = session.get('user')
    workspace = session.get('work')
    g.work= workspace
    g.user= user

    g.channelMessages = db.canali.find({'workspace':workspace,'numCanale':1})

    #Get list of users to put in purple bar
    g.listUser = db.utenti.find({'workspace':workspace})
    g.countUser = db.utenti.find({'workspace':workspace}) 
    #Count users inside workspace
    g.numUsers=0
    for k in g.countUser:
      g.numUsers=g.numUsers+1

    #Add sent message
    if request.method=='POST':
      # Add new message in that channel
      messaggio = request.form['chat']
      if len(messaggio) > 0:
        db.canali.insert({"workspace":workspace,'numCanale':1,'autore':user,'messaggio':messaggio,'ora':time.strftime('%H:%M:%S')})

    return render_template('main.html')

  #-------------------------------------------------------------------
  #Methods for creating a workspace
  #Form with mail
  @app.route('/register', methods=['GET','POST'])
  def register():    
    if request.method=='POST':
      email=request.form['email'] #Get various input fields
      username=request.form['username']
      nick=request.form['nick']
      workspace=request.form['workspace']
      password=request.form['password']

      if nick is None: #This if somehow doesn't work w/e
        nick=request.form['username'] #Nick will be username if nick is null

      #Do various checks before adding to DB:
      # -block if user is already in that workspace
      # -block if workspace already exists
      error=None
      db=get_db()
      documento = db.utenti.find_one({'email':email,'workspace':workspace})
      checkpwd = db.utenti.find_one({'workspace':workspace,'password':password})
      #Check that user is registered in Lasck + check that workspace exists
      if documento is not None:
        error="ERROR: This user is already in the workspace!"
      elif checkpwd is None and documento is not None:
        error="ERROR: Wrong password!"
      if error is None:
        db.utenti.insert({"email":email, "username":username,"workspace":workspace, "nick":nick, "password":password})
        print("Added following document:")
        pprint.pprint(db.utenti.find_one({"email":email,"workspace":workspace}))
        return redirect(url_for('signIn'))
     
      else:
        flash(error)
    return render_template('register.html')
 

  @app.route('/resetDB')
  def nuke():
    db = get_db()
    db.utenti.remove({})
    db.canali.remove({})
    return "Collezioni eliminate!"

#................From here on, only POST methods, used as interface for phone
#app of Slack................................................................

  #Check workspace
  @app.route('/checkWorkspace/<workspace>', methods=['POST'])
  def checkwork(workspace):
    db=get_db()
    hasWork = db.utenti.find_one({'workspace':workspace})
    if hasWork is None:
      return "Error: this workspace doesn't exist!"
    else:
      return "OK"

  #Check mail inside the workspace
  @app.route('/checkMail/<workspace>/<email>', methods=['POST'])
  def checkmail(workspace, email):
    db = get_db()
    hasMail = db.utenti.find_one({'email':email,'workspace':workspace})
    if hasMail is None:
      return "Error: this user isn't registered in this workspace!"
    else:
      return "OK"

  #Check password inside the recognized user + workspace activity
  @app.route('/checkPass/<workspace>/<password>', methods=['POST'])
  def checkpass(workspace, password):
    db=get_db()
    hasPass = db.utenti.find_one({'workspace':workspace,'password':password})
    if hasPass is None:
      return "Error: wrong password!"
    else:
      return "OK"

  #Get user name depending on the mail used and on the workspace
  @app.route('/getUserName/<workspace>/<email>', methods=['POST'])
  def getName(workspace, email):
    db=get_db()
    utente = db.utenti.find_one({'email':email,'workspace':workspace})
    if utente is None:
      return 'NO_USER'
    return utente['username']
  
  #Get the list of users from that workspace
  @app.route('/getListUsers/<workspace>',methods=['POST'])
  def getListUsers(workspace):
    db=get_db()
    mieiUtenti = db.utenti.find({'workspace':workspace},{'_id':0,'email':0,'password':0,'workspace':0,'nick':0})
    return dumps(mieiUtenti)

  #Get the chat log, given the workspace
  @app.route('/getChat/<workspace>',methods=['POST'])
  def getChat(workspace):
    db=get_db()
    return dumps(db.canali.find({'workspace':workspace}))
    # workspace, numCanale, autore, messaggio, ora

  return app
