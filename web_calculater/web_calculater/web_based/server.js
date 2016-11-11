/**
 * Created by marlb on 2016/11/9.
 */
var http = require("http");
var url = require("url");
var qstring = require("querystring");

function start(route,handle){
    function onRequest(request,response){
        var postData ="";
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;

        //console.log("Requests for"+pathname+" received");
        //console.log("query: "+query);
        request.setEncoding("utf8");

        request.addListener("data",function (postDataChunk) {
            postData += postDataChunk;
            //console.log("Received POST chunk: "+postDataChunk +".");
        });

        request.addListener("end",function () {
            route(handle,pathname,query,response,postData);

        });
    }
    http.createServer(onRequest).listen(8888);
    console.log("Sever has started");
}

exports.start = start;