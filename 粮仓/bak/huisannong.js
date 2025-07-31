//先获取cookie,记住只能进https://hsn.sinograin.com.cn/mobile/html/main/main.html
//因为有个函数要借用js库
//cookie加载不上，可以关闭浏览器，cookie不能跨ip

//var yyr="徐哲林";
//var sjh="13470707126";
//var idCard="342321196610273619";
//var tjr="602e2b25f52349ee9832c25ee4664ac1";
var username="13865825470";
var password="qcb6582!";
//zznm是粮库码
var zznm="zh8080816c611ae0016c6138cd030005O0000000000000003485";

var cheshu="3";
var shuliang="150";
var chepai="皖M1C435,皖M1A803,皖M83881,";
var cllxnm="1,1,1,";
var cyrnm="ecc145d419c5461ca320e970f41af1d0,a2c544f1b3384705943e3beca5d54066,f864541bd34643638a132fe4ae79bb2c,";
var cyr="周喜军,朱同姜,茆志荣,";
var cyrsfz="341121197812181416,341181199606253410,342321197201083210,";
var cyrsjh="13866946234,18655093057,13516409548,";
//var userType="02";


var lsnm="200001";
var lscm="小麦";
var ywlx="0";

var yysqParams = {
			"yyr": "",
			"tjr": "",
			"sfz": "",
			"jsr": "",
			"phone": username,
			"lxfs": "",
			"pznm": "",
			"pzmxnm": "",
			"zznm": "",
			"zzmc": "",
			"rq": "",
			"lsnm": lsnm,
			"lsmc": lscm,
			"kssj": "",
			"jssj": "",
			"cs": cheshu,
			"sl": shuliang,
			"cphStr": chepai,
			"cllxNm": cllxnm,
			"cyrnm": cyrnm,	
            "tzdbh": "", //
            "ywlx": ywlx,//
			"cyr": cyr,
			"cyrsfzh": cyrsfz,
			"cyrsjh": cyrsjh,
			"qymc": "", //
			"xydm": "", //
			"userType": "",			
			"dxyzm": "",//短信验证码
			"mobileDeviceId": "",//
			"openId":"",//
			"secretData":"",
			"devicetype":"weixin"//
		};


function jsonToUrlencoded(json) {
    const pa = new URLSearchParams();
    for (let key in json) {
        pa.append(key, json[key]);
    }
    return pa.toString();
}

function jiancha(){

	var params = {
		'kdnm': zznm,
		'idCard': yysqParams.sfz,
		'ywlx': ywlx,
		'devicetype':'weixin'
	};
	
	fetch('https://hsn.sinograin.com.cn/slyyServlet/service/nhyy/getKdYyqkDays', {

    method: 'POST', // 指定请求方法
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
    body: jsonToUrlencoded(params)  // 转换数据格式并发送
    }).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {

	console.log(data.data);
	if (data) {
				if (data.retCode == '1') {
			
				    var json = data.data;					
				    if (json != '') {
		                if(json[1].xssyhsl>0){
                           
                           yysqParams.pznm = json[1].yypznm;
                           yysqParams.pzmxnm = json[1].yypzmxList[0].yypzmxnm;
                           yysqParams.zznm = json[1].zznm;
                           yysqParams.zzmc = json[1].zzmc;
                           yysqParams.rq = json[1].rq;
                           yysqParams.jssj = json[1].yypzmxList[0].jssj;
                           yysqParams.kssj = json[1].yypzmxList[0].kssj;

                           yysqParams = secretYysqParams(yysqParams);
			               yyksubmit();
		                }
					}
				}
			}else{
				//denglu();
				console.log("登录信息错误，请检查密码！");
				
			}

   });
}


//提交不成功，关注一下加密key和str+的字符
var publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApk08YJ+71NyV/M6IN23woPlYG8urnp5Mj1cK2QSIXBmU75qnEB2skSDH3Sz9KvShsKbhEMnckxV9TWIt9kY55fwEtaCiVxmkAoCv+47xu4iNZoO6s4WaP3MbEmEVB0Oxs+YRPxEzzvTP3eXIe6+nf480derjQGRq/6lacsmAZX6N6zzZ5jb+uZYrwJ7f+iPh0CP2qSJBlphPXNCsjLjl3psYsGUxdP3c9KSDQVYl6RYkHDk74PyBDjilUDB++Ftx35jvlFjSw+6tXuZnw3L88FlYgLQzEvPKO07Yx/zyRMXGJADCTP0mmm4uOe/HtrUlfpLNarCBI1t26w+xIxGkQQIDAQAB';;

function secretYysqParams(params) {
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(publicKey);
		var str = params.phone + "i" + params.pznm + "n" + params.pzmxnm + "s" + params.sfz + "p" + params.rq + "u" + params.cphStr + "r" + params.zznm;
		params.secretData = encrypt.encrypt(str);
		return params;
	}

function yyksubmit(){

     fetch('https://hsn.sinograin.com.cn/slyyServlet/service/nhyy/reserve', {

    method: 'POST', // 指定请求方法
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
    body: jsonToUrlencoded(yysqParams)  // 转换数据格式并发送
    }).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {

	console.log(data.data);
	if (data) {
			if (data.retCode == '1') {				
				var jsonObj = data.data;
				if (jsonObj.retCode == '1' || jsonObj.retCode == '2') {
                    clearInterval(jishiqi);
					console.log(jsonObj.msg);					
				} 				
			} 
		}

   });

}



var jishiqi;


function denglu(){
    //登录不成功关注一下这个。
	var salt = "1#2$3%4(5)6@7!poeeww$3%4(5)djjkkldss";
    password = hex_md5(password + "{" + salt + "}");

    var dengluxinxi={
	'j_username': username,
	'j_password': password,
	'devicetype':'weixin'
    }
	fetch('https://hsn.sinograin.com.cn/slyyServlet/j_bsp_security_check/mobile', {

    method: 'POST', // 指定请求方法
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
    body: jsonToUrlencoded(dengluxinxi)  // 转换数据格式并发送
    }).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {

	console.log(data.data);
    var retCode = data.data[0].loginCode;
	if (retCode == '1') {

		var userJson = data.data[0].user;
		yysqParams.yyr = userJson.userName;
		yysqParams.jsr = userJson.userName;
		yysqParams.lxfs = userJson.userId;
		yysqParams.sfz = userJson.idcard;
		yysqParams.tjr = userJson.userNm;
		yysqParams.userType = userJson.userType + "";
		console.log(yysqParams);
		jishiqi=setInterval(jiancha,1000);
	}else{
		console.log("登录失败，请检查账号密码！");
	}

   });
}


denglu();
				
