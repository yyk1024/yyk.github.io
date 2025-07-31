var username="15893368691";   //5234
var password="a#15893368691";
var lkname="镇平县中祥粮油购销有限责任公司";
var djt = 1;
//0是当天，1是明天，2是后天
denglu();

var username="18623908709";   //4833
var password="978ylx21@";

var username="16637771126";   //f
var password="ylb188766YLB#";
var lkname="镇平县中祥粮油购销有限责任公司";
var djt = 1;
//0是当天，1是明天，2是后天
denglu();


var djt = 1;
//0是当天，1是明天，2是后天
var ischangecyr=1;  //是选择承运人，还是直接填车牌号，直接填车牌值写0，否则其他数值。
var isyzm=true;   //是否需要验证码

//直填车牌的，才用下面5项
function getcph(){

    	yysqParams.cs = 1;
		yysqParams.sl = 50;
		yysqParams.cphStr = "豫AN7602,";		
		//yysqParams.cphStr = "豫RB0010,豫RP9822,豫RR9583,";		//多车可以这样写
		yysqParams.cyr = "李学立,";
		yysqParams.cyrsjh = "15893368691,";
		//yysqParams.cllxNm = "1,";  //10吨以上大货车1,挂车2   根据账号类型比如售粮人这个可以不填这个
	
}


//zznm是粮库码
var zznm="zh8080816c611ae0016c6138cd030005O0000000000000016249";    //镇平县17:00
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000013787";  //16:00濮阳国家粮食储备
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000013796";   //河南濮阳5:30
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000014257";   //漯河市
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000003485";  //天长市
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000000837";  //灵璧县
//var zznm="zh8080816c611ae0016c6138cd030005O0000000000000033343";    //五得利临沂



var lsnm="200001";
var lscm="小麦";
//var lsnm="200002";
//var lscm="稻谷";
//var lsnm="200003";
//var lscm="玉米";


denglu();
				



