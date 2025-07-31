//跳转到登录页
cmApi.router.turnToPage('login', {flag : "1",loginPhoneNum : ""});


function jsonToUrlencoded(json) {
    const pa = new URLSearchParams();
    for (let key in json) {
        pa.append(key, json[key]);
    }
    return pa.toString();
}

function getsearchliangku(rq,km) {
	
	var params = {
		
		"phone":cmApi.getStringSession("username"),
		"rq":rq,     //格式 20250712
		"latitude":1,
		"longitude":1,
		"ywlx":"0",
		"sfz":cmApi.userInfo.getUserIDCard(),
		"min":0,
		"max":10,
		"mobileDeviceId":"",
		"yk":"",
		"jlmj":"",
		"kqmc":km,
		"selectedVariety":"",		
		"devicetype":"weixin"
	};

	$.ajax({
		type: "POST",
		url: "https://hsn.sinograin.com.cn/slyyServlet/service/nhyy/getResvKdListBySearch",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
			},
		data: jsonToUrlencoded(params),
		async:false,
		success:function(data){
				
                  if (data) {
	        		if (data.retCode == '1') {
			
	        			    var json = data.data[0];	
	        			    console.log(data.data[0].zzmc);
                            
	        	           
								slyyQhmsModule.slyyQhmsLongitude = json.longitude;
								slyyQhmsModule.slyyQhmsLatitude = json.latitude;

                                
							
	        }
			console.log(slyyQhmsModule.slyyQhmsLongitude);

	        }}		
	    //timeout: 3000,
	 })
}
getsearchliangku("20250718","天长市粮食发展（集团）有限公司高庙粮库");
getsearchliangku("20250719","镇平县中祥粮油购销有限责任公司");


$$("#slyyQhmsThirdCLSL").click();
$$("div.actions-modal-button")[0].click();
$$("#slyyQhmsThirdCYR0").val("赵建成");
$$("#slyyQhmsThirdSJH0").val("15161703747");
$$("#slyyQhmsThirdCPH0").val("皖M07671");
$$("#slyyQhmsThirdSL").val(50);
slyyQhmsModule.openCyrSelect(0);
slyyQhmsModule.selectCyr(0);
slyyQhmsModule.openClSelect(0);
slyyQhmsModule.selectCl('0');


$$("#slyyQhmsThirdCLSL").click();
$$("div.actions-modal-button")[0].click();
$$("#slyyQhmsThirdCYR0").val("费龙");
$$("#slyyQhmsThirdSJH0").val("15312312668");
$$("#slyyQhmsThirdCPH0").val("苏H0364J");
$$("#slyyQhmsThirdSL").val(50);




$$("#slyyQhmsThirdCLSL").click();
$$("div.actions-modal-button")[0].click();
$$("#slyyQhmsThirdCYR0").val("杨立勋");
$$("#slyyQhmsThirdSJH0").val("18623908709");
$$("#slyyQhmsThirdCPH0").val("豫RR9583");
$$("#slyyQhmsThirdSL").val(45);


$$("#slyyQhmsThirdCLSL").click();
$$("div.actions-modal-button")[0].click();
$$("#slyyQhmsThirdCYR0").val("陈炳富");
$$("#slyyQhmsThirdSJH0").val("15893368691");
$$("#slyyQhmsThirdCPH0").val("豫RB0010");
$$("#slyyQhmsThirdSL").val(45);