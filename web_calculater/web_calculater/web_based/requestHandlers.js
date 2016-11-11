/**
 * Created by marlb on 2016/11/9.
 */
var querystring= require("querystring");
var fs = require("fs");

function start(query,response) {
    console.log("Request handler 'start' was called");
    var options = {encoding: 'utf8', flag: 'r'};
    fs.readFile('../html/index.html',options,function (err,data) {
        if (err){
            response.end(err.message);
        }else {
            console.log("read index");
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data);
            response.end();
        }
    });

}

exports.start=start;