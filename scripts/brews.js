// JavaScript Document

var express = require('express');
var app = express();
const http = require('http');
const brewdb = require('./brewerydb');
const port = 3000;
const requestHandler = (request, response) => {  
  brewdb.searchAll('four peaks', function (err, body) {
  response.end(JSON.stringify(body, null, 2));
  });
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err);
  }

 }); 	
