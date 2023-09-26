'use strict';

/**
 * @file    server.js
 * @brief   basic nodeJS web server
 * @author  Sarah Rosanna Busch
 * @date    3 May 2022
 */

const http = require('http');
const url = require('url');
const fs = require('fs');

const PORT = 9999;

const server = new http.createServer(function (req, res) {
    var query = url.parse(req.url, true);  
    var filename = __dirname + query.pathname;

    if(req.method === 'POST') {
        req.setEncoding('utf8');
        req.on('data', function(data) {
            console.log(data);
            res.write(JSON.stringify({ack:true}));
            res.end();
        });
    } else if(req.method === 'GET') {
        fs.readFile(filename, function(err, data) {
            if(err) {
                res.writeHead(404, {'Content-Type': 'text'});
                return res.end("404 File Not Found: " + filename);
            }
            var mimeType = filename.match(/(?:html|js|css|svg)$/i);
            if(mimeType && mimeType[0] === 'js') {
                mimeType = "text/javascript";
            } else if(mimeType && mimeType[0] === 'svg') {
                mimeType = 'image/svg+xml';
            } else {
                mimeType =  mimeType ? 'text/' + mimeType : 'text/plain';
            }
            
            console.log('serving: ' + filename);
            res.writeHead(200, {'Content-Type': mimeType });
            res.write(data);
            res.end();
        });
    }
    
});

server.listen(PORT);

server.once('listening', function() {
    console.log('server listening on port ' + PORT);
});

server.on('error', function(e) {
    console.log('error code: ' + e.code);
});