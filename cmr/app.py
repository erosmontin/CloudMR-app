import json
import requests
import boto3
import os
import os
os.environ['CURL_CA_BUNDLE'] = ''

def getHeadersForRequests():
    return {"Content-Type": "application/json","User-Agent": 'My User Agent 1.0','From': 'theweblogin@iam.com','Accept':'*/*'}

def getHeadersForRequestsWithToken(token):
    headers = getHeadersForRequests()
    headers["Authorization"]= token
    return headers

loginAPI = os.environ.get("loginapi")
logoutAPI = os.environ.get("logoutapi")

def login(event, context):
    r2=requests.post(loginAPI, data=event['body'], headers=getHeadersForRequests())
    r2.headers['Access-Control-Allow-Origin']='*'
    return r2.text


def logout(event, context):
    body = json.loads(event['body'])
    # Get the headers from the event object.
    headers = event['headers']
    # Get the authorization header.
    authorization_header = headers['Authorization']
    # Get the application and pipeline names.
    r2=requests.post(logoutAPI, data=event['body'], headers=getHeadersForRequestsWithToken(authorization_header))
    return r2.text
