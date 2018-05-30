# All database functions go here

import pymongo
from flask import Flask
from flask import g
from pymongo import MongoClient

def getDB():
  db = MongoClient()
  return db.Slack

def addDocument(collezioneInput, dizionarioInput):
  collezioneInput.insert(dizionarioInput)
  for doc in collezioneInput.find():
    print([doc['nome']])

def deleteAll(collezioneInput):
  collezioneInput.remove({})
  return "Cancellato TUTTO!"
