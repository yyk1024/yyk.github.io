//先获取cookie,记住只能进https://hsn.sinograin.com.cn/mobile/html/main/main.html
//因为有个函数要借用js库
//异步查询，同步提交，同步提交整个浏览器最高执行权，但是火狐同步不能进入主线程了。
//短信验证码有效期5分钟，如需验证码，点我的就发送验证码。
//如果微信公众号无法提交，是因为缓存，换个电脑或清理微信记录。yzd微信无法登陆，可以用范的号
//getzznm()获取zznm
//图片验证码5分钟，手机验证码3分钟，去这里看https://hsn.sinograin.com.cn/mobile/html/slyyQhms/slyyQhms.js
//2025年7.12改版后，后面代码都挪到main.html内最下面script了，需本地映射main.html配合使用。



var username="15376916827";   //f
var password="a147258@";


var username="17851191401";   //f
var password="Guohan123*";

var username="15505187114";   //f
var password="Guohan123*";

var username="15376916817";   //f
var password="a147258@";

var username="15564910555";   //f
var password="qq@111111";

var username="13884880108";   //f
var password="zcb120819$";

var username="15562955118";   //
var password="qq@111111";

var username="13280563456";   //
var password="@qh13869956";

var username="13589665689";   //
var password="j13589665689@";

var username="13407639350";   //
var password="q13625495555@";

var username="16678022977";   //f
var password="a147258@";


var username="13852225535";   //f
var password="xd369369!";

var username="15955080997";   //f
var password="tj050050@";

var username="13905508451";   //f
var password="zhu8451@";

var username="13525600867";   //f
var password="h031030.";

var username="15936638348";   //f
var password="QQQ111www#";

var username="15893368691";   //f
var password="a#15893368691";


var username="16637771126";   //f
var password="ylb188766YLB#";

var username="17698850521";   //f
var password="Sxy051126.";


var username="13603868178";   //f
var password="a123456.";
//直填车牌的，才用下面5项

var username="15639636138";   //1555
var password="wan27859.";


var username="18502680539";   //f范的测试账号
var password="QQQ111www#";

var djt = 1;
//0是当天，1是明天，2是后天
var ischangecyr=1;  //是选择承运人，还是直接填车牌号，直接填车牌值写0，否则其他数值。
var isyzm=true;   //是否需要验证码

function getcph(){

    	yysqParams.cs = 1;
		yysqParams.sl = 50;
		yysqParams.cphStr = "豫AN7602,";		
		//yysqParams.cphStr = "豫RB0010,豫RP9822,豫RR9583,";		//多车可以这样写
		yysqParams.cyr = "李学立,";
		yysqParams.cyrsjh = "13674936000,";
		yysqParams.cllxNm = "1,";  //10吨以上大货车1,挂车2   根据账号类型比如售粮人这个可以不填这个
	
}



//zznm是粮库码
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000015918";    //平舆县金丰粮油购销有限责任公司
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000013787";  //16:00濮阳国家粮食储备
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000013796";   //河南濮阳5:30
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000014257";   //9:30漯河市
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000003485";  //天长市
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000013883";  //7:00南乐县
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000024230";    //10:00邓州张村
var zznm="zh8080816c611ae0016c6138cd030005O0000000000000020776";  //"新郑0一五二河南省粮食储备库"
//zh8080816c611ae0016c6138cd030005O0000000000000021008
//东丽

//zh8080816c611ae0016c6138cd030005O0000000000000012405
//开封粮食产业集团有限公司

var lsnm="200001";
var lscm="小麦";
//var lsnm="200002";
//var lscm="稻谷";
//var lsnm="200003";
//var lscm="玉米";



denglu();
				



