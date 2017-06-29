'use strict';

var PropertiesReader = require('properties-reader');
var iisreset = require('iis-reset');
var fs = require('fs');
var ncp = require('ncp').ncp;
var isNumeric = require("isnumeric");

exports.getfileversion = function(req, res) {
    var exec = require('child_process').exec;

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    //var responseBody = JSON.stringify(req.body);
    //var pathString = responseBody.substring(9, (responseBody.length - 2));
    var requestPath = JSON.stringify(req.body.path);
    var pathString = requestPath.substring(1, (requestPath.length - 1)); //remove quotation marks
    //console.log(pathString);
    console.log("["+dateTime+"] Fetching version information for " + pathString);
    try{
        exec('wmic datafile where name=\'' + pathString + '\' get Version', function(err,stdout, stderr){
            if(!err){
				var begin = 0;
				var end = stdout.length;
				var endCounter = 0;
				var foundNumeral = 0;
				
                //Removes leading and following extra characters from the version number
				while (foundNumeral == 0){
					if (!isNumeric(stdout.substring(begin, (begin+1))))
					{
						begin = begin + 1;
					}
					else {
						foundNumeral = 1;
					}
				}
				foundNumeral = 0;				
				while (foundNumeral == 0){
					if (!isNumeric(stdout.substring((stdout.length - endCounter - 1), (stdout.length - endCounter))))
					{
						endCounter = endCounter + 1;
						end = end - 1;
					}else
					{
						foundNumeral = 1;
					}
				}
                res.json({ message: stdout.substring(begin,end) });
                //res.json({ message: stdout})
            }
            else {
                res.json({ message: stderr});
            }
        });
    }
    catch(err)
    {
        console.log(err);
    }
};

exports.stopIIS = function(req, res) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var opts = {server : "localhost", action: "stop"};  // actions : start, stop & restart 
    
    console.log("["+dateTime+"] Stop IIS request");
    iisreset(opts).then(function(output){
        console.log("IIS stopped successfully",output);
        res.json(({ message: "success"}));
    }).catch(function(err){
        console.log(err);
        res.json(({ message: err}));
    });
};

exports.startIIS = function(req, res) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var opts = {server : "localhost", action: "start"};  // actions : start, stop & restart 

    console.log("["+dateTime+"] Start IIS request");    
    iisreset(opts).then(function(output){
        console.log("IIS started successfully",output);
        res.json(({ message: "success"}));
    }).catch(function(err){
        console.log(err);
        res.json(({ message: err}));
    });
};

exports.resetIIS = function(req, res) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var opts = {server : "localhost", action: "restart"};  // actions : start, stop & restart 

    console.log("["+dateTime+"] Restart IIS request");    
    iisreset(opts).then(function(output){
        console.log("IIS successfully restarted",output);
        res.json(({ message: "success"}));
    }).catch(function(err){
        console.log(err);
        res.json(({ message: err}));
    });
};

exports.copyFile = function(req, res) {
    var sourcePath = req.body.source;
    var destPath = req.body.destination;
	
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log("["+dateTime+"] Copying file from " + sourcePath + " to " + destPath);
	
	var rd = fs.createReadStream(sourcePath);
		rd.on("error", function(err) {
		console.log(err);
    });
    var wr = fs.createWriteStream(destPath);
		wr.on("error", function(err) {
		console.log(err);
    });
    wr.on("close", function(ex) {
		res.json(({ message: "success"}));
    });
    rd.pipe(wr);
};

exports.copyFolder = function(req, res) {
    var sourcePath = req.body.source;
    var destPath = req.body.destination;
	
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log("["+dateTime+"] Copying folder from " + sourcePath + " to " + destPath);
	
    ncp(sourcePath, destPath, function (err) {
    if (err) {
        return console.error(err);
    }
    res.json(({ message: "success"}));
    });
};

exports.clearFolder = function(req, res) {
    var sourcePath = req.body.path + "\\";
	var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    console.log("["+dateTime+"] Removing files and subfolders from " + sourcePath);
	
	var rmDir = function(dirPath, removeSelf) {
      if (removeSelf === undefined)
        removeSelf = true;
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
      if (removeSelf)
        fs.rmdirSync(dirPath);
    };
	
	try{
		rmDir(sourcePath, false);
		res.json({ message: "success"});
		console.log("Success!");
	}catch(err)
	{
		console.log(err);
		res.json({ message: err});
	}
    
};