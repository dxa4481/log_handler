var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var express = require("express");
var options = require("./options.js");

var connectWithRetry = function(){
    return mongoose.connect(options.dbHost, function(err){
        if(err){
           setTimeout(connectWithRetry, 5000);
        }
    });
}
var express = require('express');
var app = express();
app.use(bodyParser.json());


var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var logSchema = new Schema({
    internalIPs: [String],
    externalIPs: {
        ipv4: [String],
        ipv6: [String]   
    },
    fingerprintHash: String,
    userAgent: String,
    date: { type: Date, default: Date.now }
});

var Log = mongoose.model('Log', logSchema);

app.post('/loggingEndpoint', function(req, res){
    var newLog = new Log();
    newLog.internalIPs = req.body.internalIPs;
    newLog.externalIPs = req.body.externalIPs;
    newLog.fingerprintHash = req.body.fingerprintHash;
    newLog.userAgent = req.body.userAgent;
    newLog.save(function(err){
        if(err){
            return res.sendStatus(400);
        }else{
            return res.sendStatus(200);
        }
    });
});

app.listen(8002);
