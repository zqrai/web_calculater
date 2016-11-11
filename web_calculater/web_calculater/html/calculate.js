
var a_a="{\"类型\":\"公司\",\"养老保险\":0.21,\"医疗保险\":0.11,\"失业保险\":0.015,\"生育保险\":0.01,\"工伤保险\":0.005} {\"类型\":\"个人\",\"养老保险\":0.08,\"医疗保险\":0.02,\"失业保险\":0.005,\"生育保险\":0,\"工伤保险\":0}"
var a_b="{\"姓名\":\"小明\",\"基本工资\":27000,\"绩效评分\":\"A\",\"公积金\":0.07} {\"姓名\":\"小薇\",\"基本工资\":13000,\"绩效评分\":\"A\",\"公积金\":0.06} {\"姓名\":\"小沈\",\"基本工资\":10000,\"绩效评分\":\"C\",\"公积金\":0.05}"
function getCJSON(str){
    var J_obj = [];
    r_JSON = str.split(' ');
    //console.log("r_JSON: "+r_JSON);

    for (var record in r_JSON){
        if(r_JSON[record] != "") {
            var obj = JSON.parse(r_JSON[record]);
            J_obj.push(obj);
        }
    }
    //console.log(J_obj);
    return J_obj;
}
var pay_stand ={"A":"4000","B":"2000","C":"100","D":"0"};
var duty_rate= {"0":"0.03","1500":"0.1","4500":"0.2","9000":"0.25","35000":"0.3","55000":"0.35","80000":"0.45"};
var average_s= JSON.parse("{\"本市职工月平均工资\":5036}");
var five_rate = getCJSON(a_a);
var persons = getCJSON(a_b);

// 开始计算相关


//五险一金
var a_base = average_s["本市职工月平均工资"];
var ceiling = a_base*3;
var floor = a_base*0.6;
function found_cal(person){
    //先进行工资基数的判断
    var base = person["基本工资"];
    if (base<floor){
        base = floor;
    } else if (base>ceiling){
        base = ceiling;
    }
    for (var rates in five_rate){
        if (five_rate[rates]["类型"]=="公司"){
            //console.log("进了公司计算");
            person.c_yanglao=base*five_rate[rates]["养老保险"];
            person.c_yiliao = base*five_rate[rates]["医疗保险"];
            person.c_shiye = base*five_rate[rates]["失业保险"];
            person.c_shengyu = base*five_rate[rates]["生育保险"];
            person.c_gongshang = base*five_rate[rates]["工伤保险"];
            person.c_zhufang = base*person["公积金"];
            person.c_sum = person.c_yanglao+person.c_yiliao+person.c_shiye+person.c_shengyu+person.c_gongshang+person.c_zhufang;
            person.c_sum = person.c_sum.toFixed(2);
            console.log(person.c_sum);
        }
        if (five_rate[rates]["类型"]=="个人"){
            //console.log("进了个人计算");
            person.p_yanglao=base*five_rate[rates]["养老保险"];
            person.p_yiliao = base*five_rate[rates]["医疗保险"];
            person.p_shiye = base*five_rate[rates]["失业保险"];
            person.p_shengyu = base*five_rate[rates]["生育保险"];
            person.p_gongshang = base*five_rate[rates]["工伤保险"];
            person.p_zhufang = base*person["公积金"];
            person.p_sum = person.p_yanglao+person.p_yiliao+person.p_shiye+person.p_shengyu+person.p_gongshang+person.p_zhufang;
            person.p_sum =person.p_sum.toFixed(2);
            console.log(person.p_sum);
        }
    }

}
//得到有关个税计算基础值的对象
function duty_base() {
    var levels=Object.keys(duty_rate);
    var level_diff=[0];//数组：存储各级别固定扣税
    var level_reference={};//对象：将固定扣税与级别对应
    var diff = 0;
    for (var i=1;i<levels.length;i++) {
        diff += (levels[i] - levels[i - 1]) * duty_rate[levels[i - 1]];
        level_diff.push(diff);
    }
    //console.log(level_diff);
    for (var index in levels){
        //console.log(levels[index]);
        level_reference[levels[index]]=level_diff[index];
    }
    return level_reference;
}
 //税率计算
function duty_cal(person){
    person.jixiao=parseInt(pay_stand[person["绩效评分"]]);
    console.log("绩效： "+person.jixiao);
    person.shuiqian=parseFloat(person.jixiao+person["基本工资"]-person.p_sum).toFixed(2);
    console.log("税前：  "+person.shuiqian);
    //个税起征点
    var start_point = (person.shuiqian-3500).toFixed(2);

    if (start_point<0){
        person.duty=0;
    }
    var level_be ="0" //属于哪一级税收
    var d_levels=Object.keys(duty_rate);
    for (var index in d_levels){
        if (parseInt(d_levels[index])<=start_point){
            level_be=d_levels[index];
        }
    }
    //计算最终缴税
    person.duty=parseFloat((start_point-level_be)*duty_rate[level_be]+duty_reference[level_be]).toFixed(2);
    console.log("缴税： "+person.duty);

}




function test() {
    var object = {"0":"0.03", "1500":"0.1", "4500":"0.2", "9000":"0.25", "35000":"0.3", "55000":"0.35", "80000":"0.45"};
    var length = Object.keys(object).length;
    console.log(Object.keys(object));
    var result = [];
    for(var i = 1; i < length; i++) {
        var num = (Object.keys(object)[i] - Object.keys(object)[i - 1])*object[Object.keys(object)[i - 1]];
        result.push(num.toFixed(2));
    }
    console.log("result: "+result);
}
function per_cal(person){
    found_cal(person);
    duty_cal(person);

}
var duty_reference=new duty_base();

per_cal(persons[0]);
console.log(persons[0].c_yiliao);

