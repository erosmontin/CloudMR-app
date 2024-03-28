/*
Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 300

const { v4: uuidv4 } = require('uuid');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const HOST = process.env.Host;
const axios = require('axios');

// Main Lambda entry point
exports.handler = async (event) => {
    return await get_profile(event);
}
const getHeadersForRequests = () => {
    return {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
        'Accept-Encoding': 'none',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'User-Agent': 'curl',
        'From': 'devn@cloudmrhub.com',
        'Host': HOST
    };
}

const getHeadersForRequestsWithToken = (token) => {
    const headers = getHeadersForRequests();
    headers["authorization"] = token;
    return headers;
}
const get_profile = async (event) => {
    // try {
    // Post file metadata to cloudmrhub.com API
    const headers = getHeadersForRequestsWithToken(event.headers['authorization']);
    const response = await axios.get(`https://${HOST}/api/auth/profile`, {
        headers: headers
    });
    if (response.status !== 200) {
        throw new Error("Failed to retrieve pipelines from cloudmrhub.com");
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(response.data)
    };
    // return {statusCode: 200}
    // } catch (error) {
    //     console.error(`Uploading data failed due to: ${error.message}`);
    //     return {
    //         statusCode: 403,
    //         headers: {
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         body: "Upload failed for user"
    //     };
    // }
}