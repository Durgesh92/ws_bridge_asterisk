/*
 * SPDX-FileCopyrightText: Copyright (c) 2022 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
 * SPDX-License-Identifier: MIT
 */

require('dotenv').config({ path: 'env.txt' });

const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const https = require('https');
const express = require('express');
const http = require('http');

const { audioCodesControlMessage, wsServerConnection, wsServerClose }  = require('./modules/audiocodes');

const RivaASRClient = require('./riva_client/asr');

const app = express();
const port = (process.env.PORT);
var server;

//var sslkey = './certificates/key.pem';
//var sslcert = './certificates/cert.pem';

//var sslkey = './healthRE/healthintern.key';
//var sslcert = './healthRE/certificate.crt';

var sslcert = './certificates/certificate.crt';
var sslkey = './certificates/private.key'

/**
 * Set up Express Server with CORS and websockets ws
 */
function setupServer() {
    // set up Express
    app.use(express.static('web')); // ./web is the public dir for js, css, etc.
    app.get('/', function (req, res) {
        res.sendFile('./web/index.html', { root: __dirname });
    });
    

    server = http.createServer(app);
	
    const wsServer = new WebSocket.Server({ server });

    // Listener, once the client connects to the server socket
    wsServer.on('connection', function connection(ws, req) {
	console.log('connection');
        wsServerConnection(ws, req);
    });
    wsServer.on('close', function close(reason) {
	console.log('close');
        wsServerClose(reason)
    });


    server.listen(port, () => {
        console.log('Running server on port %s', port);
    });
};

setupServer();

