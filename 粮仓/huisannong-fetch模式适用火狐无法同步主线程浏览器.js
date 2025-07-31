//先获取cookie,记住只能进https://hsn.sinograin.com.cn/mobile/html/main/main.html
//因为有个函数要借用js库
//异步查询，同步提交，同步提交整个浏览器最高执行权，但是火狐同步不能进入主线程了。
//fetch 要想设高优先级，对应查询要设成低的


var username="13752528006";
var password="yyk10241@";
//zznm是粮库码
var zznm="zh8080816c611ae0016c6138cd030005O0000000000000003485";

var lsnm="200001";
var lscm="小麦";
var ywlx="0";   //业务类型，售粮
var yzm="";

var yysqParams = {
			"yyr": "",
			"tjr": "",
			"sfz": "",
			"jsr": "",
			"phone": username,
			"lxfs": "",
			"pznm": "",
			"pzmxnm": "",
			"zznm": zznm,
			"zzmc": "",
			"rq": "",
			"lsnm": lsnm,
			"lsmc": lscm,
			"kssj": "",
			"jssj": "",
			"cs": "",
			"sl": "",
			"cphStr": "",
			"cllxNm": "",
			"cyrnm": "",	
            "tzdbh": "", //
            "ywlx": ywlx,//
			"cyr": "",
			"cyrsfzh": "",
			"cyrsjh": "",
			"qymc": "", //
			"xydm": "", //
			"userType": "",			
			"dxyzm": yzm,//短信验证码
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
    body: jsonToUrlencoded(params),  // 转换数据格式并发送
	priority: "low"
    }).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {

	if (data) {
		if (data.retCode == '1') {

				var json = data.data;	
				
				if(json[1].xssyhsl>0||json[1].xssyhsl<0){
			   
					yysqParams.pznm = json[1].yypznm;
					yysqParams.pzmxnm = json[1].yypzmxList[0].yypzmxnm;
					yysqParams.zzmc = json[1].zzmc;
					yysqParams.rq = json[1].rq;
					yysqParams.jssj = json[1].yypzmxList[0].jssj;
					yysqParams.kssj = json[1].yypzmxList[0].kssj;

					yysqParams = secretYysqParams(yysqParams);
					yyksubmit();
				}
				if(json[1].xssyhsl==0){
			   
						clearInterval(jishiqi);
				}					
				
		}
    }else{
	//denglu();
			console.log("登录信息错误，请检查密码！");
			
    }
     console.log(data.data);
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
	body: jsonToUrlencoded(yysqParams),  // 转换数据格式并发送
	priority: "high"
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
					console.log(username);					

				} 				
			} 
		}

   });

}


var jishiqi;

function getcyr(){
    
    var cyrxinxi={	
	'userId': username,
	'devicetype':'weixin'
    }
	fetch('https://hsn.sinograin.com.cn/slyyServlet/service/cyrxxwh/getCyrxxList', {

    method: 'POST', // 指定请求方法
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
    body: jsonToUrlencoded(cyrxinxi)  // 转换数据格式并发送
    }).then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}).then(data => {

	console.log(data.data);
    var retCode = data.retCode;
	if (retCode == '1') {

		var cyrlist = data.data;
		var jigeche=cyrlist.length;
		var zongliang=0;
		var cycp="";
		var cyllxnm="";
		var cynm="";
		var cysfz="";
		var cyren="";
		var cysj="";

		cyrlist.forEach(function(c){

			zongliang=zongliang+c.clzz;
			cycp=cycp+c.cph+",";
			cyllxnm=cyllxnm+c.cclx+",";
			cynm=cynm+c.nm+",";
			cysfz=cysfz+c.sfzh+",";
			cyren=cyren+c.cyrxm+",";
			cysj=cysj+c.lxdh+",";

		})
		yysqParams.cs = jigeche;
		yysqParams.sl = zongliang;
		yysqParams.cphStr = cycp;
		yysqParams.cllxNm = cyllxnm;
		yysqParams.cyrnm = cynm;
		yysqParams.cyr = cyren;
		yysqParams.cyrsfzh = cysfz;
		yysqParams.cyrsjh = cysj;
		console.log(yysqParams);
		jishiqi=setInterval(jiancha,700);
		
	}else{
		console.log("获取承运人信息失败！");
		//clearInterval(jishiqi);
	}

   });
}

function zt(){
	alert("点击确定继续");
}

function sendSMS() {
	
	var params = {
		"phoneNum": username,
		"zznm": zznm
	};

	 fetch('https://hsn.sinograin.com.cn/slyyServlet/service/smscheck/sendSMSCode', {

		method: 'POST', // 指定请求方法
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
			},
		body: jsonToUrlencoded(params),  // 转换数据格式并发送
		priority: "high"
		}).then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	}).then(data => {
	
		console.log(data.data);
		if (data.data.resultCode == '1') {
			console.log("验证码发送成功");
			var userInput = prompt("请输验证码:"+username, "");
			yzm=userInput;
		}
	
	   });
}


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

		getcyr();
		var userJson = data.data[0].user;
		yysqParams.yyr = userJson.userName;
		yysqParams.jsr = userJson.userName;
		yysqParams.lxfs = userJson.userId;
		yysqParams.sfz = userJson.idcard;
		yysqParams.tjr = userJson.userNm;
		yysqParams.userType = userJson.userType + "";
		console.log(yysqParams);
		
	}else{
		console.log("登录失败，请检查账号密码！");
	}

   });
}

denglu();