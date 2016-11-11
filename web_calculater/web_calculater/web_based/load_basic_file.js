/**
 * Created by marlb on 2016/11/9.
 */
var fs = require("fs");
var events = require("events");
var Converter = require("csvtojson").Converter;
var querystring= require("querystring");


//读取两行文件：
function read_two_lines(query,response,postData) {
    //console.log("POST DATA: "+postData);
    var f_num = parseInt(querystring.parse(query).q_file);
    //console.log(typeof(f_num) );
    var tlf_lst=['../csv/个税税率.csv','../csv/绩效工资标准.csv'];
    var f_dir=tlf_lst[f_num];
    //console.log("f_dir: "+f_dir);
    var options = {encoding: 'utf8', flag: 'r'};
    //console.log("b4 reading");
    fs.readFile(f_dir, options, function (err, data) {
        //console.log("reading file");
        var this_file = {};
        if (err) {
            //console.log("have trouble reading "+f_dir+" "+err.message);
        } else {

            var lines = data.split("\n");
            var line_count = 1;
            var line = [];
            for (var i = 0; i < lines.length; i++) {

                var fields = lines[i].split(",");

                if (line_count == 1) {
                    for (var k = 0; k < fields.length; k++) {
                        this_file[fields[k]] = 0;
                        line.push(fields[k]);
                    }


                } else if (line_count == 2) {

                    for (var l = 0; l < fields.length; l++) {
                        this_file[line[l]] = fields[l];
                    }
                }
                line_count += 1;


            }

        }

        var f_JSON = JSON.stringify(this_file);
        response.writeHead(200,{"Content-Type": "application/json"});
        response.write(f_JSON);
        response.end();

    });
}
function read_other(query,response,postData){
    var converter = new Converter({ignoreEmpty:true});
    //console.log("in read 5");
    var f_num = parseInt(querystring.parse(query).q_file);
    //console.log(f_num);
    var tlf_lst=['../csv/五险费率.csv','../csv/本市职工月平均工资.csv','../csv/员工名单.csv'];
    var f_dir=tlf_lst[f_num];
    converter.on("end_parsed",function (jsonAray) {
        response.writeHead(200,{"Content-Type": "application/json"});
        var str = "";
        for (var lc=0; lc < jsonAray.length;lc++){
            str += JSON.stringify(jsonAray[lc])+" ";
        }
        response.write(str);
        response.end();
    });
   var f_read=fs.createReadStream(f_dir);
   f_read.pipe(converter);
    //console.log("done reading f");
}


exports.read_two_lines = read_two_lines;
exports.read_other = read_other;


