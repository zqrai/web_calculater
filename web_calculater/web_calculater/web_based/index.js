/**
 * Created by marlb on 2016/11/9.
 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var load_basic_files=require("./load_basic_file");
var handle = {};
handle["/"]=requestHandlers.start;
handle["/start"]=requestHandlers.start;
handle["/read_two_lines"]=load_basic_files.read_two_lines;
handle["/read_other"]=load_basic_files.read_other;
server.start(router.route,handle);
