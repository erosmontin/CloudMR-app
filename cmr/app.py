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
getROISAPI = os.environ.get("roisapi")

def fixCORS(response):
    response.headers['Access-Control-Allow-Origin']='*' # This is required to allow CORS
    response.headers['Access-Control-Allow-Headers']='*' # This is required to allow CORS
    response.headers['Access-Control-Allow-Methods']='*' # This is required to allow CORS
    return response

def login(event, context):
    r2=requests.post(loginAPI, data=event['body'], headers=getHeadersForRequests())
    return fixCORS(r2).text


def logout(event, context):
    body = json.loads(event['body'])
    # Get the headers from the event object.
    headers = event['headers']
    # Get the authorization header.
    authorization_header = headers['authorization']
    # Get the application and pipeline names.
    r2=requests.post(logoutAPI, data=event['body'], headers=getHeadersForRequestsWithToken(authorization_header))
    return fixCORS(r2).text


def getROISlist(event, context):
    # get piepline_id from aws api gateway event get
    print("event")
    print(event['queryStringParameters'])
    
    pipeline_id = event['queryStringParameters']['pipeline_id']
    if pipeline_id is None:
        # return "pipeline_id is required" in a json format with anerror code status 
        return fixCORS({
            'statusCode':405 ,
            'body': json.dumps('pipeline_id is required')
        })
    # Get the headers from the event object.
    headers = event['headers']
    # Get the authorization header.
    print(headers)
    authorization_header = headers['authorization']
    # Get the application and pipeline names.
    url=f'{getROISAPI}/{pipeline_id}'
    print(url)
    r2=requests.get(url,headers=getHeadersForRequestsWithToken(authorization_header))
    print(r2.text)
    return fixCORS(r2).text