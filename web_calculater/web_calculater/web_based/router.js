/**
 * Created by marlb on 2016/11/9.
 */
function route(handle,pathname,query,response,postData) {
    console.log("About to route a request for: "+pathname);
    console.log(handle[pathname]);
    if (typeof handle[pathname]=="function"){
        handle[pathname](query,response,postData);
    }else{
        console.log("no request handler for"+pathname);
        response.writeHead(404,{"Content-Type":"text/plain"});
        response.write("404 Not found");
        response.end();
    }
}
exports.route=route;