//36\38行，经纬度
//288-292 注释掉，避免无法点附近粮仓
//408-423 获取经纬度
//1204-1207 选粮食   1249-1256 增加行，选几车
//2596-2600 选择承运人，打开车辆
//2783-2785 增加一行重量
//2764-69 选择车辆,增加提交按钮
define(function() {
    var yyfs="";
    //初始化日历月份
    var slyyQhmsHomeMonthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    //初始化日历中的周几
    var slyyQhmsHomeDayNames = ['日', '一', '二', '三', '四', '五', '六'];
    //定义星期
    var slyyQhmsHomeWeekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    //定义日历控件的变量名
    var slyyQhmsHomeCalendarDefault;
    var slyyQhmsHomeRQ;
    var slyyQhmsHomeRQ_punchin;
    //记录当前日历的时间
    var slyyQhmsHomeCalendarTime;
    //每页显示的条数
    var slyyQhmsHomePageSize = 10;
    //每页的起始索引
    var slyyQhmsHomePageIndex = 0;
    var slyyQhmsHomeLoading = false;
    //存储json数据
    var slyyQhmsJsonObj;
    //距离查询枚举----1:50km,2:100km,3:150km,4:200km
    var jlmj='';
    //存储选择地是哪个粮库
    var slyyQhmsJsonObjDataNum;
    //存储选择地是哪个时间段
    var slyyQhmsJsonObjDataSjdListNum;
    //当前位置纬度
    var slyyQhmsLongitude=114.0611931681633;
    //当前位置经度
    var slyyQhmsLatitude=34.151729029868136;
    //所选库点位置纬度
    var choseLatitude;
    //所选库点位置经度
    var choseLongitude;
    //所选库点zznm
    var choseZznm;
    //所选库点联系方式
    var choseLxfs="";
    //售粮预约是否显示车牌号,没值显示，none表示不显示
    var isShowCphSlyyQhmsThird = "";
    //存放车辆类型内码，提交预约的时候使用
    var cllxNmSlyyQhmsThird = "";
    //分配模式
    var slyyFpmsJsonObj;
    var idCard = cmApi.userInfo.getUserIDCard();
    var userType = cmApi.userInfo.getBindUserId();
    //全局变量，存储后台传过来的常用联系人json数据
    var cylxrJsonObject;
    //船预约重量
    var czdyysl = 0;
    var kfyykssj = "";
    var kfyyjssj = "";
    // add begin by wuyanmei at 2021年5月17日 for 增加出库业务
    var ywlx = "";
    var zznm = "";
    var pzStr = "";
    // add end by wuyanmei at 2021年5月17日 for 增加出库业务
    // add begin by lichao at 2022年1月24日 for 增加行为验证码
     var captchaVerification ='';
     var wxdlFlag = "";
     // add end  by lichao at 2022年1月24日 for 增加行为验证码

       var sendFlagYy = false; // 代表有无成功发送验证码
     var loginSMSVcode_DjsAmountYy = 180; //重发短信验证码倒计时变量
     var loginSMSVcode_intervalProcessYy = '';
     var loginSMSVcode_validateSMSCodeErrorSizeYy = 0; //验证短信验证码错误次数
     var gloparam = "";
     var cllxList;

     var grainVarietyMap = {
        "小麦": "200001",
        "稻谷": "200002",
        "玉米": "200003",
        "大豆": "200004"
     }
     var selectedVariety = "";
     let varietySearchAreaShow = false;
     var distanceMap = {
        "50km": 50000,
        "100km": 100000,
        "150km": 150000,
        "200km": 200000
     };
     var selectedDistance = 200000;
     let distanceSearchAreaShow = false;

     let selectedMaskType = 0; // 1: 品种，2：价格，3：距离

     /** 价格查询所使用变量 */
     let priceSearchAreaShow = false;
     let priceSearchLeftThumb = null;
     let priceSearchRightThumb = null;
     let priceSearchIsDragging = false;
     let priceSearchCurrentThumb = null;
     let priceSearchMinRange = 0;
     let priceSearchMaxRange = 1000;
     //价格
     let priceSearchMinValue = 0;
     let priceSearchMaxValue = 1000;

     let isMapOpen = false; // 地图打开状态
      // 第三个页面库点是否需要短信验证
      let slyyThirdStorageMessageVerify = false;
      // 第三个页面预约提交申请时验证码校验成功返回的 uuid
      let slyyThirdImageCaptchaVerifyUUID = "";

    // 监听页面交互行为，检测异常操作
    const clickTimestamps = [];
    const mouseMovements = [];
    function blockThread(seconds) {
        const start = Date.now();
        while (Date.now() - start < seconds * 1000) {
            // 空循环，阻塞线程
        }
        console.log(`线程被阻塞了 ${seconds} 秒`);
    }
    document.addEventListener('click', (e) => {
        // 记录点击时间戳
        clickTimestamps.push(Date.now());
//        blockThread(0.2);
        // 检测短时间内大量点击
        if (clickTimestamps.length > 5) {
            const recentClicks = clickTimestamps.slice(-5);
            const timeDiff = recentClicks[recentClicks.length-1] - recentClicks[0];

            // 如果1秒内点击超过5次，可能是机器操作
            if (timeDiff < 1000) {
                return;
            }
        }
    });

    document.addEventListener('mousemove', (e) => {
        // 记录鼠标移动轨迹
        mouseMovements.push({x: e.clientX, y: e.clientY});
    });
    var blacklistParam = {};
    var onViewInit = function(module, dependents, param) {
         if (loginSMSVcode_intervalProcessYy != '') {
            clearInterval(loginSMSVcode_intervalProcessYy);
         }
         loginSMSVcode_DjsAmountYy = 180;
        //初始时将品种设置为空
        selectedVariety = "";
         idCard = cmApi.userInfo.getUserIDCard();
         userType = cmApi.userInfo.getBindUserId();
         getIpBysystemType();
        //微信打开时关闭定位按钮
       // modify begin  by lichao at 2022年1月24日 for 增加行为验证码
        // add begin by wuyanmei at 2021年5月17日 for 增加出库业务
        param = param +"";
        ywlx = parseInt(param.split(",")[0]);
        // 业务类型为售粮预约并且验证码已传递
        if(ywlx == '0' && param.split(",").length >1 && !wxdlFlag){
            captchaVerification = param.split(",")[1];
        }


        // add end by wuyanmei at 2021年5月17日 for 增加出库业务
          // modify end  by lichao at 2022年1月24日 for 增加行为验证码
        var systemType = cmApi.device.getType();
        userType = cmApi.userInfo.getBindUserId();
        window.slyyQhmsModule = module;
        window.punchInModule = dependents[0];
       // window.ZlddInModule = dependents[0];
        var isExistBlacklist = '0';

        this.slyyQhmsJsonObj = {};
        this.slyyFpmsJsonObj = {};
        //日期,全局变量
        this.slyyQhmsHomeRQ = "";
        //将每页的起始索引重新置为1
        slyyQhmsHomePageIndex = 0;
        //初始化日历
        initSlyyQhmsHomeCalendar();
        //将日期设置成明天的，因为预约今天的没意义
        initSlyyQhmsHomeSetDateToTomorrow();
        slyyThirdStorageMessageVerify = false;
        slyyThirdImageCaptchaVerifyUUID = '';
        //滚动加载事件
        cmApi.map.locate('slyyQhmsModule.slyyQhmsGeolocationCallback');
       	if (idCard) {
       		idCard = idCard.substring(0, 10) + "****" + idCard.substring(idCard.length - 4, idCard.length);
       	}
         bindStyleChange();
        //常用联系人
        cylxrJsonObject = {};
        if(!wxdlFlag){
           // 渲染行为验证码点击按钮
             initXwyzm("slyyQhmsHomeXwyzmDiv","btnForVerification");
        }else{


        }
        //下拉刷新
        var ptrContent = $$('#slyyQhmsHomePageContentDiv');
        ptrContent.on('refresh', function (e) {
            slyyQhmsTimeChangeTriggerFunQueryData('0',"refresh");
            // 加载完毕需要重置
            myApp.pullToRefreshDone();
        });
        initSelectedVariety();
        initSelectedDistance();

        // 先关闭地图
        $$("#slyyQhmsMapListDivId").css("display", "none");
        $$('#slyycxRightPanelId').attr('src', '../../image/slyyQhmx/icon_gps2.png');
        isMapOpen = false;

        if (ywlx === 0) {
            $$('#slyyQhmxSearchContainer').css('display', 'flex');
            $$('#slyyQhmxStorageSearchTip').css('display', 'block');
            $$('#slyyQhmxDropSearch').css('display', 'none');
            addSearchListener();
        } else {
            isMapOpen = true;
            slyyQhmsChangeTab();
        }
    }
    var onPageDestroy = function() {
        delete window.slyyQhmsModule;
    }
    //添加搜索框监听
    function addSearchListener(){
         document.getElementById("searchKqmc").addEventListener("keydown",(event)=>{
               if (event.key === "Enter" || event.keyCode === 13) {
                    event.preventDefault(); // 阻止默认表单提交行为
                    //搜索后失去焦点，收回键盘
                    $$('#searchKqmc').blur();
                    searchKqmcBtn();
               }
         })
    }
    // 定位的返回函数
    function slyyQhmsGeolocationCallback(jsonObj) {
        if (jsonObj.retCode == '1') {
            var data = jsonObj.data;
            this.slyyQhmsLongitude = data.longitude;
            this.slyyQhmsLatitude = data.latitude;
            //slyyQhmsTimeChangeTriggerFunQueryData();
        } else {
            cmApi.prompt.toast('网络繁忙，请稍后再试。');
        }
    }
    //查询路线
    function searchPath() {
        cmApi.router.loadContent(LOAD_CONTENT_PREFIX + '/html/slyyQhms/slyyPath.html');
        punchInModule.initPunchIn(choseLongitude, choseLatitude, $$("#syyyQhmsSecondLK").val());
    }
    function searchKqmcBtn() {
        selectedDistance = '';
        $$('#slyyQhmxDistanceText').html('距离查询');
        selectedVariety = '';
        $$('#slyyQhmxVarietyText').html('品种');
        $$('#slyyQhmxDropSearch').css('display', 'none');
        slyyQhmsTimeChangeTriggerFunQueryData(1);
    }

    function nearStorageSearch() {
        if (isMapOpen) {
            $$("#slyyQhmsMapListDivId").css("display", "none");
            $$("#slyyQhmsDataListDivId").css("display", "inline");
            $$('#slyycxRightPanelId').attr('src', '../../image/slyyQhmx/icon_gps2.png');
            isMapOpen = !isMapOpen;
        }
        $$('#searchKqmc').val('');
        $$('#slyyQhmxDropSearch').css('display', 'flex');
        slyyQhmsTimeChangeTriggerFunQueryData(0,'refresh');
    }
    //查询数据列表
    function querySlyyQhmsDateList(queryType,czlx) {
        var sfz = cmApi.userInfo.getUserIDCard();
        var phone = cmApi.userInfo.getUserId();
        var max = slyyQhmsHomePageIndex + slyyQhmsHomePageSize;
        var longitude = slyyQhmsModule.slyyQhmsLongitude;
        var latitude = slyyQhmsModule.slyyQhmsLatitude;
        let kqmc = $$('#searchKqmc').val();
        $$('#navigateLongitude').val(longitude);
        $$('#navigateLatitude').val(latitude);
        /* 
        if (longitude == undefined || latitude == undefined) {
            cmApi.prompt.toast('网络繁忙，请稍后再试。');
            return;
        } */
        let curBackUrl = "service/nhyy/getResvKdList";
        if ((ywlx == 0 && queryType === 1) || (kqmc && kqmc !== '')) {
            curBackUrl = "service/nhyy/getResvKdListBySearch";
            if (!kqmc || kqmc === '') {
                cmApi.prompt.toast("请输入粮库名称的关键字(如名称中的地名)");
                return;
            }
        }
       // add begin by wuyanmei at 2021年5月17日 for 增加出库业务
       var mobileDeviceId = cmApi.device.getDeviceId();
       //微信提交时执行此方法
       var openId = cmApi.getStringSession("openId", openId);
       if(openId != undefined && openId != 'null' && openId == '' ){
           mobileDeviceId = openId;
       }
        var yk = cmApi.getStringSession("yk")
        var params = "{'longitude':'" + longitude + "','latitude':'" + latitude
        + "','phone':'" + phone + "','sfz':'" + sfz + "','rq':'" + slyyQhmsModule.slyyQhmsHomeRQ
        + "','min':'" + slyyQhmsHomePageIndex + "','max':'" + max + "','ywlx':'" + ywlx
        + "','mobileDeviceId':'" + mobileDeviceId + "','yk':'" + yk+ "','jlmj':'" + selectedDistance
        + "','kqmc':'" + kqmc + "','selectedVariety':'" + selectedVariety + "','wxdlFlag':'" + wxdlFlag;
          // modify begin  by lichao at 2022年1月24日 for 增加行为验证码
          //售粮预约 并且有验证码
          if(ywlx ==0 && captchaVerification &&  !wxdlFlag ){
          params = params+ "','captchaVerification':'"+captchaVerification+"'}"
          }else{
           params = params+"'}";
          }
          let jsonParams = {
            "longitude":  longitude,
            "latitude": latitude,
            "phone": phone,
            "sfz": sfz,
            "rq": slyyQhmsModule.slyyQhmsHomeRQ,
            "min": slyyQhmsHomePageIndex,
            "max": max,
            "ywlx": ywlx,
            "mobileDeviceId": mobileDeviceId,
            "yk": yk,
            "jlmj": selectedDistance,
            "selectedVariety": selectedVariety,
            "minPrice": priceSearchMinValue / 100.0,
            "maxPrice": priceSearchMaxValue / 100.0,
            "kqmc": kqmc
          };
          if(ywlx ==0 && captchaVerification &&  !wxdlFlag) {
            jsonParams.captchaVerification = captchaVerification;
          }
           // modify begin  by lichao at 2022年1月24日 for 增加行为验证码
         // add end by wuyanmei at 2021年5月17日 for 增加出库业务
        //判断缓存有无key
        if(cmApi.getStringSession("resvKdListObj") && cmApi.getStringSession("resvKdListObj")!='' && "refresh" == czlx){
           //取出时间戳判断是否小于当时时间5秒
            const resvKdListObjStr =  cmApi.getStringSession("resvKdListObj");
            const resvKdListObj = JSON.parse(resvKdListObjStr)
            const timestamp = resvKdListObj.timestamp;
            if(timestamp){
                const timestampNow = new Date().getTime().toString();
                const timestampDiff = timestampNow - timestamp;
                if(timestampDiff < 5000){
                    querySlyyQhmsDateListCallback(resvKdListObj.kdList,'0');
                }else {
                    httpPostAsync(curBackUrl, params, 'slyyQhmsModule.querySlyyQhmsDateListCallback');
                }
            }else {
                httpPostAsync(curBackUrl, params, 'slyyQhmsModule.querySlyyQhmsDateListCallback');
            }
        }else {
            httpPostAsync(curBackUrl, params, 'slyyQhmsModule.querySlyyQhmsDateListCallback');
        }
    }

    function querySlyyQhmsDateListCallback(jsonObj,type) {
        if(jsonObj) {
            $$('#slyyQhmxStorageSearchTip').css('display', 'none');
            if(type != "0"){
                var resvKdListObj = {
                    "kdList" : jsonObj,
                    "timestamp" : new Date().getTime().toString()
                };
                cmApi.setStringSession("resvKdListObj",JSON.stringify(resvKdListObj));
            }
            if(jsonObj.data.retCode&&jsonObj.data.retCode=="3"){
                 $$('#slyyQhmxStorageReserveList').hide();
                 $$('#slyyQhmxStorageReserveListNO').css('display', 'block');
                 $$('#slyyQhmxStorageReserveListNO').html(jsonObj.data.data);
//               $$('#slyyQhmsDataListDivIdNo').hide();
//                $$('#slyyQhmsDataListDivId').show();
//                $$('#slyyQhmsDataListUL').html('<li  class="item-link item-content" ><div class="item-inner" style="text-align:center;line-height:60px">'+jsonObj.data.data+'</div></li>');
               return;
            }
            if (jsonObj.retCode == "1") {
                if(jsonObj.data.retCode=="0"){
                    cmApi.prompt.toast(jsonObj.data.msg);
                    return;
                }
                isExistBlacklist = jsonObj.isExistBlacklist;
                if(isExistBlacklist == '1'){
                    blacklistParam = JSON.parse(jsonObj.blacklistParam);
                }
                var json = jsonObj.data;
                slyyQhmsModule.slyyQhmsJsonObj = json;
                if (!json || json.length == 0 || json == '') {
                    $$('#slyyQhmxStorageReserveList').hide();
                    $$('#slyyQhmxStorageReserveListNO').css('display', 'block');
//                    $$('#slyyQhmsDataListDivId').hide();
//                    $$('#slyyQhmsDataListDivIdNo').show();


                } else {
                    $$('#slyyQhmxStorageReserveList').show();
                    $$('#slyyQhmxStorageReserveListNO').css('display', 'none');
//                    $$("#slyyQhmsDataListUL").html('');
//                    $$('#slyyQhmsDataListDivIdNo').hide();
//                    $$('#slyyQhmsDataListDivId').show();
                    $$('#slyyQhmxStorageReserveList').html('');
////////////////////////////////////////////////////////////////////
                    function generateRandomDecimal(min, max, precision) {
                       // 计算最小值和最大值之间的差
                        const range = max - min;
                        // 生成一个[0, 1)之间的随机数，然后乘以范围再加上最小值
                         const randomValue = Math.random() * range + min;
                        // 使用toFixed()方法来格式化数字到指定的小数位数
                       return parseFloat(randomValue.toFixed(precision));
                    }
 
                    // 调用函数生成介于0.02到0.06之间的14位随机小数
                      const randomDecimal = generateRandomDecimal(0.02, 0.06, 14);

                    slyyQhmsModule.slyyQhmsLatitude = json[0].latitude-randomDecimal;
                    slyyQhmsModule.slyyQhmsLongitude = json[0].longitude-randomDecimal;
//////////////////////////////////////////////////////////////////
                    //当天日期
                    var currentdate = getNowFormatDate();
                    var dateFlag = false;
                    if(currentdate == slyyQhmsModule.slyyQhmsHomeRQ) {
                        dateFlag = true;
                    }
                    $$.each(json,
                    function(i) {
                        var indexI = i + slyyQhmsHomePageIndex;
                        //将数据存起来，为了后2个界面使用
                        slyyQhmsModule.slyyQhmsJsonObj[indexI] = json[i];
                        //预约状态
                        var wkzt = json[i].zt;
                        var divStr = "";
                        if (wkzt == '1') { //正常接收预约
                            if (Number(json[i].xssyhsl) === 0 || Number(json[i].lkxssyhsl) < 0) {
                                divStr = '<div class="chip chip-red-transparent-custom underline-custom">' + '	<div class="chip-label chip-label-custom">预约已满</div>' + '</div>';
                            }
                        } else if (wkzt == '3') { //未到预约期
                            divStr = '<div class="chip chip-red-transparent-custom underline-custom">' + '    <div class="chip-label chip-label-custom">未开始</div>' + '</div>';
                        } else if (wkzt == '2') { //暂停预约
                            divStr = '<div class="chip chip-red-transparent-custom underline-custom">' + '    <div class="chip-label chip-label-custom">暂停</div>' + '</div>';
                        } else if (wkzt == '4') { //过期
                             divStr = '<div class="chip chip-red-transparent-custom underline-custom">' + '    <div class="chip-label chip-label-custom">已过期</div>' + '</div>';
                        }
                        //var mspicStr = '../../image/choselk/ms_qh.png';
                        //距离,原始数据是米
                        var wkJL = json[i].jl;
                        var jlStr = (wkJL / 1000).toFixed(2) + "Km";
                        if (wkJL < 1000) {
                            jlStr = wkJL + "m";
                        }
                        var lat_list = json[i].latitude;
                        var lng_list = json[i].longitude;
                        var lspz = JSON.parse(json[i].lspz);
                        var lspzStr = '';
                        $$.each(lspz, function(j){
                            lspzStr  = lspzStr + lspz[j].name+' ';
                        });
                        if(lspzStr.length > 11){
                            // lspzStr = lspzStr.substring(0,11)+'..';
                        }
                        let ctqkClass = 'slyy-qhmx-reserve-index-green';
                        if (json[i].color === 'yellow') {
                            ctqkClass = 'slyy-qhmx-reserve-index-yellow';
                        } else if (json[i].color === 'orange') {
                            ctqkClass = 'slyy-qhmx-reserve-index-orange';
                        } else if (json[i].color === 'red') {
                            ctqkClass = 'slyy-qhmx-reserve-index-red';
                        }
//                        var str = ' <div class="list_item list_item_mm" onclick="slyyQhmsModule.goSlyyQhmsSecond(\'' + indexI + '\')" id="' + indexI + 'li" lat_list="' + lat_list + '" lng_list="' + lng_list + '" lspzStr="' + lspzStr + '"><div class="item_title item_title1">';
//                             str +='<img class="ls_icon"  style="width: 22px;" src="../../image/icon_home1.png"> '
//                             str+='<span class="date_nm">' + json[i].zzmc + '(总放号：' + json[i].zsyhsl + ')<span class="fr data_jl" style="padding-top: 5px;font-weight: initial;">距离：'+jlStr+ '</span></span></div>';
//                             str+='<div class="item_content2">'
//                                 +'<div><span>粮食品种：</span><span>'+lspzStr+'</span></div>';
//                             if(json[i].fhsj != undefined && json[i].fhsj != null && json[i].fhsj != ''){
//                                 str+='<div><span>放号时间：</span><span>'+json[i].fhsj+'</span></div>';
//                             }
//                             str+='<div><span>已放号数量：</span><span>'+json[i].yfhsl+'</span></div>'
//                                 +'<div><span>可预约数量：</span><span>'+json[i].xssyhsl+'</span></div>';
//                             if(dateFlag == true) {
//                              str+='<div><span>排队数量：</span><span>'+json[i].pdsl+'</span></div>';
//                              str+='<div><span >畅通指数：</span><span style=" color:'+json[i].color +'">'+ json[i].ctqk +'</span></div>';
//                             }
//                             str+='</div></div>';
                        //$$("#slyyQhmsDataListUL").append(str);
                        // 预约方式
                        var yysfNm = json[i].yyfsnm;
                        var newInnerStr = '<div class="slyy-qhmx-reserve-area" style="position: relative" onclick="slyyQhmsModule.goSlyyQhmsSecond(\'' + indexI + '\')" id="' + indexI + 'li" lat_list="' + lat_list + '" lng_list="' + lng_list + '" lspzStr="' + lspzStr + '" yyfsnm="'+yysfNm+'">';
                            newInnerStr += '<div class="slyy-qhmx-reserve-head">';
                            newInnerStr +=    '<div class="slyy-qhmx-reserve-icon"><img src="../../image/slyyQhmx/company_list.png" width="40px" height="50px"/></div>';
                            newInnerStr +=    '<div class="slyy-qhmx-reserve-middle">';
                            newInnerStr +=       '<div class="slyy-qhmx-reserve-title">' + json[i].zzmc + '</div>';
                            newInnerStr +=       '<div class="slyy-qhmx-reserve-distance">';
                            newInnerStr +=       '   <img src="../../image/slyyQhmx/icon_gps3.png" width="14px" height="16px" alt="gps"/>&nbsp;&nbsp;距离' + jlStr;
                            newInnerStr +=       '</div>';
                            newInnerStr +=    '</div>';
                            //newInnerStr +=    '<div class="slyy-qhmx-reserve-index ' + ctqkClass + '">' + (json[i].ctqk ? json[i].ctqk : '畅通') + '</div>';
                            newInnerStr += '</div>';
                            newInnerStr += '<div class="slyy-qhmx-reserve-line"></div>';
                            newInnerStr += '<div class="slyy-qhmx-reserve-content">';
                            newInnerStr +=   '<div class="slyy-qhmx-reserve-row">';
                            newInnerStr +=    '<span class="slyy-qhmx-reserve-row-title">粮食品种</span><span>' + lspzStr +'</span>';
                            newInnerStr +=   '</div>';
                            newInnerStr +=   '<div class="slyy-qhmx-reserve-row">';

                            newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">预约方式：</span><span>' + json[i].yyfsmc + '</span>';
                            newInnerStr +=   '</div>';
                            if(yysfNm=="1"){
                            newInnerStr +=   '<div class="slyy-qhmx-reserve-row">';
                                newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">放号时间：</span><span>' + json[i].fhsj + '</span>';
                                newInnerStr +=   '</div>';
                            }

                            newInnerStr +=   '</div>';
//                            newInnerStr +=   '<div class="slyy-qhmx-reserve-row">';
//                            newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">总放号数量：</span><span>' + json[i].zsyhsl + '</span>';
//                            newInnerStr +=   '</div>';
//                            newInnerStr +=   '<div class="slyy-qhmx-reserve-row">';
//                            newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">已放号数量：</span><span>' + json[i].yfhsl + '</span>';
//                            newInnerStr +=   '</div>';
                            newInnerStr +=   '<div class="slyy-qhmx-reserve-row">';
                            if (yysfNm=="1"){
                                newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">可预约数量：</span><span>' + json[i].xssyhsl + '</span>';
                            }else{
                                newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">已登记数量：</span><span>' + json[i].ydjcs + '</span>';
                            }

                            newInnerStr +=   '</div>';
                            // logo
                            if (yysfNm=="1"){
                                newInnerStr+='<div style="position: absolute;right: 0;bottom: 0;"><img src="../../image/slyyQhmx/yyghLogo.png" style="width:80px;height:80px;"/></div>';
                            }else{
                                newInnerStr+='<div style="position: absolute;right: 0;bottom: 0;"><img src="../../image/slyyQhmx/yydjLogo.png" style="width:80px;height:80px;"/></div>';
                            }
//                            newInnerStr +=  '<div class="slyy-qhmx-reserve-row">';
//                            newInnerStr +=      '<span class="slyy-qhmx-reserve-row-title">排队数量：</span><span>' + (json[i].pdsl ? json[i].pdsl : '') + '</span>';
//                            newInnerStr +=   '</div>';
                            newInnerStr += '</div>';
                            newInnerStr += '</div>';
                            $$('#slyyQhmxStorageReserveList').append(newInnerStr);
                    });
                    if (isMapOpen) {
                        $$('#slyyQhmxStorageReserveList').css('display', 'none');
                    }
                }
                slyyQhmsHomeLoading = false;
                captchaVerification ="";
            } else if (jsonObj.retCode == "0") {
                cmApi.prompt.toast("网络异常，请重复操作！");
            } else if (jsonObj.retCode == "3") {
                cmApi.prompt.toast(jsonObj.data);
            }
        } else {
            relogin()
        }
    }

    //进入第二个页面
    function goSlyyQhmsSecond(n) {
    // 当前dom节点置为灰色，禁止在点击
            //disableDiv( n + 'li');
	enableDivsByClass('slyy-qhmx-reserve-area',false);
        if(isExistBlacklist == '1'){
            var msg = "<div style='text-align: left;'>&nbsp; &nbsp;&nbsp; &nbsp;因您在售粮当日，出现取消预约或不到场签到的情况，"
                + blacklistParam.accumulDays +"天内累计已达"
                + blacklistParam.breakRuleTotalNum +"次以上，系统已于"

                + blacklistParam.date +"将您列入黑名单中，目前暂时无法使用售粮预约功能。<br> &nbsp; &nbsp;&nbsp; &nbsp;"
                + blacklistParam.limitDays +"天后将自动从黑名单中移除，或联系当地粮库工作人员处理。</div>";
                myApp.alert(msg,"温馨提示");
		 // 页面跳转后延迟执行，确保 DOM 已更新
            	enableDivsByClass('slyy-qhmx-reserve-area',true);
                return;
            }
        choseLongitude = $$('#' + n + 'li').attr('lng_list');
        choseLatitude = $$('#' + n + 'li').attr('lat_list');
        pzStr = $$('#' + n + 'li').attr('lspzStr');
        yyfsnm = $$('#' + n + 'li').attr('yyfsnm');
        slyyQhmsJsonObjDataNum = n;
        var json = slyyQhmsModule.slyyQhmsJsonObj[n];
        choseZznm=json.zznm
        choseLxfs=json.lxfs;
        if (json.zt == '4' && yyfsnm=="1") {
            cmApi.prompt.toast('粮库放号已过期');
	    enableDivsByClass('slyy-qhmx-reserve-area',true);
            return;
        } else if (json.zt == '2' && yyfsnm=="1") {
            cmApi.prompt.toast('粮库暂停预约');
	    enableDivsByClass('slyy-qhmx-reserve-area',true);
            return;
        } else if (json.zt == '3' && yyfsnm=="1") {
            cmApi.prompt.toast('未到预约期');
	    enableDivsByClass('slyy-qhmx-reserve-area',true);
            return;
        } else if (json.zt == '1' || yyfsnm=="2") {
            if ((Number(json.xssyhsl) === 0 || Number(json.xssyhsl) < 0) && yyfsnm=="1") {
                cmApi.prompt.toast('粮库线上预约已满');
		enableDivsByClass('slyy-qhmx-reserve-area',true);
                return;
            } else {
                //查询粮库对应地址、联系方式、放号剩余号数量
                 if (isSfyk()) {
                        gloparam= json;
                        gloparam.yyfsnm = yyfsnm;
                        initGyxx(json.zznm);
//                    var params = json;
//                    sessionStorage.setItem('params',JSON.stringify(params));
//                    cmApi.request.httpPostAsync('service/nhyy/getResvSjList', params,'application/json', 'slyyQhmsModule.getResvSjListCallback');
                }
            }
        }
    }

    function disableDiv(divId) {
            const divElement = document.getElementById(divId);
            if (divElement) {
                // 设置背景颜色为灰色
                //divElement.style.backgroundColor = '#cccccc'; // 灰色背景
                // 禁用点击事件
                divElement.style.pointerEvents = 'none';
                // 可选：添加不可点击的样式（例如禁用光标）
                //divElement.style.opacity = '0.6';
                divElement.style.cursor = 'not-allowed';
            } else {
                console.warn(`未找到 id 为 ${divId} 的元素`);
            }
        }
        function enableDivsByClass(className) {
          const divs = document.querySelectorAll(`div.${className}`);
          if (divs.length === 0) {
            console.warn(`未找到 class 为 "${className}" 的元素`);
            return;
          }

          divs.forEach(div => {
            div.style.pointerEvents = 'auto'; // 启用点击
            div.style.opacity = '1';          // 恢复正常透明度
            div.style.cursor = 'pointer';     // 恢复鼠标指针样式
          });
        }
        function goBackAndEnableDiv() {
            // 跳转回上一页
            mainView.router.back();

            // 页面跳转后延迟执行，确保 DOM 已更新
            setTimeout(function () {
                enableDivsByClass('slyy-qhmx-reserve-area',true); // 调用你的 disableDiv 方法
            }, 100); // 可根据需要调整延迟时间
        }

function initGyxx(zznm){
         var userId = cmApi.userInfo.getUserId();
         var params = {"userId": userId,"zznm": zznm};
        httpPostAsync('service/grxx/getGrxxStatus',params,'slyyQhmsModule.getGrxxStaCallback');
	}
    //调用返回
	function getGrxxStaCallback(jsonObj){
	    if(!jsonObj || jsonObj.retCode == undefined){
            cmApi.hideLoadingDialog();
            cmApi.prompt.toast("会话超时，将重新登录！");
            setTimeout(cmApi.router.turnToPage('login'),1500);
            return;
        }else if(jsonObj.retCode != '1' || !jsonObj.data || jsonObj.data.length < 1){
                    cmApi.prompt.toast('请求失败');
                    return false;

        }else{
                         if(jsonObj.code === '3'){
                                     myApp.confirm('请进行信息完善，信息完善后即可进行预约', '提示', function() {
                                                            cmApi.router.turnToPage('grxx');
                                                        });
                         }else{
                                 //增加预约距离限制
                                 var sfz = cmApi.userInfo.getUserIDCard();
                                 var params = "{'sfz':'" + sfz +"'}";
                                 cmApi.request.httpPostAsync('service/nhyy/hdmCheck', params, 'slyyQhmsModule.hdmCheckCallback');
                         //原跳转逻辑
//                                                 sessionStorage.setItem('params',JSON.stringify(gloparam));
//                                                  cmApi.request.httpPostAsync('service/nhyy/getResvSjList', gloparam,'application/json', 'slyyQhmsModule.getResvSjListCallback');
                         }
                     }
       }


   function hdmCheckCallback(jsonStr){
       if (!jsonStr || !jsonStr.data) {
           cmApi.prompt.toast('会话超时，将重新登录！');
           cmApi.setStringSession("username", "");
           cmApi.setStringSession("password", "");
           cmApi.router.turnToPage('login');
           return;
       }
       var data=jsonStr.data;
       if(data.isExistBlacklist=='1'){
        blacklistParam = JSON.parse(data.blacklistParam);
        var msg = "<div style='text-align: left;'>&nbsp; &nbsp;&nbsp; &nbsp;因您在售粮当日，出现取消预约或不到场签到的情况，"
           + blacklistParam.accumulDays +"天内累计已达"
           + blacklistParam.breakRuleTotalNum +"次以上，系统已于"
           + blacklistParam.date +"将您列入黑名单中，目前暂时无法使用售粮预约功能。<br> &nbsp; &nbsp;&nbsp; &nbsp;"
           + blacklistParam.limitDays +"天后将自动从黑名单中移除，或联系当地粮库工作人员处理。</div>";
           myApp.alert(msg,"温馨提示");
           // 页面跳转后延迟执行，确保 DOM 已更新
                       setTimeout(function () {
                           enableDivsByClass('slyy-qhmx-reserve-area',true); // 调用你的 disableDiv 方法
                       }, 100); // 可根据需要调整延迟时间
           return;
       } else {
           //增加预约距离限制
           var params = "{'longitude':'" + slyyQhmsModule.slyyQhmsLongitude + "','latitude':'" + slyyQhmsModule.slyyQhmsLatitude
                   + "','lklongitude':'"+choseLongitude+"','lklatitude':'"+choseLatitude+"','lkdm':'"+choseZznm+"'}"
           cmApi.request.httpPostAsync('service/nhyy/getDistanceByCurrentLocation', params, 'slyyQhmsModule.distanceCheckCallback');
       }
    }

    function distanceCheckCallback(jsonStr){
        if (!jsonStr || !jsonStr.data) {
                cmApi.prompt.toast('会话超时，将重新登录！');
                cmApi.setStringSession("username", "");
                cmApi.setStringSession("password", "");
                cmApi.router.turnToPage('login');
                return;
        }

        var data=jsonStr.data;
        if(data.retCode=='0'){
            myApp.alert("您的当前位置不在该粮库可预约的距离范围内,请就近预约附近粮库，如有疑问请联系"+choseLxfs);
	    // 页面跳转后延迟执行，确保 DOM 已更新
            setTimeout(function () {
                enableDivsByClass('slyy-qhmx-reserve-area',true); // 调用你的 disableDiv 方法
            }, 100); // 可根据需要调整延迟时间
            return;
        }else{
            sessionStorage.setItem('params',JSON.stringify(gloparam));
            cmApi.request.httpPostAsync('service/nhyy/getResvSjList', gloparam,'application/json', 'slyyQhmsModule.getResvSjListCallback');
        }
    }
     function isSfyk() {
		if (!cmApi.userInfo.getUserIDCard()) {
			var yk = cmApi.getStringSession("yk");
            if(yk){
                myApp.confirm('请登录后继续进行操作', '提示', function() {
                    var yk = cmApi.setStringSession("yk","");
                    var params = {
                        flag : "1",
                        loginPhoneNum : ""
                    };
//                    cmApi.router.turnToPage('loginSMSValidateCode', params);
                    cmApi.router.turnToPage('login');
                });
		enableDivsByClass('slyy-qhmx-reserve-area',true);
            } else {
                myApp.confirm('只有通过实名认证才能操作，去认证?', function() {
                    cmApi.router.turnToPage('registerPersonalInfo');
                });
		enableDivsByClass('slyy-qhmx-reserve-area',true);
            }
            return false;
		} else {
			return true;
		}
    }

     var bindStyleChange = function () {
//                var bindings = [{
//                    element: '#slyycxRightPanelId',
//                    event: 'click',
//                    handler: slyyQhmsChangeTab
//                }];
                $$('#slyycxRightPanelId').on('click', slyyQhmsChangeTab);
              //  appFunc.bindEvents(bindings);
            }
       //切换Tab页
      function slyyQhmsChangeTab() {
          //地图列表
          if (!isMapOpen) {
              $$("#slyyQhmsMapListDivId").css("display", "inline");
              $$("#slyyQhmsDataListDivId").css("display", "none");
              $$('#slyycxRightPanelId').attr('src', '../../image/slyyQhmx/icon_filter.png');
//              $$('#choselk_icon').removeClass('icon-map');
//              $$('#choselk_icon').addClass('icon-list');
              isMapOpen = !isMapOpen;
              slyyQhmsTimeChangeTriggerFunQueryData();
          } else { //数据列表
              //查询数据列表
              $$("#slyyQhmsMapListDivId").css("display", "none");
              $$("#slyyQhmsDataListDivId").css("display", "inline");
              $$('#slyycxRightPanelId').attr('src', '../../image/slyyQhmx/icon_gps2.png')
//              $$('#choselk_icon').removeClass('icon-list');
//              $$('#choselk_icon').addClass('icon-map');
              isMapOpen = !isMapOpen;
              slyyQhmsTimeChangeTriggerFunQueryData();

          }
      }
    // 获取可预约的时间段
    function getResvSjListCallback(jsonStr) {
        if (!jsonStr || !jsonStr.data|| !jsonStr.data.zzmc) {
             cmApi.prompt.toast('会话超时，将重新登录！');
                cmApi.setStringSession("username", "");
                 cmApi.setStringSession("password", "");
                cmApi.router.turnToPage('login');
            return;
        }

        var json =jsonStr.data;
        slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum]  = json;
        // 预约方式
        let yyfsnm = json.yyfsnm;
        if(yyfsnm=="1"){
            getResvSjListCallback_yygh(json)
        }else if(yyfsnm=="2"){
            getResvSjListCallback_yydj()
        }
    }
    function getResvSjListCallback_yygh(json){
        cmApi.router.loadContent(LOAD_CONTENT_PREFIX + '/html/slyyQhms/slyyQhmsSecond.html');
        //下拉刷新
        var ptrContent2 = $$('#pageContentDivId_yyxz');
        ptrContent2.on('refresh', function (e) {
            var paramsStr = sessionStorage.getItem('params');
            var params = JSON.parse(paramsStr);
            cmApi.request.httpPostAsync('service/nhyy/getResvSjList', params,'application/json', 'slyyQhmsModule.resvRefresh');
            // 加载完毕需要重置
            myApp.pullToRefreshDone();
        });
        const syyyQhmsSecondUL = document.getElementById('syyyQhmsSecondUL');
        syyyQhmsSecondUL.addEventListener('scroll', function () {
            if (syyyQhmsSecondUL.scrollTop > 0) {
                myApp.destroyPullToRefresh(ptrContent2)
            } else {
                myApp.initPullToRefresh(ptrContent2)
            }
        });
        var wkJL = json.jl;
        var jlStr = (wkJL / 1000).toFixed(2) + "Km";
        if (wkJL < 1000) {
            jlStr = wkJL + "m";
        }

        $$('#slyyQhmxStorageName').html(json.zzmc);
        $$('#slyyQhmxStorageAddress').html(json.dz);
        $$('#slyyQhmxStorageVariety').html(pzStr);
        $$('#slyyQhmxStorageContact').html(json.lxfs);
        $$('#slyyQhmxStorageContactDiv').click(function() {
            cmApi.contact.phone(json.lxfs);
        });
        $$('#slyyQhmxStorageDistance').html(jlStr);
        $$('#slyyQhmxStorageNoticeContent').html(json.slxz);

        var tzgg = json.tzgg;
        if(tzgg!=null && tzgg!=""){
            $$('#slyygg_ggdiv').show();
            $$("#slyygg_text").html(tzgg);
        }

        var sjdJson = json.yypzmxList;
        $$("#syyyQhmsSecondUL").html("");
        $$.each(sjdJson,
            function(i) {
                //过时已满不再显示
                if (! (sjdJson[i].outTime)) {
                    var str = '<li onclick="slyyQhmsModule.goSlyyQhmsThird(\'' + slyyQhmsJsonObjDataNum + '\',\'' + i + '\')">' + ' <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label" style="text-align:center;">' + dateUtil.timeFormatChangeToHMStandard(sjdJson[i].kssj) + '-' + dateUtil.timeFormatChangeToHMStandard(sjdJson[i].jssj) + '</div>' + '      <div class="item-input">';
                    if(sjdJson[i].xssyhsl > 0){
                        str = str + '<input type="text" readonly value="' + sjdJson[i].xssyhsl + '车" style="text-align:center;">';
                    }else{
                        str = str +  '<input type="text" readonly value="已满" style="text-align:center;color:#FF0000;">';
                    }
                    str = str + '      </div>' + '      <div><img src="../../image/right.png" style="width:18px;height:18px;margin-left:6px;"/></div>' + '    </div>' + '  </div>' + '</li>';
                }
                $$(str).appendTo($$("#syyyQhmsSecondUL"));
            });
    }
    function getResvSjListCallback_yydj(json,jsonStr){
        goSlyyQhmsThird(slyyQhmsJsonObjDataNum,0);
    }

    function resvRefresh(jsonStr){
        var json =jsonStr.data;
        slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum]  = json;

//        $$("#syyyQhmsSecondLK").html('');
//        $$("#syyyQhmsSecondDz").html('');
//        $$("#syyyQhmsSecondSlxzStr").html('');
//        $$("#syyyQhmsSecondPzStr").html('');
//        $$("#syyyQhmsSecondLXFS").html('');
//        $$("#syyyQhmsSecondYyrqStr").html('');
//        $$("#syyyQhmsSecondJl").html('');
          $$("#syyyQhmsSecondUL").html('');
//
//        $$("#syyyQhmsSecondLK").html(json.zzmc);
//        $$("#syyyQhmsSecondDz").html(json.dz);
//        $$("#syyyQhmsSecondSlxzStr").html(json.slxz);
//        $$("#syyyQhmsSecondPzStr").html(pzStr);
//        $$("#syyyQhmsSecondLXFS").html('<a href="#" onclick="cmApi.contact.phone(\'' + json.lxfs + '\')">' + json.lxfs + '</a>');
//        $$("#syyyQhmsSecondYyrqStr").html($$("#slyyQhmsHomeCalendar").text());
//        var wkJL = json.jl;
//        var jlStr = (wkJL / 1000).toFixed(2) + "Km";
//        if (wkJL < 1000) {
//            jlStr = wkJL + "m";
//        }
//        $$("#syyyQhmsSecondJl").html(jlStr);
        var sjdJson = json.yypzmxList;
        $$.each(sjdJson,
        function(i) {
            //过时已满不再显示
            if (! (sjdJson[i].outTime)) {
                var str = '<li onclick="slyyQhmsModule.goSlyyQhmsThird(\'' + slyyQhmsJsonObjDataNum + '\',\'' + i + '\')">' + ' <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label" style="text-align:center;">' + dateUtil.timeFormatChangeToHMStandard(sjdJson[i].kssj) + '-' + dateUtil.timeFormatChangeToHMStandard(sjdJson[i].jssj) + '</div>' + '      <div class="item-input">';
                if(sjdJson[i].xssyhsl > 0){
                  str = str + '<input type="text" readonly value="' + sjdJson[i].xssyhsl + '车" style="text-align:center;">';
                }else{
                  str = str +  '<input type="text" readonly value="已满" style="text-align:center;color:#FF0000;">';
                }
                str = str + '      </div>' + '      <div><img src="../../image/right.png" style="width:18px;height:18px;margin-left:6px;"/></div>' + '    </div>' + '  </div>' + '</li>';
            }
            $$(str).appendTo($$("#syyyQhmsSecondUL"));
        });
    }

    //进入第三个页面
    var clickCphNum = "";
    function goSlyyQhmsThird(n, i) {
        $$('.navbar').css('background-color',"#ffffff")
        //每次进入第三个页面，重新初始化这2个变量
        isShowCphSlyyQhmsThird = "none";
        cllxNmSlyyQhmsThird = "";
        //存储选择地是哪个粮库
        slyyQhmsJsonObjDataNum = n;
        //存储选择地是哪个时间段
        slyyQhmsJsonObjDataSjdListNum = i;
        var json = slyyQhmsModule.slyyQhmsJsonObj[n];
        var sjdJson = json.yypzmxList;
        //初始化页面，查询所选择的剩余号数量、粮食品种、车辆类型
        zznm = json.zznm;
        var params = "{'zznm':'" + json.zznm + "','yypzmxnm':'" + sjdJson[i].yypzmxnm + "','ywlx':'" + ywlx + "'"+",'yyfsnm':'"+json.yyfsnm+"'}";
        httpPostAsync('service/nhyy/getResvMxList', params,'slyyQhmsModule.getResvMxListCallback');
    }
    //跳转到第三个页面
    function getResvMxListCallback(jsonObj) {
        var json = slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum];
        if (jsonObj.data.xssyhsl <= 0 && json.yyfsnm=="01") {
            cmApi.prompt.toast('该时间段预约已满');
            return;
         }
        //赋值系统参数
        czdyysl =jsonObj.data.czdyysl;
        kfyykssj = jsonObj.data.kfyykssj;
        kfyyjssj = jsonObj.data.kfyyjssj;
        //不同业务跳转到不同页面，售粮预约
        if(ywlx===0){
            cmApi.router.loadContent(LOAD_CONTENT_PREFIX + '/html/slyyQhms/slyyQhmsThird.html');
            // 如果农户/司机售粮预约
            cllxList = jsonObj.data.xscllx;
            if(userType==='01'){
                $$("#slyyQhmsThirdLiCllx").css('display','');
                $$("#slLi").css('display','');
                $$("#slyyQhmsThirdQYMC").css('display','none');
                $$("#slyyQhmsThirdXYDM").css('display','none');
                //车辆类型
                initSlyyQhmsThirdCLLXSelect(jsonObj.data.xscllx);
                // 初始化页面第三模块：预约人、身份证、结算人
                initSlyyQhmsThirdYYRSelect();
                var yysqParamsStr = sessionStorage.getItem('yysqParams');
                if(yysqParamsStr != undefined && yysqParamsStr != '' && yysqParamsStr != null){
                    var yysqParams = JSON.parse(yysqParamsStr);
                    var cs = yysqParams.cs
//                    initSlyyQhmsThirdThyyCYR(cs);
                    initSlyyYysqParams(yysqParams);
                }
            }else{
                $$("#slyyQhmsThirdLiCllx").css('display','none');
                // $$("#slLi").css('display','none');
                var qymc = cmApi.userInfo.getZzmc();
                var qydm = cmApi.userInfo.getZznm();
                if(qymc==undefined ||qymc=='null' ||qymc==''){
                    //企业名称
                    $$("#slyyQhmsThirdQYMC").css('display','none');
                }else{
                    //企业名称
                    $$("#slyyQhmsThirdQYMC").css('display','');
                    $$("#slyyQhmsThirdYYRQYMC").attr('value', qymc);
                }
                if(qydm==undefined ||qydm=='null' ||qydm==''){
                    //企业代码
                    $$("#slyyQhmsThirdXYDM").css('display','none');
                }else{
                    //企业代码
                    $$("#slyyQhmsThirdXYDM").css('display','');
                    $$("#slyyQhmsThirdYYRXYDM").attr('value', qydm);
                }
                // 初始化页面第三模块：预约人、预约人姓名、身份证、结算人
                initSlyyQhmsThirdYYRSelect(jsonObj);
                var yysqParamsStr = sessionStorage.getItem('yysqParams');
                if(yysqParamsStr != undefined && yysqParamsStr != '' && yysqParamsStr != null){
                    var yysqParams = JSON.parse(yysqParamsStr);
                    var cs = yysqParams.cs
//                    initSlyyQhmsThirdThyyCYR(cs);
                    initSlyyYysqParams(yysqParams);
                }
            }
            slyyThirdStorageMessageVerify = jsonObj.data.needsms;
            if(slyyThirdStorageMessageVerify){
              //$$("#slyyQhmsDxyzmLi").css("display","");
              $$("#slyyThirdMessageVerifyDiv").css('display', 'block');
            } else {
              $$("#slyyThirdMessageVerifyDiv").css('display', 'none');
            }
            slyyThirdImageCaptchaVerifyUUID = '';


            if(!wxdlFlag){
               initXwyzmForYySubmit();
            }

        }else{
            //提货预约
            cmApi.router.loadContent(LOAD_CONTENT_PREFIX + '/html/slyyQhms/slyyQhmsThirdThyy.html');
           // 初始化页面第三模块：预约人、身份证、结算人、企业信息、企业代码
            initSlyyQhmsThirdTHYYRSelect(jsonObj);
         }
        //add begin by wuyanmei at 2021年5月17日  for  增加出库业务
        // 初始化页面第一模块：粮库名称、距离、地址、联系方式
        var json = slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum];
        var sjdJson = json.yypzmxList;
        if (json.yyfsnm=='2'){
            $$('#editTitle').html("填写登记信息");
            $$('#rylx').html("登记人");
            $$('.yygh_rq').css('display','none');
            $$('#yyslDiv').html("登记数量(吨)");
            $$('slyyQhmsThirdSL').attr('placeholder', '请填写登记数量');
        }else if (json.yyfsnm=='1'){
            $$('#editTitle').html("填写售粮信息");
            $$('#rylx').html("售粮人");
            // 初始化页面第二模块：售粮日期、预约时间
            $$("#slyyQhmsThirdRQ").val(dateUtil.timeFormatChangeToYMDStandard(json.rq));
            $$("#slyyQhmsThirdSJD").val(dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].kssj) + '-' + dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].jssj));

        }
        var sjd = sjdJson[slyyQhmsJsonObjDataSjdListNum];
        var wkJL = json.jl;
        var jlStr = (wkJL / 1000).toFixed(2) + "Km";
        if (wkJL < 1000) {
            jlStr = wkJL + "m";
        }
        zzmc = json.zzmc;
//        $$("#slyyQhmsThirdLK").html(zzmc);
//        $$("#slyyQhmsThirdJl").html(jlStr);
//        $$("#slyyQhmsThirdDz").html(json.dz);
//        $$("#syyyQhmsThirdSlxzStr").html(json.slxz);
//        $$("#syyyQhmsThirdPzStr").html(pzStr);
//        $$("#slyyQhmsThirdLXFS").html('<a href="#" onclick="cmApi.contact.phone(\'' + json.lxfs + '\')">' + json.lxfs + '</a>');

        $$('#slyyQhmxThirdStorageName').html(zzmc);
        $$('#slyyQhmxThirdStorageAddress').html(json.dz);
        $$('#slyyQhmxThirdStorageVariety').html(pzStr);
        $$('#slyyQhmxThirdStorageContact').html(json.lxfs);
        $$('#slyyQhmxThirdStorageContactDiv').click(function() {
            cmApi.contact.phone(json.lxfs);
        });
        $$('#slyyQhmxThirdStorageDistance').html(jlStr);
        $$('#slyyQhmxThirdStorageNoticeContent').html(json.slxz);

        // 初始化页面第二模块：售粮日期、预约时间、当前时间
        $$("#slyyQhmsThirdRQ").val(dateUtil.timeFormatChangeToYMDStandard(json.rq));
        $$("#slyyQhmsThirdSJD").val(dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].kssj) + '-' + dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].jssj));
        $$("#slyyQhmsDqsj").val( new Date().Format("yyyy-MM-dd hh:mm:ss"));
        setInterval(function(){  $$("#slyyQhmsDqsj").val( new Date().Format("yyyy-MM-dd hh:mm:ss")); }, 1000);
        // 初始化页面第四模块：预约人、身份证、结算人
        //粮食品种初始化
        initSlyyQhmsThirdLSPZSelect(jsonObj.data.lspz);
        //剩余号数量，粮库允许农户/司机一次最多可预约车数
        initSlyyQhmsThirdCLSLSelect( jsonObj.data.xssyhsl, jsonObj.data.zdkyycs);
    }
    //初始化售粮预约人信息
    function initSlyyQhmsThirdYYRSelect() {
        $$("#slyyQhmsThirdYYR").attr('value', cmApi.userInfo.getUserNm());
        $$("#slyyQhmsThirdYYRName").attr('value', cmApi.userInfo.getUserName());
        $$("#slyyQhmsThirdJSRName").attr('value', cmApi.userInfo.getUserName());
        $$("#slyyQhmsThirdYYRSFZ").attr('value', idCard);
    }
    //初始化提货预约人信息
    function initSlyyQhmsThirdTHYYRSelect(jsonObj) {
        $$("#slyyQhmsThirdYYR").attr('value', cmApi.userInfo.getUserNm());
        $$("#slyyQhmsThirdYYRName").attr('value', cmApi.userInfo.getUserName());
        $$("#slyyQhmsThirdYYRSFZ").attr('value', idCard);
        $$("#slyyQhmsThirdYYRQYMC").attr('value', cmApi.userInfo.getZzmc());
        $$("#slyyQhmsThirdYYRXYDM").attr('value', cmApi.userInfo.getZznm());
    }
    //初始化预约申请信息
    function initSlyyYysqParams(yysqParams) {
        // 车牌号不为空时赋值
        var cphStr = yysqParams.cphStr;
        // 如果车牌号不为空，则分割车牌号
        if (cphStr != null && cphStr.length > 0) {
            var cphs = cphStr.split(",");
        }

        // 车辆类型不为空时赋值
        var cllxNmStr = yysqParams.cllxNm;
        // 车辆类型不为空，则分割车辆类型
        if (cllxNmStr != null && cllxNmStr.length > 0) {
            var cllxNms = cllxNmStr.split(",");
        }

        // 承运人内码
        var cyrnmStr = yysqParams.cyrnm;
        // 如果承运人内码不为空，则分割承运人内码
        if (cyrnmStr != null && cyrnmStr.length > 0) {
            var cyrnms = cyrnmStr.split(",");
        }

        // 承运人
        var cyrStr = yysqParams.cyr;
        // 如果承运人不为空，则分割承运人
        if (cyrStr != null && cyrStr.length > 0) {
            var cyrs = cyrStr.split(",");
        }

        // 承运人身份证
        var cyrsfzhStr = yysqParams.cyrsfzh;
        // 如果承运人不为空，则分割承运人
        if (cyrsfzhStr != null && cyrsfzhStr.length > 0) {
            var cyrsfzhs = cyrsfzhStr.split(",");
        }

        // 承运人手机号
        var cyrsjhStr = yysqParams.cyrsjh;
        // 如果承运人不为空，则分割承运人
        if (cyrsjhStr != null && cyrsjhStr.length > 0) {
            var cyrsjhs = cyrsjhStr.split(",");
        }

        // 数量
        var slStr = yysqParams.sl;
        // 如果数量不为空，则分割 数量
        if (slStr != null && slStr.length > 0) {
            var sls = slStr.split(",");
        }

//        var cs = yysqParams.cs;
//        for (var i = 0; i < cs; i++) {
//            if (cyrStr != null && cyrStr.length > 0) {
//                $$('#slyyQhmsThirdCYR' + i).val(cyrs[i]);
//            }
//            //承运人内码
//            if (cyrnmStr != null && cyrnmStr.length > 0) {
//                $$('#slyyQhmsThirdCYRNM' + i).val(cyrnms[i]);
//            }
//            //车辆类型
//            if (cllxNmStr != null && cllxNmStr.length > 0) {
//                $$('#slyyQhmsThirdCLLX' + i).val(cllxNms[i]);
//            }
//            // 承运人身份证
//            if (cyrsfzhStr != null && cyrsfzhStr.length > 0) {
//                $$('#slyyQhmsThirdSFZH' + i).val(cyrsfzhs[i]);
//            }
//
//            // 承运人手机号
//            if (cyrsjhStr != null && cyrsjhStr.length > 0) {
//                $$('#slyyQhmsThirdSJH' + i).val(cyrsjhs[i]);
//            }
//            // 车牌号
//            if (cphStr != null && cphStr.length > 0) {
//                $$('#slyyQhmsThirdCPH' + i).val(cphs[i]);
//            }
//        }
//        $$('#slyyQhmsThirdCLSL').val(cs + "车/船");
        //粮食内码
        lspz = yysqParams.lsnm;
        //粮食名称
        var lsmc = yysqParams.lsmc;
        $$('#lspzmc').val(lsmc);
        $$('#slyyQhmsThirdSL').val(slStr);

    }
    var lspz;
    function initSlyyQhmsThirdLSPZSelect(jsonStr) {
        //[{"nm":"200002","name":"稻谷"}]
        var json = JSON.parse(jsonStr);
        var lspzNmObj = {};
        var btns_lspz = new Array();
        $$.each(json,
        function(i) {
            btns_lspz[i] = {
                text: json[i].name,
                onClick: function() {
                    $$('#lspzmc').val(json[i].name);
                    var currentSelect = $$('#lspzmc').val();
                    lspz = json[i].nm;
                    // 出库业务：选择品种后，对应的通知单清空。
                    if(ywlx===1){
                        $$('#tzdbh').val("");
                        $$('#tzdnm').val("");
                    }
                }
            }
        });
        $$('#lspzmcDiv').click(function() {
            myApp.actions(btns_lspz);
        });
        //////////////////////
          $$('#lspzmc').val("小麦");
        lspz="200001";
        //////////////////////////
    }
    //预约车辆数量下拉菜单
    function initSlyyQhmsThirdCLSLSelect(syhsl, zdkyycs) {
        var wkarry = new Array();
        if (syhsl < zdkyycs) {
            for (var i = 0; i < syhsl; i++) {
                var wkI = i + 1;
                wkarry[i] = wkI;
            }
        } else {
            for (var i = 0; i < zdkyycs; i++) {
                var wkI = i + 1;
                wkarry[i] = wkI;
            }
        }
        var btns_clsl = new Array();
        for (var i = 0; i < wkarry.length; i++) {
            btns_clsl[i] = {
                text: wkarry[i] + "车/船",
                onClick: function() {
                    var titleText = this.text;
                    $$('#slyyQhmsThirdCLSL').val(titleText);
                    if(ywlx===0){
                        // 入库业务：根据车辆数量增加车牌号字段
                        var titleTextCs = $$("#slyyQhmsThirdCLSL").val();
                        if(userType==='01'){
                            initSlyyQhmsThirdCPHLi(titleText.substring(0, titleText.length - 1));
                            setYyslts(titleTextCs.substring(0, 1),czdyysl);
                        }else{
                            initSlyyQhmsThirdThyyCYR(titleText.substring(0, titleText.indexOf("车")));
                            setYysltsCyr(titleTextCs.substring(0, 1),czdyysl)
                        }

                    }else{
                        // 出库业务：根据车辆数量增加承运人、手机号、车牌号、预约数量、运输工具
                        initSlyyQhmsThirdThyyCYR(titleText.substring(0, titleText.indexOf("车")));
                        var titleTextCs = $$("#slyyQhmsThirdCLSL").val();
                    }
                }
            };
        }
///////////////////////////////////////////////////
        titleText ="1车/船";
        $$('#slyyQhmsThirdCLSL').val(titleText);
        titleTextCs = $$("#slyyQhmsThirdCLSL").val();
        initSlyyQhmsThirdThyyCYR(titleText.substring(0, titleText.indexOf("车")));
        setYysltsCyr(titleTextCs.substring(0, 1),czdyysl);
        slyyQhmsModule.openCyrSelect(0);
////////////////////////////////////////////////////

        $$('#slyyQhmsThirdCLSLDiv').click(function() {
            if(ywlx===0 && userType==='01'){
                if ($$('#slyyQhmsThirdCLLX').val() == '') {
                    cmApi.prompt.toast('请先选择车船类型');
                    return;
                }
            }
            myApp.actions(btns_clsl);
        });
    }
    //删除车牌号
    function delCphli(cpnum) {
        $$('#slyyQhmsCPHLIId_slyy' + cpnum).remove();
    }
    //根据预约车辆数初始化车牌号列表
    function initSlyyQhmsThirdCPHLi(n) {
        n = n.substring(0, 1);
        $$('div[name^="slyyQhmsThirdCPHLIName"]').remove();
        createCphAreali();
        //modify begin by lichaolc at 2020年2月10日  for 调整数量和车辆信息顺序
        var str  ="";
        let newStr = "";
        //modify begin by lichaolc at 2020年7月16日 for 车船优化整改
      //判断是否是船
        var isChuan = $$("#slyyQhmsThirdCLLX").val().indexOf("船")!=-1?true:false;
        for (var i = 0; i < n; i++) {
//           str+= '<li name="slyyQhmsThirdCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '" style="display:' + isShowCphSlyyQhmsThird + '">' + '    <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">车船号<span style="color:red">*</span>：</div>' + '      <div class="item-input">';
//           if(isChuan){
//              str+= '         <input type="text" maxlength="20" id="slyyQhmsCph_slyy' + i + '" class="slyyQhmsCPHClass_slyy' ;
//           }else{
//              str+= '         <input type="text" readonly id="slyyQhmsCph_slyy' + i + '" class="slyyQhmsCPHClass_slyy';
//           }
//            str+=isShowCphSlyyQhmsThird + '" name="slyyQhmsThirdCPHName' + i
//           + '" num="' + i + '" placeholder="请填写车船号">'
//           + '      </div>'
//           + '    </div>'
//           + '  </div>'
//           + '</li>';

//           newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '">';
//           newStr += '  <div class="slyy-qhmx-form-title">车船号<span style="color:red">*</span></div>';
//           if (isChuan) {
//               newStr += '  <input type="text" class="slyy-qhmx-form-input" id="slyyQhmsCph_slyy' + i + '"  placeholder="请填写车船号" name="slyyQhmsThirdCPHName' + i + '" num="' + i + '">'
//           } else {
//               newStr += '  <input type="text" readonly class="slyy-qhmx-form-input" id="slyyQhmsCph_slyy' + i + '"  placeholder="请填写车船号" name="slyyQhmsThirdCPHName' + i + '" num="' + i + '">'
//           }
//           newStr += '</div>'
             if (isShowCphSlyyQhmsThird !== 'none') {
                          newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '">';
                          newStr += '  <div class="slyy-qhmx-form-title">车船号<span style="color:red">*</span></div>';
                          newStr += '  <div class="slyy-qhmx-input-group">';
                          if(isChuan){
                                newStr += '  <input type="text" class="slyy-qhmx-form-input" id="slyyQhmsCph_slyy' + i + '"  placeholder="点击箭头快速查找" name="slyyQhmsThirdCPHName' + i + '" num="' + i + '">'
                          }else{
                                newStr += '  <input type="text" readonly class="slyy-qhmx-form-input slyy-qhmx-arrow-input" style="" id="slyyQhmsCph_slyy' + i + '"  placeholder="点击箭头快速查找" name="slyyQhmsThirdCPHName' + i + '" num="' + i + '">'
                          }
//                          newStr += '    <input type="text" id="slyyQhmsCph_slyy' + i + '" placeholder="点击右侧箭头可快速查找" maxlength="8" name="slyyQhmsThirdCPHName' + i + '" num="' + i + '" class="slyy-qhmx-form-input slyy-qhmx-arrow-input">';
                          newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCLNM' + i + '"  name="slyyQhmsThirdThyyCLNMName' + i + '" num="' + i + '">';
                          newStr += '    <img src="../../image/right.png" class="slyy-qhmx-third-arrow-icon" alt=">" onclick="slyyQhmsModule.openClSelectForNh(' + i + ')">';
                          newStr += '  </div>';
                          newStr += '</div>';
             }

       }
     //modify begin by lichaolc at 2020年7月16日 for 车船优化整改
       //before方法不能使用，因此只能使用下述方式;
//        str+='<li id="slLi">'+$$("#slLi").html()+'</li>';
         var sl =  $$("#slyyQhmsThirdSL").val();
//       $$("#slLi").remove();
//       $$("#slyyQhmsThirdULId").append(str);
        //$$('#slyyQhmxThirdAppointment').append(newStr);
        let targetDiv = document.getElementById('slyyQhmxCarNumberDiv');
        targetDiv.insertAdjacentHTML('afterend', newStr);
       //modify begin by lichaolc at 2020年7月16日 for 车船优化整改
       //判断是不是船
       var isChuan = $$("#slyyQhmsThirdCLLX").val().indexOf("船")!=-1 ? true:false;
        $$("#slyyQhmsThirdSL").val(sl);
        //modify end by lichaolc at 2020年2月10日  for 调整数量和车辆信息顺序
        $$("#slyyQhmsThirdSL").val(sl);
        //modify end by lichaolc at 2020年2月10日  for 调整数量和车辆信息顺序
        for (var numstr = 0; numstr < n; numstr++) {
          //modify begin by lichaolc at 2020年7月16日  for 车船优化
             if(isChuan){
                  $$('#slyyQhmsCph_slyy' + numstr).click(function() {
                         clickCphNum = $$(this).attr("num");

                     });
             }else{
                $$('#slyyQhmsCph_slyy' + numstr).click(function() {
                      clickCphNum = $$(this).attr("num");
                      showCphPicker();
                  });
             }
           //modify end by lichaolc at 2020年7月16日  for 车船优化
        }
    }
    //设置预约数量提示语
        function setYysltsCyr(cs,mczdyys){
               //最大预约数量
               var maxYysl = 0;
                      if(""==cs){
                        cs = "1";
                      }
                       //1车100吨
                      if(cs==1){
                         maxYysl = "100";
                       }
                      //2车240吨
                      if(cs==2){
                           maxYysl = "200";
                       }
                       //3车360吨
                       if(cs==3){
                           maxYysl = "300";
                        }
                        if(cs==4){
                            maxYysl = "400";
                       }
                       if(parseInt(maxYysl)>mczdyys){
                            maxYysl=mczdyys
                       }
                //设置提示
           if(maxYysl === 0){
                $$("#slyyQhmsThirdSL").attr("placeholder","请填写预约数量");
           }else{
                $$("#slyyQhmsThirdSL").attr("placeholder","不超过"+maxYysl+"吨");
           }
        }
    //设置预约数量提示语
    function setYyslts(cs,mczdyys){
          //判断是不是船
            var isChuan = $$("#slyyQhmsThirdCLLX").val().indexOf("船")!=-1 ? true:false;
           //最大预约数量
           var maxYysl = 0;
            //不是船
            if(!isChuan){
                  if(""==cs){
                    cs = "1";
                  }
                   //1车120吨
                  if(cs==1){
                     maxYysl = "100";
                   }
                  //2车240吨
                  if(cs==2){
                       maxYysl = "200";
                   }
                   //3车360吨
                   if(cs==3){
                       maxYysl = "300";
                    }

            }else{
              //获取船只的最大预约数量
              if(""==cs){
                cs = "1";
              }
                maxYysl = cs*mczdyys;
            }
            //设置提示
       if(maxYysl === 0){
            $$("#slyyQhmsThirdSL").attr("placeholder","请填写预约数量");
       }else{
            $$("#slyyQhmsThirdSL").attr("placeholder","不超过"+maxYysl+"吨");
       }
    }

    //面板中回退按钮
    function todelcph() {
        var cph = $$('#cphletter_slyy').html();
        if (cph) {
            $$('#cphletter_slyy').html(cph.substring(0, cph.length - 1));
        }
    }
    //面板中确定按钮
    function subCph() {
        var idname = "slyyQhmsCph_slyy" + clickCphNum;
        $$('#' + idname).val($$('#cpharea_slyy').html() + $$('#cphletter_slyy').html());
        if (!$$('#delBtn_slyy' + clickCphNum).html()) {
            var htmlstr = '<div style="width: 110px;">' + '<a href="#" class="button" id="delBtn_slyy' + clickCphNum + '" style="font-size: 13px;" onclick="slyyQhmsModule.delCphli(\'' + clickCphNum + '\');">删除</a>' + '</div>';
            $$('#cphItemInner_slyy' + clickCphNum).append(htmlstr);
        }
    }
    var pickhtml = "";
    //显示车牌号面板
    function showCphPicker() {
        var hasBind = false;
        if (!pickhtml) {
            pickhtml = $$('#pickModel_slyy').html();
        }
        myApp.pickerModal(pickhtml);
        $$('#pickModel_slyy').html('');
        if (!hasBind) {
            bindClickPick();
            hasBind = true;
        }
    }

    function bindClickPick() {
        $$('.num-slyy').click(function() {
            if ($$('#cphletter_slyy').html().length < 7) {
                $$('#cphletter_slyy').append($$(this).html());
            }
        });
        $$(".my-radio-slyy").change(function() {
            $$('#cpharea_slyy').html($$(this).next().children().html());
        });
    }

    function cllxSelect(n){
        var cllxNmObj = {};
        var btns_cllx = new Array();
        var json = JSON.parse(cllxList);
        $$.each(json,
        function(i) {
            cllxNmObj[json[i].name] = json[i].nm;
            btns_cllx[i] = {
                text: json[i].name,
                onClick: function() {
                    $$('#slyyQhmsThirdCLLX'+n).val(json[i].name);
                    $$('#slyyQhmsThirdCLLXId'+n).val(cllxNmObj[json[i].name]);
                }
            }
        });
        myApp.actions(btns_cllx);
    }

    //预约车辆类型下拉菜单
    function initSlyyQhmsThirdCLLXSelect(resvKdcllxList) {
        var cllxNmObj = {};
        var btns_cllx = new Array();
        var json = JSON.parse(resvKdcllxList);
        $$.each(json,
        function(i) {
            cllxNmObj[json[i].name] = json[i].nm;
            btns_cllx[i] = {
                text: json[i].name,
                onClick: function() {
                    $$('#slyyQhmsThirdCLLX').val(json[i].name);
                    var currentSelect = $$('#slyyQhmsThirdCLLX').val();
                    cllxNmSlyyQhmsThird = cllxNmObj[currentSelect];
                    //不显示车牌号
                       if (json[i].lx === '0') {
                           $$("div[name^='slyyQhmsThirdCPHLIName']").css('display', 'none');
                           isShowCphSlyyQhmsThird = "none";
                       } else {
                            $$("div[name^='slyyQhmsThirdCPHLIName']").css('display', '');
                            //modify begin by lichaolc at 2020年7月16日 for 车船优化
                              var titleText = $$("#slyyQhmsThirdCLSL").val();
                              //重新设置提示预约数量
                              setYyslts(titleText.substring(0, 1),czdyysl);
                               isShowCphSlyyQhmsThird = "";
                              //重新生成输入框
                              if(titleText.substring(0, 1)){
                                 initSlyyQhmsThirdCPHLi(titleText.substring(0, 1));
                              }
                            //modify end by lichaolc at 2020年7月16日 for 车船优化
                       }
                }
            }
        });
        $$('#slyyQhmsThirdCLLX').click(function() {
            myApp.actions(btns_cllx);
        });
    }
    //时间改变触发方法查询数据
    function slyyQhmsTimeChangeTriggerFunQueryData(queryType,czlx) {
          if (isMapOpen) { //地图
             $$("#slyyQhmsHomePageContentDiv").css({"height":"calc(100% - 0px)", "overflow": "hidden"});
             $$('#slyyQhmxStorageReserveList').children().remove();
             $$('#slyyQhmxStorageReserveList').css('display', 'none');
             this.slyyQhmsHomeRQ_punchin = slyyQhmsModule.slyyQhmsHomeRQ;
             punchInModule.initPunchIn(slyyQhmsModule.slyyQhmsJsonObj);
             $$(".tab-more-mm").css("display", "none");
         } else {
             $$('#slyyQhmxStorageReserveList').css('display', 'block');
             $$("#slyyQhmsHomePageContentDiv").css({"height":"calc(100% - 220px)", "overflow": "scroll"});
             slyyQhmsHomePageIndex = 0;
             //$$("#slyyQhmsDataListUL").children().remove();
             //查询数据列表
         }
         querySlyyQhmsDateList(queryType,czlx);
    }
    //点击姓名后的修改图标后的操作
    function JSRNameChangeView() {
//        var flag = $$("#JSRNameChange").css("display");
//        if (flag == 'inline' || flag == "block") {
//            $$("#JSRNameChange").css("display", "none");
//            $$("#slyyQhmsThirdJSRName").removeAttr('readonly');
//            $$("#slyyQhmsThirdJSRName").attr('value', "");
//            $$("#slyyQhmsThirdJSRName").attr('placeholder', "请输入结算人姓名");
//        } else if (flag == 'none') {
//            $$("#JSRNameChange").css("display", "inline");
//        }
          $$("#slyyQhmsThirdJSRName").removeAttr('readonly');
          $$("#slyyQhmsThirdJSRName").attr('value', "");
          $$("#slyyQhmsThirdJSRName").attr('placeholder', "请输入结算人姓名");
          $$("#slyyQhmsThirdJSRName").css('margin-right', "0");
          $$("#JSRNameChange").css("display", "none");
    }


    function slyyVerifyCodeCheckSubmit() {
        $$('#slyyThirdYzmDiv').css('display', 'block');
        if (loginSMSVcode_intervalProcessYy != '') {
            clearInterval(loginSMSVcode_intervalProcessYy);
        }
        $$('#slyyThirdYzmCaptchaInput').val('');
        $$('#slyyThirdYzmPhoneInput').val('');
        loginSMSVcode_DjsAmountYy = 180;
        refreshCaptcha();
    }


    //提交预约信息
    var yysqParams="";
    function slyyQhmsSubmit() {
        // 预约人
        var yyr = $$("#slyyQhmsThirdYYRName").val();
        // 提交人
        var tjr =  cmApi.userInfo.getUserNm();
        // 预约人身份证
        var yyrsfz = cmApi.userInfo.getUserIDCard();
        // 结算人
        var jsr = $$("#slyyQhmsThirdJSRName").val();
        // 联系方式
        var lxfs=cmApi.userInfo.getUserId();
        var jsonObjData = slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum];
        var jsonObjDataSjd = jsonObjData.yypzmxList[slyyQhmsJsonObjDataSjdListNum];
        //配置内码
        var pznm = jsonObjData.yypznm;
        //配置明细内码
        var pzmxnm = jsonObjDataSjd.yypzmxnm;
        //组织内码
        zznm = jsonObjData.zznm;
        //组织名称
         zzmc = jsonObjData.zzmc;
        //日期
        var rq = jsonObjData.rq;
        //短信验证吗验证
//        if ($$("#slyyQhmsDxyzmLi").css("display")!= 'none') {
//              if(!sendFlagYy){
//               cmApi.prompt.toast('请获取短信验证码');
//               return;
//             }
//             if($$("#slyyQhmsDxyzm").val() ==""){
//                  cmApi.prompt.toast('请输入验证码');
//                  return;
//             }
//
//        }
        //粮食品种名称,粮食品种是对应的公用参数
        var lspzmc = $$("#lspzmc").val();
        if (lspzmc == "") {
            cmApi.prompt.toast("请选择粮食品种！");
            return;
        }
        //粮食装粮地点
        var zldd = $$("#zldd").val();
        //开始时间
        var kssj = jsonObjDataSjd.kssj;
        //结束时间
        var jssj = jsonObjDataSjd.jssj;
        //预约车辆数
        var cs = $$("#slyyQhmsThirdCLSL").val();
        if (cs == '') {
            cmApi.prompt.toast('请填写预约车辆数');
            return;
        }
        cs = cs.substring(0, cs.indexOf("车"));

        //大于0的正则表达式
        // 再次校验，当前时间是否可预约 start
        var myDate = new Date();
        var hour = myDate.getHours();
        var minutes = myDate.getMinutes();
        if(hour <10){
            hour = "0"+hour;
        }
        if(minutes <10){
          minutes = "0"+minutes;
         }
        var dqsj = hour+""+minutes;
        if(dqsj <kfyykssj || dqsj >kfyyjssj){
            cmApi.prompt.toast("请在" + kfyykssj.substring(0, 2) + ":" + kfyykssj.substring(2, 4) + "-" + kfyyjssj.substring(0, 2)+ ":" + kfyyjssj.substring(2, 4) + "进行预约！");
           return;
        }  // 再次校验，当前时间是否可预约 end

        // 数量的校验规则
        var regSl = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
          // 企业名称
           var qymc =  "";
           // 信用代码
           var xydm = "";
        // 区分业务：车辆类型、车牌号、预约数量，其中承运人、承运人内码、手机号、身份证号只有出库业务有
        // 出库业务：

        if(ywlx===0 && userType==='01'){
            // 车辆类型
            if (cllxNmSlyyQhmsThird == '') {
                cmApi.prompt.toast('请选择车船类型');
                return;
            }
            // 车牌号
            var cph = "";
            //如果isShowCphSlyyQhmsThird为空则表示必须输入车牌号
            // 入库业务
            var isChuan = $$("#slyyQhmsThirdCLLX").val().indexOf("船")!=-1 ? true:false;
            if (isShowCphSlyyQhmsThird == '') {
                var wkcph = true;
                var cfcph = false;
                $$('input[name^="slyyQhmsThirdCPHName"]').each(function(i) {
                    var cphval = $$(this).val();
                    if (cphval == '') {
                        wkcph = false;
                        return;
                    } else {
                        var reg = /^[A-Za-z]+$/;
                         if ((!isChuan)&&(!reg.test(cphval.substring(1, 2)) || (cphval.length != 7 && cphval.length != 8))) {
                            wkcph = false;
                            return;
                        }
                        if(cph.indexOf(cphval) != -1){
                            cfcph = true;
                            return;
                        }
                        cph = cph + $$(this).val() + ",";
                    }
                });
                if (!wkcph) {
                    cmApi.prompt.toast('请填写正确车牌号或船号');
                    return;
                }
                if (cfcph) {
                    cmApi.prompt.toast('车牌号存在重复，请核查并修改');
                    return;
                }
            }
            // 预约数量
            var sl = $$("#slyyQhmsThirdSL").val();
            if (!regSl.test(sl)) {
                cmApi.prompt.toast('请填写正确的预约数量');
                return;
            }else {
                //判断是不是船
                var isChuan = $$("#slyyQhmsThirdCLLX").val().indexOf("船")!=-1 ? true:false;
                //是船
                if(isChuan){
                    if((cs*czdyysl)<sl){
                        cmApi.prompt.toast('预约数量不能超过'+cs*czdyysl+'吨');
                        return;
                    }
                }else{
                    if(cs ==1 &&sl > 100 ) {
                        cmApi.prompt.toast('预约数量不能超过100吨');
                        return;
                    }
                    if(cs ==2 &&sl > 200 ) {
                        cmApi.prompt.toast('预约数量不能超过200吨');
                        return;
                    }
                    if(cs ==3 &&sl > 300 ) {
                        cmApi.prompt.toast('预约数量不能超过300吨');
                        return;
                    }
                }
            }
            var cyr="";
            var cyrnm="";
            var cyrsfzh="";
            var cyrsjh="";
            var tzdbh="";
             qymc="";
            xydm="";
        }else if(ywlx===0 && userType!=='01'){// 入库 多主体
            var result = true;
            // 承运人
           var cyr = "";
             // 承运人手机号
             var cyrsjh = "";
            // 车牌号：
            var cph = "";
           $$('input[name^="slyyQhmsThirdThyyCYRName"]').each(function(i) {
                  var cyrval = $$(this).val();
                  var cyrSjhval = $$("#slyyQhmsThirdSJH"+i).val();
                  var cphval = $$("#slyyQhmsThirdCPH"+i).val();
                  var cllxval = $$("#slyyQhmsThirdCLLX"+i).val();
                  if(!result){
                        return;
                  }
                  if(cyrval == '')  {
                        cmApi.prompt.toast('请选择第'+ (parseInt(i)+parseInt(1)) +'个承运人！');
                        result = false;
                        return;
                  }else if(cyrSjhval == ''){
                        cmApi.prompt.toast('请选择第'+ (parseInt(i)+parseInt(1)) +'个承运人手机号！');
                         result = false;
                         return;
                  }else if(cphval == ''){
                        cmApi.prompt.toast('请选择第'+ (parseInt(i)+parseInt(1)) +'个车船号！');
                         result = false;
                         return;
                  }else if(cllxval == ''){
                        cmApi.prompt.toast('请选择第'+ (parseInt(i)+parseInt(1)) +'个车辆类型！');
                         result = false;
                         return;
                  } else {
                     if(cyrval != '' && cyrSjhval != '' && cphval != '' ){
                        if (cyrSjhval.length != 11 || cyrSjhval.substring(0, 1) != '1') {
                            cmApi.prompt.toast('请正确输入第'+(parseInt(i)+parseInt(1))+'个承运人手机号');
                            result = false;
                            return false;
                         }
                        cyr = cyr + cyrval + ",";
                        cyrsjh = cyrsjh + cyrSjhval + ",";
                        if(cph.indexOf(cphval) != -1){
                            cmApi.prompt.toast('车牌号存在重复，请核查并修改');
                            result = false;
                            return false;
                        }
                        cph = cph + cphval + ",";
                        cllxNmSlyyQhmsThird = cllxNmSlyyQhmsThird + $$("#slyyQhmsThirdCLLXId"+i).val() + ",";
                     }
                  }
            });

           if (!result){
                return false;
           }

            // 预约数量 增加数量限制
            var sl='0';
            if(ywlx===0 && userType!=='01'){
                sl = $$("#slyyQhmsThirdSL").val();
                if (!regSl.test(sl)) {
                    cmApi.prompt.toast('请填写正确的预约数量');
                    return;
                }
                if(cs ==1 &&sl > 100 ) {
                     cmApi.prompt.toast('预约数量不能超过100吨');
                     return;
                }
                if(cs ==2 &&sl > 200 ) {
                     cmApi.prompt.toast('预约数量不能超过200吨');
                     return;
                }
                if(cs ==3 &&sl > 300 ) {
                     cmApi.prompt.toast('预约数量不能超过300吨');
                     return;
                }
                if(cs ==4 &&sl > 400 ) {
                      cmApi.prompt.toast('预约数量不能超过400吨');
                      return;
                }
            }else{
                sl='0';
            }
           var tzdbh="";
            if(userType.substring(0,1)=='1'){// 企业
                qymc = $$("#slyyQhmsThirdYYRQYMC").val();
                xydm = $$("#slyyQhmsThirdYYRXYDM").val();
            }
        }else{
            var result = true;
           // 车粮类型
           $$('input[name^="slyyQhmsThirdThyyCLLXName"]').each(function(i) {
               var cllxval = $$(this).val();
               if (cllxval == '') {
//                    cmApi.prompt.toast('请选择第'+ i +'个车辆类型！');
               } else {
                   cllxNmSlyyQhmsThird = cllxNmSlyyQhmsThird + $$(this).val() + ",";
               }
           });
           // 承运人内码
           var cyrnm = "";
           $$('input[name^="slyyQhmsThirdThyyCYRNMName"]').each(function(i) {
                var cyrnmval = $$(this).val();
                if (cyrnmval == '') {
//                    cmApi.prompt.toast('请选择第'+ i +'个承运人！');
//                    return;
                } else {
                    cyrnm = cyrnm + $$(this).val() + ",";
                }
            });

            // 承运人身份证号
            var cyrsfzh = "";
            $$('input[name^="slyyQhmsThirdThyyCYRSFZHName"]').each(function(i) {
                 var cyrsfzhval = $$(this).val();
                 if (cyrsfzhval == '') {
//                     cmApi.prompt.toast('请选择第'+ i +'个承运人身份证号！');
//                     return;
                 } else {
                     cyrsfzh = cyrsfzh + $$(this).val() + ",";
                 }
             });
             // 承运人
             var cyr = "";
             // 承运人手机号
             var cyrsjh = "";
            // 车牌号：
            var cph = "";
             $$('input[name^="slyyQhmsThirdThyyCYRName"]').each(function(i) {
                  var cyrval = $$(this).val();
                  var cyrSjhval = $$("#slyyQhmsThirdSJH"+i).val();
                  var cphval = $$("#slyyQhmsThirdCPH"+i).val();
                  if(cyrval == '' && cyrSjhval == '' && cphval == '')  {

                  } else {
                     if(cyrval != '' && cyrSjhval != '' && cphval != '' ){
                        if (cyrSjhval.length != 11 || cyrSjhval.substring(0, 1) != '1') {
                            cmApi.prompt.toast('请正确输入第'+(parseInt(i)+parseInt(1))+'个承运人手机号');
                            result = false;
                            return false;
                         }
                        cyr = cyr + cyrval + ",";
                        cyrsjh = cyrsjh + cyrSjhval + ",";
                        cph = cph + cphval + ",";
                     }else{
                        if(cyrval === ''){
                            cmApi.prompt.toast('请维护第'+(parseInt(i)+parseInt(1))+'个承运人');
                            result = false;
                            return false;
                        }
                        if(cyrSjhval === ''){
                            cmApi.prompt.toast('请维护第'+(parseInt(i)+parseInt(1))+'个承运人手机号');
                            result = false;
                            return false;
                        }else{
                            if (cyrSjhval.length != 11 || cyrSjhval.substring(0, 1) != '1') {
                                cmApi.prompt.toast('请正确输入第'+(parseInt(i)+parseInt(1))+'个承运人手机号');
                        	    result = false;
                                return false;
                        	}
                        }
                        if(cphval === ''){
                            cmApi.prompt.toast('请维护第'+(parseInt(i)+parseInt(1))+'个车船号');
                            result = false;
                            return false;
                        }
                     }
                  }
              });
            // 预约数量
            var sl='0';
            if(ywlx===0 && userType!=='01'){
                sl = $$("#slyyQhmsThirdSL").val();
                if (!regSl.test(sl)) {
                    cmApi.prompt.toast('请填写正确的预约数量');
                    return;
                }
            }else{
                sl='0';
            }
            if (!result){
                return false;
            }
            // 通知单编号
            var tzdbh = "";
            if(ywlx==1){
                tzdbh = $$("#tzdbh").val();
                if (tzdbh == "") {
                    cmApi.prompt.toast("请选择通知单！");
                    return;
                }
            }
            // 结算人
            var jsr = "";
            if(ywlx==0){
                jsr = $$("#slyyQhmsThirdJSRName").val();
            }

            if(userType.substring(0,1)=='1'){// 企业
                qymc = $$("#slyyQhmsThirdYYRQYMC").val();
                xydm = $$("#slyyQhmsThirdYYRXYDM").val();
            }
       }
        //再次校验，预约车数不能超过剩余车数
        if (parseInt(cs) > parseInt(jsonObjDataSjd.syhsl)) {
            cmApi.prompt.toast('不能超过剩余预约车辆数');
            return;
        }
         var str = $$("#slyyQhmsThirdULId").html();
         // opendid
        var systemType = cmApi.device.getType();
        var mobileDeviceId = cmApi.device.getDeviceId();
        $$('#subBtnQh').attr('disabled', true);
         yysqParams = {"yyr": yyr ,"tjr":tjr ,"sfz":yyrsfz,"jsr":jsr ,"phone": lxfs,"lxfs":lxfs,
            "pznm":pznm ,"pzmxnm": pzmxnm ,"zznm": zznm ,"zzmc":zzmc ,"rq":rq ,"lsnm":lspz ,
            "lsmc":lspzmc ,"zldd":zldd ,"kssj":kssj ,"jssj":jssj,"cs": cs,"sl":sl ,"cphStr": cph ,
            "cllxNm": cllxNmSlyyQhmsThird ,"cyrnm":cyrnm ,"tzdbh":tzdbh,"ywlx":ywlx ,"cyr": cyr ,
            "cyrsfzh": cyrsfzh ,"cyrsjh": cyrsjh  ,"qymc":  qymc ,"xydm":  xydm ,"wxdlFlag":wxdlFlag,
            "userType":userType,dxyzm:$$("#slyyThirdYzmPhoneInput").val(), "mobileDeviceId": mobileDeviceId,
            "longitude": slyyQhmsModule.slyyQhmsLongitude, "latitude": slyyQhmsModule.slyyQhmsLatitude, "uuid": slyyThirdImageCaptchaVerifyUUID,
            "yyfsnm": jsonObjData.yyfsnm, "yyfsmc": jsonObjData.yyfsmc};
        // var params = "{'yyr':'" + yyr + "','tjr':'" + tjr + "','sfz':'" + yyrsfz + "','jsr':'" + jsr + "','lxfs':'" + lxfs + "','pznm':'" + pznm + "','pzmxnm':'" + pzmxnm + "','zznm':'" + zznm + "','zzmc':'" + zzmc + "','rq':'" + rq + "','lsnm':'" + lspz + "','lsmc':'" + lspzmc + "','kssj':'" + kssj + "','jssj':'" + jssj + "','cs':'" + cs + "','sl':'" + sl + "','cphStr':'" + cph + "','cllxNm':'" + cllxNmSlyyQhmsThird + "','cyrnm':'" + cyrnm + "','tzdbh':'" + tzdbh + "','ywlx':'" + ywlx + "','cyr':'" + cyr + "','cyrsfzh':'" + cyrsfzh + "','cyrsjh':'" + cyrsjh + "','qymc':'" + qymc + "','xydm':'" + xydm + "','userType':'" + userType + "'}";
        if (!(systemType == "ios" || systemType == "android")) {
            //微信提交时执行此方法
            var openId = cmApi.getStringSession("openId", openId);
            yysqParams.openId=openId;
            if(openId != undefined && openId != 'null' && openId == '' ){
                mobileDeviceId = openId;
            }
            yysqParams.mobileDeviceId=mobileDeviceId;
        }

//        // 校验该车牌号是否有已预约的记录
        if(cph != ''){
            var cphParams = {"zznm":zznm ,"cph":cph};
            httpPostAsync('service/nhyy/checkCphYycs', cphParams, 'slyyQhmsModule.checkCphCallback');
        }else{
            var yk = cmApi.getStringSession("yk");
            if(ywlx ==0 && !wxdlFlag && !yk){
               checkFrequencyForSubmitYy();
            }else{
                yysqParams =  secretYysqParams(yysqParams);
                var str = JSON.stringify(yysqParams);
                sessionStorage.setItem('yysqParams',JSON.stringify(yysqParams));
                httpPostAsync('service/nhyy/reserve', yysqParams, 'slyyQhmsModule.slyyQhmsSubmitCallback');
            }
        }


//         var yk = cmApi.getStringSession("yk");
//        if(ywlx ==0 && !wxdlFlag && !yk){
//           checkFrequencyForSubmitYy();
//        }else{
//            yysqParams =  secretYysqParams(yysqParams);
//            var str = JSON.stringify(yysqParams);
//            sessionStorage.setItem('yysqParams',JSON.stringify(yysqParams));
//            httpPostAsync('service/nhyy/reserve', yysqParams, 'slyyQhmsModule.slyyQhmsSubmitCallback');
//        }
    }

     function checkCphCallback(obj) {
        if (obj) {
            // retCode：0无预约记录，1有预约记录，9允许多次预约
            // 1有预约记录时，提示【车牌号***在当前粮库已有预约记录，不允许重复预约】
            if (obj.data.retCode == 1) {
//                cmApi.prompt.toast(obj.data.msg);
                myApp.alert(obj.data.cph + "已在本库有预约记录，请入库后再次预约");
                $$('#subBtnQh').removeAttr('disabled');
                return ;
            } else if(obj.data.retCode == 2){
                 myApp.alert(obj.data.cph + "已超过本日预约次数");
                 $$('#subBtnQh').removeAttr('disabled');
                 return ;
            }else if(obj.data.retCode == 3){
                myApp.alert(obj.data.cph + "今日已在本库预约，请过几小时再进行预约");
                $$('#subBtnQh').removeAttr('disabled');
                return ;
            }else if(obj.data.retCode == 0){
                var yk = cmApi.getStringSession("yk");
                if(ywlx ==0 && !wxdlFlag && !yk){
                   checkFrequencyForSubmitYy();
                }else{
                    yysqParams =  secretYysqParams(yysqParams);
                    var str = JSON.stringify(yysqParams);
                    sessionStorage.setItem('yysqParams',JSON.stringify(yysqParams));
                    httpPostAsync('service/nhyy/reserve', yysqParams, 'slyyQhmsModule.slyyQhmsSubmitCallback');
                }
            }
        }
     }

    // 提交的返回函数
    function slyyQhmsSubmitCallback(obj) {
        var jsonObjData = slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum];
        // 预约方式
        let yyfsnm = jsonObjData.yyfsnm;
        yyfs = yyfsnm;
        let yyfsFlag = "";
        if (yyfsnm=="2"){
            yyfsFlag = "登记";
        }else if (yyfsnm=="1"){
            yyfsFlag = "预约"
        }
        if (obj) {
            if (obj.retCode == '1') {
                var sjdJson = jsonObjData.yypzmxList;
                var jsonObj = obj.data;
                if (jsonObj.retCode == '1' || jsonObj.retCode=='2') {
                    cmApi.router.loadContent(LOAD_CONTENT_PREFIX + '/html/slyyQhms/slyySuccess.html');
                    $$('#fpmsPic').hide();
                    $$('#qhmsPic').show();
                    $$('#failedPic').hide();
                    $$('#isSuccess_bar').html(yyfsFlag+"成功");
                    $$('#isSuccess').html(yyfsFlag+"成功");
                    if(ywlx === 0){
                      if(yyfsnm=='2'){
                        $$('#isSuccess_content').html("请耐心等待库里人员给您分配售粮时间，分配后您会收到消息提醒，请注意查收并进行信息确认");
                      }else{
                        $$('#isSuccess_content').html("您已成功预约" + dateUtil.timeFormatChangeToYMDStandard(jsonObjData.rq) + " " + dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].kssj) + "-" + dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].jssj) + "售粮，请在售粮当日按时到达粮库进行现场签到。");
                      }
                    }else{
                      $$('#isSuccess_content').html("您已成功"+yyfsFlag + dateUtil.timeFormatChangeToYMDStandard(jsonObjData.rq) + " " + dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].kssj) + "-" + dateUtil.timeFormatChangeToHMStandard(sjdJson[slyyQhmsJsonObjDataSjdListNum].jssj) + "提货，请在提货当日按时到达粮库进行现场签到。");
                    }
                } else {
                     var errMsg = jsonObj.msg;
                   if(errMsg.indexOf("验证码有误")!=-1 || errMsg.indexOf("短信验证码校验失败请重新获取")!=-1  || errMsg.indexOf("手机验证码已失效,请重新获取")!="-1"  ){
                         myApp.alert(errMsg);
                         $$('#subBtnQh').removeAttr('disabled');
                        return;
                   }
                    cmApi.router.loadContent(LOAD_CONTENT_PREFIX + '/html/slyyQhms/slyySuccess.html');
                    $$('#fpmsPic').hide();
                    $$('#qhmsPic').hide();
                    $$('#failedPic').show();
                    $$('#isSuccess_bar').html(yyfsFlag+"失败");
                    $$('#isSuccess').html(yyfsFlag+"失败");
                    $$('#isSuccess_content').html(jsonObj.msg);
                }
                if(ywlx===0){
                    $$("#slyyjl").css('display','');
                }else{
                    $$("#thyyjl").css('display','');
                }
            } else if (obj.retCode == '0') {
                cmApi.prompt.toast("网络异常，请重复操作！");
            }
        } else {
            relogin();
        }
        $$('#proceedName').html("继续"+yyfsFlag);
        $$('#slyyjl_name').html("查看"+yyfsFlag+"记录");
        $$('#thyyjl_name').html("查看"+yyfsFlag+"记录");
        $$('#proccessDiv').hide();
        $$('#subBtnQh').attr('disabled', false);

    }
    function openYyjl(flag){
        if (yyfs == "1"){
            mainModule.slyycx(flag);
        }else{
            cmApi.router.turnToPage('djqkcx', ywlx);
        }

    }
    //滚动加载事件
    function slyyQhmsHomeInfiniteScroll() {
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite',
        function() {
            // 如果正在加载，则退出
            if (slyyQhmsHomeLoading) return;
            slyyQhmsHomeLoading = true;
            slyyQhmsHomePageIndex = slyyQhmsHomePageIndex + slyyQhmsHomePageSize;
            //查询数据列表
            querySlyyQhmsDateList();
        });
    }
    //打电话
    function syyyQhmsSecondCallPhone() {
        var wkPhoneNum = $$("#syyyQhmsSecondLXFS").val();
        if (wkPhoneNum == '') {
            return;
        }
        window.location.href = 'tel:' + wkPhoneNum;
    }
    //初始化日历
    function initSlyyQhmsHomeCalendar() {
        slyyQhmsHomeCalendarDefault = myApp.calendar({
            input: '#slyyQhmsHomeCalendar',
            monthNames: slyyQhmsHomeMonthNames,
            dayNamesShort: slyyQhmsHomeDayNames,
            onDayClick: function(p, dayContainer, year, month, day) {
                var selectDate = new Date(year, month, day);
                year = selectDate.getFullYear();
                month = selectDate.getMonth();
                day = selectDate.getDate();
                month = (Number(month) + 1);
                //不能选择今天以及今天以前的日期
                //  if (!checkCalendarIsRight(year, month, day)) return;
                var flag =checkCalendarIsRight(year, month, day);
                    if (flag=="1") {
                        cmApi.prompt.toast('不能预约之前的日期！');
                        slyyQhmsHomeCalendarDefault.close();
                        return;
                    }else if (flag=="2") {
                        cmApi.prompt.toast('不能预约七天后的日期！');
                        slyyQhmsHomeCalendarDefault.close();
                        return;
                    }
                slyyQhmsHomeCalendarDefault.close();
                var wkday = selectDate.getDay();
                var week = slyyQhmsHomeWeekArray[wkday];
                var str = year + '年' + month + '月' + day + '日  ' + week;
                $$("#slyyQhmsHomeCalendar").text(str);
                slyyQhmsHomeCalendarTime = year + '/' + month + '/' + day;
                //将时间付给全局变量
                month = month + "";
                if (month.length == 1) {
                    month = "0" + month;
                }
                day = day + "";
                if (day.length == 1) {
                    day = "0" + day;
                }
                slyyQhmsModule.slyyQhmsHomeRQ = year + '' + month + day;
                //时间改变触发方法查询数据
                //时间合理就触发，时间不合理就会提示用户不可预约
                timeChangeToSearch();
            },
        });
    }
    // 专为日期调整
    function timeChangeToSearch() {
        const kqmc = $$('#searchKqmc').val();
        if (ywlx === 0 && (!kqmc || kqmc === '')) {
            // 恢复初始状态
            cmApi.setStringSession('resvKdListObj','');
            $$('#slyyQhmxStorageReserveList').css('display', 'none');
            $$('#slyyQhmxStorageReserveList').children().remove();
            $$('#slyyQhmxStorageSearchTip').css('display', 'block');
            $$('#slyyQhmxStorageReserveListNO').css('display', 'none');
            closeSelectedMaskLayer();
            $$('#slyyQhmxDropSearch').css('display', 'none');
            selectedDistance = '';
            $$('#slyyQhmxDistanceText').html('距离查询');
            selectedVariety = '';
            $$('#slyyQhmxVarietyText').html('品种');
        } else {
            slyyQhmsTimeChangeTriggerFunQueryData(1);
        }
    }
    //将日期设置成明天的，因为预约今天的没意义
    function initSlyyQhmsHomeSetDateToTomorrow() {
        var dt = new Date();
        //dt.setDate(dt.getDate() + 1);
        dt.setDate(dt.getDate());
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var ymd = y + '/' + m + '/' + d;
        slyyQhmsHomeCalendarTime = ymd;
        //将日历时间设置成明天
        slyyQhmsHomeCalendarDefault.setValue([ymd]);
        var wkday = new Date(ymd).getDay();
        var week = slyyQhmsHomeWeekArray[wkday];
        var str = y + '年' + m + '月' + d + '日  ' + week;
        $$("#slyyQhmsHomeCalendar").text(str);
        //将时间付给全局变量
        m = m + "";
        if (m.length == 1) {
            m = "0" + m;
        }
        d = d + "";
        if (d.length == 1) {
            d = "0" + d;
        }
        slyyQhmsModule.slyyQhmsHomeRQ = y + '' + m + d;
    }
    //点击“前一天”、“后一天”按钮触发方法
    function slyyQhmsHomeChangeCalendarDate(num) {
        var dt = new Date(slyyQhmsHomeCalendarTime);
        dt.setDate(dt.getDate() + num);
        var ksrq = dateUtil.getDateStr(new Date().getTime(), 0).replace('年', '').replace('月', '').replace('日', '');;
        var jsrq = dateUtil.getDateStr(new Date().getTime(), 7).replace('年', '').replace('月', '').replace('日', '');;
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate();
        var time =y+m+d;
        var ymd = y + '/' + m + '/' + d;
        //不能选择今天以及今天以前的日期
        var flag = checkCalendarIsRight(y, m, d);
        if (flag=="1") {
            cmApi.prompt.toast('不能预约之前的日期！');
            return;
        }else if (flag=="2") {
            cmApi.prompt.toast('不能预约之后的日期！');
            return;
        }
        slyyQhmsHomeCalendarTime = ymd;
        //将日历时间设置成明天
        slyyQhmsHomeCalendarDefault.setValue([ymd]);
        var wkday = new Date(ymd).getDay();
        var week = slyyQhmsHomeWeekArray[wkday];
        var str = y + '年' + m + '月' + d + '日  ' + week;
        $$("#slyyQhmsHomeCalendar").text(str);
        //将时间付给全局变量
        m = m + "";
        if (m.length == 1) {
            m = "0" + m;
        }
        d = d + "";
        if (d.length == 1) {
            d = "0" + d;
        }
        slyyQhmsModule.slyyQhmsHomeRQ = y + '' + m + d;
        //时间改变触发方法查询数据
        // 售粮预约点击时需要触发行为验证码验证
        var yk = cmApi.getStringSession("yk");
        if(ywlx ==0 && !wxdlFlag && !yk){
           checkFrequency();
        }else{
           timeChangeToSearch();
        }

    }
    //判断日历选择的时间是否正确，如果是今天以及今天以前的日期返回1,如果是一周以后的返回2
    function checkCalendarIsRight(y, m, d) {
        var ret = "0";
        //要查询的日期
        var ymd = y + '/' + m + '/' + d;
        var newDate = new Date(ymd).getTime();
        //当前日期
        var nowDate = new Date();
        var nowy = nowDate.getFullYear();
        var nowm = nowDate.getMonth() + 1;
        var nowd = nowDate.getDate();
        var nowymd = nowy + '/' + nowm + '/' + nowd;
        var today = new Date(nowymd).getTime();
        //一周后的日期
        var jsrq = dateUtil.getDateStr(new Date().getTime(), 7).replace('年', '/').replace('月', '/').replace('日', '/');
        var jsrq = new Date(jsrq).getTime();
        if (newDate != "" && today != "" && (today > newDate)) {
            ret = "1";//不可查询今天之前的日期
        }else{
            if(newDate != "" && jsrq != "" && (newDate > jsrq)){
                ret = "2";//不可查询一周后的日期
            }
        }
        return ret;
    }
    //获取当天日期
    function getNowFormatDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + "" + month + "" + strDate;
        return currentdate;
    }
    //售粮须知
    function slNotice() {
        myApp.modal({
            title: '<div style="text-align: left;">售粮须知：</div>',
            text: '<div style="color:#666666;text-align: left;">' + slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum].lszlbz + '</div>',
            buttons: [{
                text: '<span style="color:#46c58e">我知道了</span>'
            }]
        });
    }
    //预约流程
    function yyProcess(lcstr) {
        var imgurl = "";
        if (lcstr === "chosetime") {
            imgurl = "../../image/choselk/lc_chosetime.png";
        } else {
            imgurl = "../../image/choselk/lc_dfp.png";
        }
        myApp.modal({
            title: '<div style="text-align: left;">预约流程：</div>',
            text: '<div><img src="' + imgurl + '" width="210px"/></div>',
            buttons: [{
                text: '<span style="color:#46c58e">我知道了</span>'
            }]
        });
    }

    function continueYy() {
        var options = {
            pageName: 'slyyQhmsHomePage',
            force: true
        };
        querySlyyQhmsDateList();
        mainView.router.back(options);
	 // 页面跳转后延迟执行，确保 DOM 已更新
            setTimeout(function () {
                enableDivsByClass('slyy-qhmx-reserve-area',true); // 调用你的 disableDiv 方法
            }, 100); // 可根据需要调整延迟时间

    }

    function createCphAreali() {
        var areas = ['京', '津', '冀', '鲁', '蒙', '辽', '吉', '黑', '晋', '皖', '豫', '苏', '沪', '浙', '闽', '赣', '鄂', '湘', '粤', '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新', ''];
        var areali = '';
        for (var i = 0; i < areas.length; i++) {
            var ischeck = '';
            //if (areas[i] === '吉') ischeck = 'checked="checked"';
            areali += '<li>                                                                                                    ' + '  <label class="label-radio item-content left0-label">                                                  ' + '    <input type="radio" class="my-radio-slyy" name="my-radio-slyy" value="Books" ' + ischeck + '>     ' + '    <div class="item-inner">                                                                            ' + '      <div class="item-title">' + areas[i] + '</div>                                                        ' + '    </div>                                                                                              ' + '  </label>                                                                                              ' + '</li>                                                                                                   ';
        }
        $$('#areaLi_ul').html(areali);
    }
    //解决微信公众号页面上移问题。
    function pwBlur() {
        window.scrollTo(0, 0);
    }

    function relogin() {
        cmApi.prompt.toast('会话失效，请重新登录！');
        cmApi.setStringSession("username", "");
        cmApi.setStringSession("password", "");
        cmApi.router.turnToPage('login');

    }

  Date.prototype.Format = function (fmt) { // author: meizz
      var o = {
          "M+": this.getMonth() + 1, // 月份
          "d+": this.getDate(), // 日
          "h+": this.getHours(), // 小时
          "m+": this.getMinutes(), // 分
          "s+": this.getSeconds(), // 秒
          "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
          "S": this.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
              return fmt;
  }

    // 出库业务：根据车辆数量增加承运人、手机号、车牌号、预约数量、运输工具
    function initSlyyQhmsThirdThyyCYR(n) {
        console.log(n);
        //n = n.substring(0, 1);
        $$('div[name^="slyyQhmsThirdThyyCYRLIName"]').remove();
        $$('div[name^="slyyQhmsThirdThyyCYRSJHLIName"]').remove();
        $$('div[name^="slyyQhmsThirdThyyCPHLIName"]').remove();
        $$('div[name^="slyyQhmsThirdCLLXLIName"]').remove();
         createCphAreali();
         var str  ="";
         let newStr = "";
        for (var i = 0; i < n; i++) {
            if(ywlx == 0){// 入库
                //承运人<input type="hidden" readonly id="slyyQhmsThirdYYR" value="">
//                str+= '<li name="slyyQhmsThirdThyyCYRLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '" <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">承运人<span style="color:red">*</span></div>' + '      <div class="item-input">';
//                str+= '         <input type="text" id="slyyQhmsThirdCYR' + i + '"  name="slyyQhmsThirdThyyCYRName' + i + '" num="' + i + '" maxlength="8" placeholder="点击右侧箭头可快速查找" style="text-align: right">';
//                str+= '         <input type="hidden" readonly id="slyyQhmsThirdCYRNM' + i + '"  name="slyyQhmsThirdThyyCYRNMName' + i + '" num="' + i + '">';
//                str+= '         <input type="hidden" readonly id="slyyQhmsThirdCLLX' + i + '"  name="slyyQhmsThirdThyyCLLXName' + i + '" num="' + i + '">';
//                str+= '         <input type="hidden" readonly id="slyyQhmsThirdSFZH' + i + '"  name="slyyQhmsThirdThyyCYRSFZHName' + i + '" num="' + i + '">'
//                    + '      </div>'
//                    + '      <div style="margin-left: 10px" onclick="slyyQhmsModule.openCyrSelect(' + i + ')">'
//                    + '           <div><img src="../../image/right.png" style="height:15px;"></div>'
//                    + '      </div>'
//                    + '    </div>'
//                    + '  </div>'
//                    + '</li>';
//                    //承运人手机号
//                 str+= '<li name="slyyQhmsThirdThyyCYRSJHLIName' + i + '" id="slyyQhmsCYRSJHLIId_slyy' + i + '" <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">承运人手机<span style="color:red">*</span></div>' + '      <div class="item-input">';
//                 str+= '         <input type="number" id="slyyQhmsThirdSJH' + i + '"  placeholder="请填写承运人手机号" name="slyyQhmsThirdThyyCYRSJHName' + i + '" num="' + i + '" style="text-align: right">'
//                    + '      </div>'
//                    + '    </div>'
//                    + '  </div>'
//                    + '</li>';
//                 //车牌号
//                 str+= '<li name="slyyQhmsThirdThyyCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '" <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">车船号<span style="color:red">*</span></div>' + '      <div class="item-input">';
//                 str+= '         <input type="hidden" readonly id="slyyQhmsThirdCLNM' + i + '"  name="slyyQhmsThirdThyyCLNMName' + i + '" num="' + i + '">';
//                 str+= '         <input type="text" id="slyyQhmsThirdCPH' + i + '"  placeholder="点击右侧箭头可快速查找" maxlength="8" name="slyyQhmsThirdThyyCPHName' + i + '" num="' + i + '" style="text-align: right">'
//                    + '      </div>'
//                    + '      <div style="margin-left: 10px" onclick="slyyQhmsModule.openClSelect(' + i + ')">'
//                                        + '           <div><img src="../../image/right.png" style="height:15px;"></div>'
//                                        + '      </div>'
//                    + '    </div>'
//                    + '  </div>'
//                    + '</li>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdThyyCYRLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '">';
                newStr += '  <div class="slyy-qhmx-form-title">承运人<span style="color:red">*</span></div>';
                newStr += '  <div class="slyy-qhmx-input-group">';
                newStr += '    <input type="text" id="slyyQhmsThirdCYR' + i + '"  name="slyyQhmsThirdThyyCYRName' + i + '" num="' + i + '" maxlength="8" placeholder="点击右侧箭头可快速查找" class="slyy-qhmx-form-input slyy-qhmx-arrow-input">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCYRNM' + i + '"  name="slyyQhmsThirdThyyCYRNMName' + i + '" num="' + i + '">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCLLXId' + i + '"  name="slyyQhmsThirdThyyCLLXId' + i + '" num="' + i + '">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdSFZH' + i + '"  name="slyyQhmsThirdThyyCYRSFZHName' + i + '" num="' + i + '">'
                newStr += '    <img src="../../image/right.png" class="slyy-qhmx-third-arrow-icon" alt=">" onclick="slyyQhmsModule.openCyrSelect(' + i + ')">';
                newStr += '  </div>';
                newStr += '</div>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdThyyCYRSJHLIName' + i + '" id="slyyQhmsCYRSJHLIId_slyy' + i + '">';
                newStr += '  <div class="slyy-qhmx-form-title">承运人手机<span style="color:red">*</span></div>';
                newStr += '  <input type="number" class="slyy-qhmx-form-input" id="slyyQhmsThirdSJH' + i + '"  placeholder="请填写承运人手机号" name="slyyQhmsThirdThyyCYRSJHName' + i + '" num="' + i + '">'
                newStr += '</div>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdCLLXLIName' + i + '" id="slyyQhmsThirdCLLXLIId' + i + '">';
                newStr += '     <div class="slyy-qhmx-form-title">车船类型<span style="color:red">*</span></div>';
                newStr += '     <input type="text" class="slyy-qhmx-form-input" readonly id="slyyQhmsThirdCLLX' + i + '" onclick="slyyQhmsModule.cllxSelect(' + i + ')" placeholder="请选择车船类型" name="slyyQhmsThirdThyyCLLXName' + i + '" num="' + i + '" >';
                newStr += ' </div>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdThyyCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '">';
                newStr += '  <div class="slyy-qhmx-form-title">车船号<span style="color:red">*</span></div>';
                newStr += '  <div class="slyy-qhmx-input-group">';
                newStr += '    <input type="text" id="slyyQhmsThirdCPH' + i + '" placeholder="点击右侧箭头可快速查找" maxlength="8" name="slyyQhmsThirdThyyCPHName' + i + '" num="' + i + '" class="slyy-qhmx-form-input slyy-qhmx-arrow-input">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCLNM' + i + '"  name="slyyQhmsThirdThyyCLNMName' + i + '" num="' + i + '">';
                newStr += '    <img src="../../image/right.png" class="slyy-qhmx-third-arrow-icon" alt=">" onclick="slyyQhmsModule.openClSelect(' + i + ')">';
                newStr += '  </div>';
                newStr += '</div>';
            }else{// 出库
                //承运人<input type="hidden" readonly id="slyyQhmsThirdYYR" value="">
//                str+= '<li name="slyyQhmsThirdThyyCYRLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '" <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">承运人</div>' + '      <div class="item-input">';
//                str+= '         <input type="text" id="slyyQhmsThirdCYR' + i + '"  name="slyyQhmsThirdThyyCYRName' + i + '" num="' + i + '" maxlength="8" placeholder="点击右侧箭头可快速查找" style="text-align: right">';
//                str+= '         <input type="hidden" readonly id="slyyQhmsThirdCYRNM' + i + '"  name="slyyQhmsThirdThyyCYRNMName' + i + '" num="' + i + '">';
//                str+= '         <input type="hidden" readonly id="slyyQhmsThirdCLLX' + i + '"  name="slyyQhmsThirdThyyCLLXName' + i + '" num="' + i + '">';
//                str+= '         <input type="hidden" readonly id="slyyQhmsThirdSFZH' + i + '"  name="slyyQhmsThirdThyyCYRSFZHName' + i + '" num="' + i + '">'
//                    + '      </div>'
//                    + '      <div style="margin-left: 10px" onclick="slyyQhmsModule.openCyrSelect(' + i + ')">'
//                    + '           <div><img src="../../image/right.png" style="height:15px;"></div>'
//                    + '      </div>'
//                    + '    </div>'
//                    + '  </div>'
//                    + '</li>';
//                    //承运人手机号
//                 str+= '<li name="slyyQhmsThirdThyyCYRSJHLIName' + i + '" id="slyyQhmsCYRSJHLIId_slyy' + i + '" <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">承运人手机</div>' + '      <div class="item-input">';
//                 str+= '         <input type="number" id="slyyQhmsThirdSJH' + i + '"  placeholder="请填写承运人手机号" name="slyyQhmsThirdThyyCYRSJHName' + i + '" num="' + i + '" style="text-align: right">'
//                    + '      </div>'
//                    + '    </div>'
//                    + '  </div>'
//                    + '</li>';
//                 //车牌号
//                 str+= '<li name="slyyQhmsThirdThyyCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '" <div class="item-content">' + '    <div class="item-inner">' + '      <div class="item-title label">车船号</div>' + '      <div class="item-input">';
//                 str+= '         <input type="hidden" readonly id="slyyQhmsThirdCLNM' + i + '"  name="slyyQhmsThirdThyyCLNMName' + i + '" num="' + i + '">';
//
//                 str+= '         <input type="text" id="slyyQhmsThirdCPH' + i + '"  placeholder="点击右侧箭头可快速查找" maxlength="8" name="slyyQhmsThirdThyyCPHName' + i + '" num="' + i + '" style="text-align: right">'
//                    + '      </div>'
//                    + '      <div style="margin-left: 10px" onclick="slyyQhmsModule.openClSelect(' + i + ')">'
//                                        + '           <div><img src="../../image/right.png" style="height:15px;"></div>'
//                                        + '      </div>'
//                    + '    </div>'
//                    + '  </div>'
//                    + '</li>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdThyyCYRLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '">';
                newStr += '  <div class="slyy-qhmx-form-title">承运人</div>';
                newStr += '  <div class="slyy-qhmx-input-group">';
                newStr += '    <input type="text" id="slyyQhmsThirdCYR' + i + '"  name="slyyQhmsThirdThyyCYRName' + i + '" num="' + i + '" maxlength="8" placeholder="点击右侧箭头可快速查找" class="slyy-qhmx-form-input slyy-qhmx-arrow-input">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCYRNM' + i + '"  name="slyyQhmsThirdThyyCYRNMName' + i + '" num="' + i + '">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCLLX' + i + '"  name="slyyQhmsThirdThyyCLLXName' + i + '" num="' + i + '">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdSFZH' + i + '"  name="slyyQhmsThirdThyyCYRSFZHName' + i + '" num="' + i + '">'
                newStr += '    <img src="../../image/right.png" class="slyy-qhmx-third-arrow-icon" alt=">" onclick="slyyQhmsModule.openCyrSelect(' + i + ')">';
                newStr += '  </div>';
                newStr += '</div>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdThyyCYRSJHLIName' + i + '" id="slyyQhmsCYRSJHLIId_slyy' + i + '">';
                newStr += '  <div class="slyy-qhmx-form-title">承运人手机</div>';
                newStr += '  <input type="number" class="slyy-qhmx-form-input" id="slyyQhmsThirdSJH' + i + '"  placeholder="请填写承运人手机号" name="slyyQhmsThirdThyyCYRSJHName' + i + '" num="' + i + '">'
                newStr += '</div>';

                newStr += '<div class="slyy-qhmx-form-row" name="slyyQhmsThirdThyyCPHLIName' + i + '" id="slyyQhmsCPHLIId_slyy' + i + '">';
                newStr += '  <div class="slyy-qhmx-form-title">车船号</div>';
                newStr += '  <div class="slyy-qhmx-input-group">';
                newStr += '    <input type="text" id="slyyQhmsThirdCPH' + i + '"  placeholder="点击右侧箭头可快速查找" maxlength="8" name="slyyQhmsThirdThyyCPHName' + i + '" num="' + i + '" class="slyy-qhmx-form-input slyy-qhmx-arrow-input">';
                newStr += '    <input type="hidden" readonly id="slyyQhmsThirdCLNM' + i + '"  name="slyyQhmsThirdThyyCLNMName' + i + '" num="' + i + '">';
                newStr += '    <img src="../../image/right.png" class="slyy-qhmx-third-arrow-icon" alt=">" onclick="slyyQhmsModule.openClSelect(' + i + ')">';
                newStr += '  </div>';
                newStr += '</div>';
            }
         }
//         if(ywlx===0 && userType!=='01'){
//            str+='<li id="slLi">'+$$("#slLi").html()+'</li>';
//                    var sl =  $$("#slyyQhmsThirdSL").val();
//                   $$("#slLi").remove();
//         }

         //$$("#slyyQhmsThirdULId").append(str);
         let targetDiv = document.getElementById('slyyQhmxCarNumberDiv');
         targetDiv.insertAdjacentHTML('afterend', newStr);
      }
     // ------------------------------------------承运人----------------------------------
     //打开承运人搜索栏
      var cyrNum='1';
     function openCyrSelect(i){
        cyrNum=i;
        var searchPanel= cmApi.router.loadHtml(LOAD_CONTENT_PREFIX + '/html/slyyQhms/cyrSearchPanel.html');
        $$("#commPanelSearch").html(searchPanel);
         myApp.openPanel('right');
        $$('#panelTitle').html('承运人');
        initCyrxx();
     }
     //初始化承运人信息
     function initCyrxx(){
         var userId = cmApi.userInfo.getUserId();
         var params = {'userId':userId};
         cmApi.request.httpPostAsync('service/nhyy/getCyrxxByUserId',params,'slyyQhmsModule.getCyrxxCallback');
     }
     //获取承运人信息回调函数
     function getCyrxxCallback(jsonObj){
         if (!jsonObj || jsonObj.totalRows=='0') {
             cmApi.prompt.toast("相关数据为空!");
             return false;
         }
         if(jsonObj.retCode == '1'){
            var json = jsonObj.data;
            slyyQhmsModule.slyyQhmsCyrxx = json;
            var htmlStr = '';
             $$('#cyrList').html('');
             $$.each(json,function(i){
                 var nm = json[i].nm;//承运人内码
                 var cyrxm = json[i].cyrxm;//承运人姓名
                 var sfzh = json[i].sfzh;//承运人身份证号
                 var cph = json[i].cph;//承运人车牌号
                 var lxdh = json[i].lxdh;//承运人手机号
                 var cllx = json[i].cllx;//车辆类型x
                 if(cph==null||cph==""){
                    htmlStr += '<li class="item-link item-content">'
                     +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectCyr(\''+i+'\')">'
                     +'  	<div class="item-title title"><div class="item-title title" style="width:65%;float:left;" >'+cyrxm+'</div>'
                     +'		<div class="item-media" style="width:35%;float: right;"></div></div>'
                     +'		<div class="item-subtitle">'
                     +'			<div class="span-item">'
                     +'				<span>'+lxdh+'</span>'
                     +' 			</div>'
                     +'			<div class="span-item">'
                     +'				<span>'+sfzh+'</span>'
                     +' 			</div>'
                     +' 		</div>'
                     +'	</div>'
                     +'</li>';
                 }else{
                    htmlStr += '<li class="item-link item-content">'
                     +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectCyr(\''+i+'\')">'
                     +'  	<div class="item-title title"><div class="item-title title" style="width:65%;float:left;" >'+cyrxm+'</div>'
                     +'		<div class="item-media" style="width:35%;float: right;"></div></div>'
                     +'		<div class="item-subtitle">'
                     +'			<div class="span-item">'
//                     +'				<span>'+cph+'</span>'
                     +'				<span>'+lxdh+'</span>'
                     +' 			</div>'
                     +'			<div class="span-item">'
                     +'				<span>'+sfzh+'</span>'
                     +' 			</div>'
                     +' 		</div>'
                     +'	</div>'
                     +'</li>';
                 }
             });
             $$('#cyrList').html(htmlStr);
             //实例化搜索
             var mySearchbar = myApp.searchbar('.searchbar', {
             searchList: '.list-block-search',
             searchIn: '.item-title,.item-subtitle'
             });
////////////////////////////////////////////////
         slyyQhmsModule.selectCyr(0);
         slyyQhmsModule.openClSelect(0);

////////////////////////////////////////////////

         }else{
            cmApi.prompt.toast('获取承运人信息失败');
         }
     }
     //选择通知单编号之后给页面赋值
     function selectCyr(i){
         //承运人信息
         var json = slyyQhmsModule.slyyQhmsCyrxx[i];
         var nm = json.nm//承运人内码
         var cyrxm = json.cyrxm;//承运人姓名
         var sfzh = json.sfzh;//承运人身份证号
         var cph = json.cph;//承运人车牌号
         var lxdh = json.lxdh;//承运人手机号
         var cllx = json.cclx;//车辆类型
         $$('#slyyQhmsThirdCYRNM' + cyrNum).val(nm);
         $$('#slyyQhmsThirdCYR' + cyrNum).val(cyrxm);
//         $$('#slyyQhmsThirdCLLX' + cyrNum).val(cllx);
        /* $$('#slyyQhmsThirdCPH' + cyrNum).val(cph);*/
         $$('#slyyQhmsThirdSJH' + cyrNum).val(lxdh);
         $$('#slyyQhmsThirdSFZH' + cyrNum).val(sfzh);
         //关闭侧滑栏
         myApp.closePanel();
     }
          // ------------------------------------------车船号----------------------------------
          //打开车船号搜索栏
           var clNum='1';
          function openClSelect(i){
             clNum=i;
             var searchPanel= cmApi.router.loadHtml(LOAD_CONTENT_PREFIX + '/html/slyyQhms/clSearchPanel.html');
             $$("#commPanelSearch").html(searchPanel);
              myApp.openPanel('right');
             $$('#panelTitle').html('车船号');
             initClxx();
          }
          //农户
          function openClSelectForNh(i){
            clNum=i;
            var searchPanel= cmApi.router.loadHtml(LOAD_CONTENT_PREFIX + '/html/slyyQhms/clSearchPanel.html');
            $$("#commPanelSearch").html(searchPanel);
            myApp.openPanel('right');
            $$('#panelTitle').html('车船号');
            initClxxForNh();
          }
          //初始化车辆信息
          function initClxxForNh(){
            var userId = cmApi.userInfo.getUserId();
            var params = {'userId':userId};
            cmApi.request.httpPostAsync('service/nhyy/getClxxByUserId',params,'slyyQhmsModule.getClxxCallbackForNh');
          }
           //获取车辆信息回调函数
          function getClxxCallbackForNh(jsonObj){
            if (!jsonObj || jsonObj.totalRows=='0') {
                cmApi.prompt.toast("相关数据为空!");
                return false;
            }
            if(jsonObj.retCode == '1'){
               var json = jsonObj.data;
               slyyQhmsModule.slyyQhmsClxx = json;
               var htmlStr = '';
                $$('#clList').html('');
                $$.each(json,function(i){
                    var nm = json[i].nm;//承运人内码
                    var cph = json[i].cph;//承运人车牌号
                    if(cph==null||cph==""){
                       htmlStr += '<li class="item-link item-content">'
                        +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectClForNh(\''+i+'\')">'
                        +'  	<div class="item-title title"><div class="item-title title" style="width:65%;float:left;" >'+cph+'</div>'
                        +'		<div class="item-media" style="width:35%;float: right;"></div></div>'
                        +'		<div class="item-subtitle">'
                        +'			<div class="span-item">'
                        +'				<span>'+cph+'</span>'
                        +' 			</div>'
                        +' 		</div>'
                        +'	</div>'
                        +'</li>';
                    }else{
                       htmlStr += '<li class="item-link item-content">'
                        +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectClForNh(\''+i+'\')">'
                        +'  	<div class="item-title title"><div class="item-title title" style="width:65%;float:left;" >'+cph+'</div>'
                        +'		<div class="item-media" style="width:35%;float: right;"></div></div>'
                        +'		<div class="item-subtitle">'
                        +'			<div class="span-item">'
                        +'				<span>'+cph+'</span>'
                        +' 			</div>'
                        +' 		</div>'
                        +'	</div>'
                        +'</li>';
                    }
                });
                $$('#clList').html(htmlStr);
                //实例化搜索
                var mySearchbar = myApp.searchbar('.searchbar', {
                searchList: '.list-block-search',
                searchIn: '.item-title,.item-subtitle'
                });
            }else{
               cmApi.prompt.toast('获取车辆信息失败');
            }
          }
          //选择通知单编号之后给页面赋值
          function selectClForNh(i){
            //承运人信息
            var json = slyyQhmsModule.slyyQhmsClxx[i];
            var nm = json.nm//内码
            var cph = json.cph;//车牌号
            $$('#slyyQhmsThirdCLNM' + clNum).val(nm);
            $$('#slyyQhmsCph_slyy' + clNum).val(cph);
            //关闭侧滑栏
            myApp.closePanel();
          }
          //初始化车辆信息
          function initClxx(){
              var userId = cmApi.userInfo.getUserId();
              var params = {'userId':userId};
              cmApi.request.httpPostAsync('service/nhyy/getClxxByUserId',params,'slyyQhmsModule.getClxxCallback');
          }
          //获取车辆信息回调函数
          function getClxxCallback(jsonObj){
              if (!jsonObj || jsonObj.totalRows=='0') {
                  cmApi.prompt.toast("相关数据为空!");
                  return false;
              }
              if(jsonObj.retCode == '1'){
                 var json = jsonObj.data;
                 slyyQhmsModule.slyyQhmsClxx = json;
                 var htmlStr = '';
                  $$('#clList').html('');
                  $$.each(json,function(i){
                      var nm = json[i].nm;//承运人内码
                      var cph = json[i].cph;//承运人车牌号
                      if(cph==null||cph==""){
                         htmlStr += '<li class="item-link item-content">'
                          +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectCl(\''+i+'\')">'
                          +'  	<div class="item-title title"><div class="item-title title" style="width:65%;float:left;" >'+cph+'</div>'
                          +'		<div class="item-media" style="width:35%;float: right;"></div></div>'
                          +'		<div class="item-subtitle">'
                          +'			<div class="span-item">'
                          +'				<span>'+cph+'</span>'
                          +' 			</div>'
                          +' 		</div>'
                          +'	</div>'
                          +'</li>';
                      }else{
                         htmlStr += '<li class="item-link item-content">'
                          +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectCl(\''+i+'\')">'
                          +'  	<div class="item-title title"><div class="item-title title" style="width:65%;float:left;" >'+cph+'</div>'
                          +'		<div class="item-media" style="width:35%;float: right;"></div></div>'
                          +'		<div class="item-subtitle">'
                          +'			<div class="span-item">'
                          +'				<span>'+cph+'</span>'
                          +' 			</div>'
                          +' 		</div>'
                          +'	</div>'
                          +'</li>';
                      }
                  });
                  $$('#clList').html(htmlStr);
                  //实例化搜索
                  var mySearchbar = myApp.searchbar('.searchbar', {
                  searchList: '.list-block-search',
                  searchIn: '.item-title,.item-subtitle'
                  });
                  ////////////////////////////////////////////////

                  slyyQhmsModule.selectCl('0');
                  slyyQhmsModule.slyyVerifyCodeCheckSubmit();

                  ///////////////////////////////////////////
              }else{
                 cmApi.prompt.toast('获取车辆信息失败');
              }
          }
          //选择通知单编号之后给页面赋值
          function selectCl(i){
              //承运人信息
              var json = slyyQhmsModule.slyyQhmsClxx[i];
              var nm = json.nm//内码
              var cph = json.cph;//车牌号
              $$('#slyyQhmsThirdCLNM' + clNum).val(nm);
              $$('#slyyQhmsThirdCPH' + clNum).val(cph);
              //////////////////////////////////////////////////
              $$('#slyyQhmsThirdSL').val(json.clzz);
              $$('#slyyQhmsThirdCLLX0').val(json.cclx);
              $$('#slyyQhmsThirdCLLXId0').val(json.cclx);
              /////////////////////////////////////////////////
              //关闭侧滑栏
              myApp.closePanel();
          }
    // ---------------------------------------------------------通知单编号--------------------------------------
    //打开通知单搜索栏
    function openTzdSelect(){
        var lspzmc = $$('#lspzmc').val();
        if (lspzmc == '') {
            cmApi.prompt.toast('请选择粮食品种！');
            return;
        }
        var searchPanel= cmApi.router.loadHtml(LOAD_CONTENT_PREFIX + '/html/slyyQhms/tzdSearchPanel.html');
        $$("#commPanelSearch").html(searchPanel);
        myApp.openPanel('right');
        $$('#panelTitle').html('通知单信息');
        initTzdxx();
    }
    //初始化通知单信息
    function initTzdxx(){
        var params = {'zzmc':zzmc,'zznm':zznm,'lspz':lspz,'qymc':cmApi.userInfo.getZzmc(),'xydm':cmApi.userInfo.getZznm()};
        cmApi.request.httpPostAsync('service/nhyy/getTzdxx',params,'slyyQhmsModule.getTzdxxCallback');
    }
    //获取通知单回调函数
    function getTzdxxCallback(jsonObj){
        if (!jsonObj || jsonObj.data=="") {
             cmApi.prompt.toast("未查询到通知单信息!");
            return false;
        }
        if(jsonObj.retCode == '1'){
           var json = jsonObj.data;
           slyyQhmsModule.slyyQhmsTzdxx = json;
           var htmlStr = '';
           $$('#tzdList').html("");
            $$.each(json,function(i){
                var tzdbh = json[i].tzdbh;//通知单编号
                var ywrq = json[i].ywrq;//业务日期
                var pzmc = json[i].pzmc;//品种
                var djmc = json[i].djmc;//等级
                var tzdsl = json[i].tzdsl;//开具数量
                var tzdsysl = json[i].tzdsysl;//剩余数量
                htmlStr += '<li class="item-link item-content">'
                        +'	<div class="item-inner item-inner-paddingleft" style="width: 100%;min-height:10%" onclick="slyyQhmsModule.selectTzd(\''+i+'\')">'
                        +'  	<div class="item-title title"><div class="item-title title" style="width:100%;float:left;" >'+tzdbh+'</div>'
                        +'		</div>'
                        +'		<div class="item-subtitle">'
                        +'			<div style="width:50%;float:left;">'
                        +'				<span>'+pzmc+'</span>'
                        +' 			</div>'
                        +'			<div style="width:50%;float:right;">'
                        +'				<span>'+djmc+'</span>'
                        +' 			</div>'
                        +' 		</div>'
                        +'		<div class="item-subtitle">'
                        +'			<div >'
                        +'				<span>剩余数量：'+tzdsysl+'公斤</span>'
                        +' 			</div>'
                        +' 		</div>'
                        +'		<div class="item-subtitle">'
                        +'			<div >'
                        +'				<span>开具数量：'+tzdsl+'公斤</span>'
                        +' 			</div>'
                        +' 		</div>'
                        +'	</div>'
                        +'</li>';
            });
            $$('#tzdList').html(htmlStr);
            //实例化搜索
            var mySearchbar = myApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-title,.item-subtitle'
            });
        }else{
           cmApi.prompt.toast('获取通知单信息失败');
        }
    }
    //选择通知单信息之后给页面赋值
    function selectTzd(i){
        //通知单信息
        //通知单编号
        var tzdbh =  slyyQhmsModule.slyyQhmsTzdxx[i].tzdbh;
        $$('#tzdbh').val(tzdbh);
        //关闭侧滑栏
        myApp.closePanel();
    }
        //打开装粮地点搜索栏
        function openZlddSelect(){
            var mapPanel= cmApi.router.loadHtml(LOAD_CONTENT_PREFIX + '/html/slyyQhms/mapSearchPanel.html');
            $$("#commPanelSearch").html(mapPanel);
            myApp.openPanel('right');
            $$(".panel").addClass("zlddd");
            $$('#panelTitle').html('装粮地点信息');
            initZldd();
        }
      //初始化装粮信息
        function initZldd(){
         this.slyyQhmsHomeRQ_punchin = slyyQhmsModule.slyyQhmsHomeRQ;
         punchInModule.initZlddIn(slyyQhmsModule.slyyQhmsJsonObj);
        }

    function toGdlk(){
        if (isSfyk()) {
            cmApi.router.turnToPage('gdlk',ywlx);
        }
    }
      //检查验证码频率
       function checkFrequency(){
        //需要进行验证
        if(captchaVerification){
           //主动触发点击事件
             document.getElementById('btnForVerification').onclick();
        }else{
             httpPostAsync('service/behaviorVerification/checkFrequency', {phone:cmApi.getStringSession("username")},"slyyQhmsModule.checkFrequencyCallback");
        }
       }
     function checkFrequencyCallback(jsonObj){
             if (!jsonObj) {
                 cmApi.prompt.toast('会话失效，请重新登录！');
                 cmApi.setStringSession("username", "");
                  cmApi.setStringSession("password", "");
                 cmApi.router.turnToPage('login');;
                return;
            }
            //app检查更新回调函数
            if (jsonObj.data.retCode == '0'|| jsonObj.data.msg) {
                cmApi.prompt.toast(jsonObj.data.msg);
                return
            }
             //行为验证码开启 并需要验证
             if(jsonObj.data.behaviorVerificationZt == '1' && jsonObj.data.behaviorVerificationIsCheck == '1'){
                       //主动触发点击事件
                       document.getElementById('btnForVerification').onclick();
             }else{
                   //slyyQhmsTimeChangeTriggerFunQueryData();
                   timeChangeToSearch();
                  //清空密钥
                  captchaVerification = "";
             }
     }

      //初始化行为验证码
      // container 行为验证码显示div元素
      // buttonId  触发按钮
      // callback  回调函数
       function initXwyzm(container,buttonId){
          $$("#"+container).html("");
                  var opts = {
                         container: container,
                         buttonId: buttonId,
                         callback:function(data){
                              if(data.result){
                                     captchaVerification = data.data.captchaVerification;
                                    //设置密钥
                                    slyyQhmsTimeChangeTriggerFunQueryData();
                               }else{
                                     myApp.alert("验证失败");
                               }
                         }
                    };
                cmApi.ui.captcha(opts);
          }

     //检查验证码频率
    function checkFrequencyForSubmitYy(){
          httpPostAsync('service/behaviorVerification/checkFrequency', {phone:cmApi.getStringSession("username")},"slyyQhmsModule.checkFrequencyForSubmitYyCallback");
    }

     function checkFrequencyForSubmitYyCallback(jsonObj){
             if (!jsonObj) {
                 cmApi.prompt.toast('会话失效，请重新登录！');
                 cmApi.setStringSession("username", "");
                  cmApi.setStringSession("password", "");
                 cmApi.router.turnToPage('login');
                return;
            }
            //行为验证码检查有误
            if (jsonObj.data.retCode == '0'|| jsonObj.data.msg) {
                cmApi.prompt.toast(jsonObj.data.msg);
                return
            }
             //行为验证码开启 并需要验证
             if(jsonObj.data.behaviorVerificationZt == '1' && jsonObj.data.behaviorVerificationIsCheck == '1'){
                       //主动触发点击事件
                       document.getElementById('tjyysq').onclick();
             }else{
                   yysqParams =  secretYysqParams(yysqParams);
                   var str = JSON.stringify(yysqParams);
                   sessionStorage.setItem('yysqParams',JSON.stringify(yysqParams));
                   httpPostAsync('service/nhyy/reserve', yysqParams, 'slyyQhmsModule.slyyQhmsSubmitCallback');;
                  //清空密钥
                  captchaVerification = "";
             }
        }


         function secretYysqParams(params){
            var encrypt = new JSEncrypt();
             encrypt.setPublicKey(pubKey);
             var str = params.phone+"i"+params.pznm+"n"+params.pzmxnm+"s"+params.sfz+"p"+params.rq+"u"+params.cphStr+"r"+params.zznm
                     + params.uuid + params.dxyzm + params.yyfsnm + params.yyfsmc;
             params.secretData = encrypt.encrypt(str);
             return params;
       }
      var  publicKey='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApk08YJ+71NyV/M6IN23woPlYG8urnp5Mj1cK2QSIXBmU75qnEB2skSDH3Sz9KvShsKbhEMnckxV9TWIt9kY55fwEtaCiVxmkAoCv+47xu4iNZoO6s4WaP3MbEmEVB0Oxs+YRPxEzzvTP3eXIe6+nf480derjQGRq/6lacsmAZX6N6zzZ5jb+uZYrwJ7f+iPh0CP2qSJBlphPXNCsjLjl3psYsGUxdP3c9KSDQVYl6RYkHDk74PyBDjilUDB++Ftx35jvlFjSw+6tXuZnw3L88FlYgLQzEvPKO07Yx/zyRMXGJADCTP0mmm4uOe/HtrUlfpLNarCBI1t26w+xIxGkQQIDAQAB';

          var pubKey="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0uFFjWtTp+La/vi/MqlnuoMpHYR8QNVSuaV0WA0eYei+FnWt9e+pCYfocL8/tMQA4vWxCM9ZcffsgknC1H7hbKEnIAGrG+FOCTzzlWUbm9N7XdVUuyD5hrjr79rN64lwKR5SY0msogBdCf5Nlt4QX1A5klVnDU7NfCyBNmIo6G2tWWCsEEL7mp4PyEjD0LXmx8uBVboexkmIBV/eFTNdIduCKsCp43SCpyu8yfZ6aaSLlHP5Pj3cyC5IzTqBBeiSu/JyXoE9X4D6rxnzc+Ge/stpzXV9Qe9ZC85TsxfmDkERB61rYbrOq7dnw8aAGtkwaGvdqjAPLGK1dGileBOy1QIDAQAB";
       /* function secretYysqParams(params){
            var encrypt = new JSEncrypt();
             encrypt.setPublicKey(publicKey);
             var str = params.phone+"i"+params.pznm+"n"+params.pzmxnm+"s"+params.sfz+"p"+params.rq+"u"+params.cphStr+"r"+params.zznm
                     + params.uuid + params.dxyzm + params.yyfsnm + params.yyfsmc;
             params.secretData = encrypt.encrypt(str);
             return params;
       }
      var  publicKey='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApk08YJ+71NyV/M6IN23woPlYG8urnp5Mj1cK2QSIXBmU75qnEB2skSDH3Sz9KvShsKbhEMnckxV9TWIt9kY55fwEtaCiVxmkAoCv+47xu4iNZoO6s4WaP3MbEmEVB0Oxs+YRPxEzzvTP3eXIe6+nf480derjQGRq/6lacsmAZX6N6zzZ5jb+uZYrwJ7f+iPh0CP2qSJBlphPXNCsjLjl3psYsGUxdP3c9KSDQVYl6RYkHDk74PyBDjilUDB++Ftx35jvlFjSw+6tXuZnw3L88FlYgLQzEvPKO07Yx/zyRMXGJADCTP0mmm4uOe/HtrUlfpLNarCBI1t26w+xIxGkQQIDAQAB';
 */
     //初始化图形验证码
        function initXwyzmForYySubmit(){
                   var opts = {
                          container: 'yyTjxwyzm',
                          buttonId: 'tjyysq',
                          callback:function(data){
                              if(data.result){
                                  yysqParams.captchaVerification = data.data.captchaVerification;
                                  ysqParams =  secretYysqParams(yysqParams);
                                  var str = JSON.stringify(yysqParams);
                                  sessionStorage.setItem('yysqParams',JSON.stringify(yysqParams));
                                  httpPostAsync('service/nhyy/reserve', JSON.stringify(yysqParams), 'slyyQhmsModule.slyyQhmsSubmitCallback');
                              }else{
                                 $$('#subBtnQh').removeAttr('disabled');
                                 myApp.alert("验证失败");

                              }
                          }
                     };
                 cmApi.ui.captcha(opts);
           }
   //获取服务器url
       function getIpBysystemType() {
           var systemType = cmApi.device.getType();
           if (systemType == "ios") {
               return 'https://' + cmApi.getIp() + '/' + cmApi.getAppServer() + '/';
           } else if (systemType == "android") {
               return cmApi.getIp();
           } else {
               systemType ="weixin";
               wxdlFlag = true;
               return cmApi.backServerUrl;
           }
       }
//点击发送短信
    function sendSMS() {
        const imgCaptchaCode = $$('#slyyThirdYzmCaptchaInput').val();
        if (!imgCaptchaCode || imgCaptchaCode === '') {
          cmApi.prompt.toast('请输入图形验证码计算结果');
          refreshCaptcha();
          return;
        }
        cmApi.request.httpPostAsyncNoLoading('service/nhyy/captchaMath?option=chkCode&code=' + imgCaptchaCode,
                      {}, 'slyyQhmsModule.beforeSendSMSImageCaptchaCallback');
    }

    function beforeSendSMSImageCaptchaCallback(jsonObj) {
        if (!jsonObj || "" == jsonObj) {
            cmApi.prompt.toast('网络异常，请检查您的网络连接');
            refreshCaptcha();
            return;
        }
        if (jsonObj.retCode == '0') {
           cmApi.prompt.toast('系统异常，请联系客服');
           refreshCaptcha();
           return;
        }
        if (jsonObj.data.retCode !== '1') {
           cmApi.prompt.toast(jsonObj.data.msg);
           refreshCaptcha();
           return;
        }
        slyyThirdImageCaptchaVerifyUUID = jsonObj.data.uuid;
        var phoneNum =  cmApi.userInfo.getUserId();
        var params = {phoneNum:phoneNum,zznm:slyyQhmsModule.slyyQhmsJsonObj[slyyQhmsJsonObjDataNum].zznm,uuid:slyyThirdImageCaptchaVerifyUUID};
        cmApi.request.httpPostAsyncNoLoading('service/smscheck/sendSMSCode', params, 'slyyQhmsModule.sendSMSCallback');
    }

     function sendSMSCallback(jsonObj) {
         if (!jsonObj || "" == jsonObj) {
                     cmApi.prompt.toast('网络异常，请检查您的网络连接');
                     refreshCaptcha();
                     return;
         }
         if (jsonObj.retCode == '0') {
                    cmApi.prompt.toast('系统异常，请联系客服');
                    refreshCaptcha();
                    return;
         }
         var resultCode = jsonObj.data.resultCode;
         if (resultCode != '1') {
             cmApi.prompt.toast(jsonObj.data.msg);
             refreshCaptcha();
         }  else if (resultCode == '1') {
            sendFlagYy = true; //成功发送了验证码
            initLoginSMSValidateCode();
         }
     }

         //初始化方法
     function initLoginSMSValidateCode() {
               //如果倒计时开着，就关掉倒计时
               if (loginSMSVcode_intervalProcessYy != '') {
                   clearInterval(loginSMSVcode_intervalProcessYy);
               }
               loginSMSVcode_DjsAmountYy = 180;
               $$('#slyyThirdYzmSendBtn').removeAttr('disabled');
               $$('#slyyThirdYzmSendBtn').css('background-color', '#cccccc');
               //重发短信验证码倒计时
               loginSMSVcode_intervalProcessYy = setInterval(loginSMSVcode_djsFun, 1000);
               //验证短信验证码错误次数
               loginSMSVcode_validateSMSCodeErrorSizeYy = 0;
     }

    //重发短信验证码倒计时
    function loginSMSVcode_djsFun() {
        loginSMSVcode_DjsAmountYy--;
        if (loginSMSVcode_DjsAmountYy > 0) {
            $$("#slyyThirdYzmSendBtn").text(loginSMSVcode_DjsAmountYy + "秒");
        } else {
            $$('#slyyThirdYzmSendBtn').removeAttr('disabled');
            $$('#slyyThirdYzmSendBtn').text("发送验证码");
            $$('#slyyThirdYzmSendBtn').css('background-color', '#4CAF50');
            clearInterval(loginSMSVcode_intervalProcessYy);
            loginSMSVcode_DjsAmountYy = 180;
        }
    }
        //点击距离查询
        function jlcx(){
            if($$("#jlcxItem").css("display")=='none'){
                $$("#jlcxItem").css("display","");
                $$("#jlcxImg").attr("src","../../image/xiaSJ.png");
                $$("#jlcxDiv").css("color","#79cb6b");
            }else{
                $$("#jlcxItem").css("display","none");
                $$("#jlcxImg").attr("src","../../image/shangSJ.png");
                $$("#jlcxDiv").css("color","");
            }
//    	    if( $$("#jlcxItem").css("display")=='none'){
//    	    	$$("#slyyQhmsHomePageContentDiv").css("height","77%");
//    	    }else{
//    	    	$$("#slyyQhmsHomePageContentDiv").css("height","63%");
//    	    }
        }
         //设置距离查询枚举----1:50km,2:100km,3:150km,4:200km
            function setJlcx(num){
            	if(num=='1'){
            	jlmj = 50*1000;
            	}else if(num=='2'){
            	jlmj = 100*1000;
            	} else if(num=='3'){
            	jlmj = 150*1000;
            	} else if(num=='4'){
            	jlmj = 200*1000;
            	}
            	setJlcxSelectedStyle(num);

            	querySlyyQhmsDateList();
            }
            //设置距离样式
            function setJlcxSelectedStyle(num){
            	if(num=='1'){//50km
            		$$("#jlcxId1").attr("style","border:1px solid #46c58e;color:#46c58e;background:#f0f0f0");
            		$$("#jlcxId2").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
            		$$("#jlcxId3").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
            		$$("#jlcxId4").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
            		$$("#jlcxSpanId").html("距离查询:50km");
            	}else if(num=='2'){//100km
            		$$("#jlcxId1").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxId2").attr("style","border:1px solid #46c58e;color:#46c58e;;background:#f0f0f0");
                    $$("#jlcxId3").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxId4").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxSpanId").html("距离查询:100km");
            	}else if(num=='3'){//150km
            	    $$("#jlcxId1").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxId2").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
            		$$("#jlcxId3").attr("style","border:1px solid #46c58e;color:#46c58e;background:#f0f0f0");
                    $$("#jlcxId4").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxSpanId").html("距离查询:150km");
            	}else if(num=='4'){//200km
            		$$("#jlcxId1").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                       $$("#jlcxId2").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxId3").attr("style","border:1px solid #f0f0f0;color:#404040;background:#f0f0f0");
                    $$("#jlcxId4").attr("style","border:1px solid #46c58e;color:#46c58e;background:#f0f0f0");
                    $$("#jlcxSpanId").html("距离查询:200km");
            	}
            }
      function qd() {
         $$('#slyygg_ggdiv').hide();
      }

     function qx() {
         //mainView.router.back();
	goBackAndEnableDiv();
     }

    function backQhmsHome() {
//         clearPriceSearchValue();
         mainView.router.back();
         selectedVariety = "";
     }
     function initSelectedVariety() {
        $$('#slyyGhmxVarietySearch').click(function() {
            if (!varietySearchAreaShow) {
                $$(this).addClass('slyy-qhmx-active');
                $$('#slyy-qhmx-price-mask').css('display', 'block');
                $$('#slyyQhmxVarietyDropdown').css('display', 'block');
                selectedMaskType = 1;
                varietySearchAreaShow = true;
                if (priceSearchAreaShow) {
                     $$('#slyyGhmxPriceSearch').removeClass('slyy-qhmx-active');
                     $$('#slyy-qhmx-price-dropdown').css('display', 'none');
                     priceSearchAreaShow = false;
                }
                if (distanceSearchAreaShow) {
                    $$('#slyyGhmxDistanceSearch').removeClass('slyy-qhmx-active');
                    $$('#slyyQhmxDistanceDropdown').css('display', 'none');
                    distanceSearchAreaShow = false;
                }
            } else {
                $$(this).removeClass('slyy-qhmx-active');
                $$('#slyy-qhmx-price-mask').css('display', 'none');
                $$('#slyyQhmxVarietyDropdown').css('display', 'none');
                selectedMaskType = 0;
                varietySearchAreaShow = false;
            }

        });
     }

     function selectedVarietyButton(pznm, pzmc) {
        selectedVariety = pznm;
        $$('#slyyGhmxVarietySearch').removeClass('slyy-qhmx-active');
        $$('#slyy-qhmx-price-mask').css('display', 'none');
        $$('#slyyQhmxVarietyDropdown').css('display', 'none');
        $$('#slyyQhmxVarietyText').html(pzmc);
        selectedMaskType = 0;
        varietySearchAreaShow = false;
        slyyQhmsTimeChangeTriggerFunQueryData();
     }

     function initSelectedDistance() {
        $$('#slyyGhmxDistanceSearch').click(function() {
            if (!distanceSearchAreaShow) {
                $$(this).addClass('slyy-qhmx-active');
                $$('#slyy-qhmx-price-mask').css('display', 'block');
                $$('#slyyQhmxDistanceDropdown').css('display', 'block');
                selectedMaskType = 3;
                distanceSearchAreaShow = true;
                if (priceSearchAreaShow) {
                    $$('#slyyGhmxPriceSearch').removeClass('slyy-qhmx-active');
                    $$('#slyy-qhmx-price-dropdown').css('display', 'none');
                    priceSearchAreaShow = false;
                }
                if (varietySearchAreaShow) {
                    $$('#slyyGhmxVarietySearch').removeClass('slyy-qhmx-active');
                    $$('#slyyQhmxVarietyDropdown').css('display', 'none');
                    varietySearchAreaShow = false;
                }
            } else {
                 $$('#slyy-qhmx-price-mask').css('display', 'none');
                 selectedMaskType = 0;
                 $$('#slyyGhmxDistanceSearch').removeClass('slyy-qhmx-active');
                 $$('#slyyQhmxDistanceDropdown').css('display', 'none');
                 distanceSearchAreaShow = false;
            }

        });
     }

     function selectedDistanceButton(curDistance) {
        let distanceText = (curDistance / 1000) + 'Km';
        selectedDistance = curDistance;
        distanceSearchAreaShow = false;
        $$('#slyy-qhmx-price-mask').css('display', 'none');
        selectedMaskType = 0;
        $$('#slyyGhmxDistanceSearch').removeClass('slyy-qhmx-active');
        $$('#slyyQhmxDistanceDropdown').css('display', 'none');
        $$('#slyyQhmxDistanceText').html(distanceText);
        slyyQhmsTimeChangeTriggerFunQueryData();
     }

     function closeSelectedMaskLayer() {
        if (selectedMaskType == 1) {
           $$('#slyyGhmxVarietySearch').removeClass('slyy-qhmx-active');
           $$('#slyyQhmxVarietyDropdown').css('display', 'none');
           varietySearchAreaShow = false;
        } else if (selectedMaskType == 2) {
           $$('#slyyGhmxPriceSearch').removeClass('slyy-qhmx-active');
           $$('#slyy-qhmx-price-dropdown').css('display', 'none');
           priceSearchAreaShow = !priceSearchAreaShow;
        } else if (selectedMaskType == 3) {
           $$('#slyyGhmxDistanceSearch').removeClass('slyy-qhmx-active');
           $$('#slyyQhmxDistanceDropdown').css('display', 'none');
           distanceSearchAreaShow = false;
        }
        $$('#slyy-qhmx-price-mask').css('display', 'none');
        selectedMaskType = 0;
     }

     function changePriceSearchArea() {
        if (!priceSearchAreaShow) {
            $$('#slyyGhmxPriceSearch').addClass('slyy-qhmx-active');
            $$('#slyy-qhmx-price-mask').css('display', 'block');
            selectedMaskType = 2;
            $$('#slyy-qhmx-price-dropdown').css('display', 'block');
            priceSearchLeftThumb = document.getElementById('priceSearchLeftThumb');
            priceSearchRightThumb = document.getElementById('priceSearchRightThumb');
            priceSearchLeftThumb.addEventListener('mousedown', handleDragStart(priceSearchLeftThumb));
            priceSearchLeftThumb.addEventListener('touchstart', handleDragStart(priceSearchLeftThumb));
            priceSearchRightThumb.addEventListener('mousedown', handleDragStart(priceSearchRightThumb));
            priceSearchRightThumb.addEventListener('touchstart', handleDragStart(priceSearchRightThumb));
            priceSearchAreaShow = !priceSearchAreaShow;
            if (varietySearchAreaShow) {
               $$('#slyyGhmxVarietySearch').removeClass('slyy-qhmx-active');
               $$('#slyyQhmxVarietyDropdown').css('display', 'none');
               varietySearchAreaShow = false;
            }
            if (distanceSearchAreaShow) {
               $$('#slyyGhmxDistanceSearch').removeClass('slyy-qhmx-active');
               $$('#slyyQhmxDistanceDropdown').css('display', 'none');
               distanceSearchAreaShow = false;
            }
        } else  {
            $$('#slyyGhmxPriceSearch').removeClass('slyy-qhmx-active');
            $$('#slyy-qhmx-price-mask').css('display', 'none');
            $$('#slyy-qhmx-price-dropdown').css('display', 'none');
            priceSearchAreaShow = !priceSearchAreaShow;
            selectedMaskType = 0;
        }
     }

     function completePriceSearch() {
        $$('#slyyGhmxPriceSearch').removeClass('slyy-qhmx-active');
        $$('#slyy-qhmx-price-mask').css('display', 'none');
        $$('#slyy-qhmx-price-dropdown').css('display', 'none');
        selectedMaskType = 0;
        priceSearchAreaShow = false;
        slyyQhmsTimeChangeTriggerFunQueryData();
     }

     // 滑块拖动逻辑
     function getPositionX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
     }

     function handleDragStart(thumb) {
        return function(e) {
           priceSearchIsDragging = true;
           priceSearchCurrentThumb = thumb;
           document.addEventListener('touchmove', handleDrag);
           document.addEventListener('touchend', handleDragEnd);
        };
     }

     function handleDrag(e) {
        if (!priceSearchIsDragging) return;

        let progressRect = document.querySelector('.progress-track').getBoundingClientRect();
        let x = getPositionX(e) - progressRect.left;
        x = Math.max(0, Math.min(x, progressRect.width));
        let percent = (x / progressRect.width) * 100;

        if (priceSearchCurrentThumb === priceSearchLeftThumb) {
           let rightPercent = parseFloat(priceSearchRightThumb.style.left || 100);
           if (percent >= rightPercent) return;
               priceSearchLeftThumb.style.left = `${percent}%`;
               priceSearchMinValue = Math.round((percent / 100) * priceSearchMaxRange);
               $$('#priceSearchMinPrice').html((priceSearchMinValue/100).toFixed(2));
           } else {
               let leftPercent = parseFloat(priceSearchLeftThumb.style.left || 0);
               if (percent <= leftPercent) return;
               priceSearchRightThumb.style.left = `${percent}%`;
               priceSearchMaxValue = Math.round((percent / 100) * priceSearchMaxRange);
               $$('#priceSearchMaxPrice').html((priceSearchMaxValue/100).toFixed(2));
           }

           updateProgressFill();
     }

     function handleDragEnd() {
        priceSearchIsDragging = false;
        priceSearchCurrentThumb = null;
//        document.removeEventListener('mousemove', handleDrag);
//        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', handleDragEnd);
     }

      function updateProgressFill() {
         let left = parseFloat(priceSearchLeftThumb.style.left || 0);
         let right = parseFloat(priceSearchRightThumb.style.left || 100);
         $$('#priceSearchProgressFill').css({
            left: left + '%',
            right: (100 - right) + "%"
         });
      }

      function clearPriceSearchValue() {
        priceSearchLeftThumb.style.left = '0%';
        priceSearchRightThumb.style.left = '100%';
        priceSearchMinValue = 0;
        priceSearchMaxValue = 1000;
        $$('#priceSearchMinPrice').html((priceSearchMinValue/100).toFixed(2));
        $$('#priceSearchMaxPrice').html((priceSearchMaxValue/100).toFixed(2));
        updateProgressFill();
      }
      function back(){
        if (loginSMSVcode_intervalProcessYy != '') {
           clearInterval(loginSMSVcode_intervalProcessYy);
        }
        $$('#slyyThirdYzmDiv').css('display', 'none');
        $$('#slyyThirdYzmSendBtn').removeAttr('disabled');
        $$('#slyyThirdYzmSendBtn').text("发送验证码");
        $$('#slyyThirdYzmSendBtn').css('background-color', '#4CAF50');
        loginSMSVcode_DjsAmountYy = 180;
        setTimeout(function () {
           enableDivsByClass('slyy-qhmx-reserve-area',true); // 调用你的 disableDiv 方法
        }, 100);
        mainView.router.back();
        $$('.navbar').css('background-color',"rgba(0,0,0,0)")
      }
function enableDivsByClass(className, enabled) {
  const divs = document.querySelectorAll(`div.${className}`);
  if (divs.length === 0) {
    console.warn(`未找到 class 为 "${className}" 的元素`);
    return;
  }

  divs.forEach(div => {
    if (enabled) {
      // 启用状态：允许点击，恢复正常样式
      div.style.pointerEvents = 'auto';
      div.style.cursor = 'pointer';
    } else {
      // 禁用状态：禁止点击，应用禁用样式
      div.style.pointerEvents = 'none';
      div.style.cursor = 'not-allowed';
    }
  });
}

    function refreshCaptcha() {
        const curBackServerUrl = getIpBysystemType();
        $$('#slyyThirdYzmdivCaptchaImg').attr('src', curBackServerUrl + "service/nhyy/captchaMath?option=image&t=" + new Date().getTime());
    }

    function yzmDivCancel() {
        if (loginSMSVcode_intervalProcessYy != '') {
           clearInterval(loginSMSVcode_intervalProcessYy);
        }
        $$('#slyyThirdYzmSendBtn').removeAttr('disabled');
        $$('#slyyThirdYzmSendBtn').text("发送验证码");
        $$('#slyyThirdYzmSendBtn').css('background-color', '#4CAF50');
        $$('#slyyThirdYzmDiv').css('display', 'none');
        loginSMSVcode_DjsAmountYy = 180;
    }

    function yzmDivYes() {
        const curDxyzm = $$("#slyyThirdYzmPhoneInput").val();
        if (slyyThirdStorageMessageVerify && (!curDxyzm || curDxyzm === '')) {
            cmApi.prompt.toast('请输入短信验证码');
            return;
        }

        if (!slyyThirdStorageMessageVerify) {
            const imgCaptchaCode = $$('#slyyThirdYzmCaptchaInput').val();
            if (!imgCaptchaCode || imgCaptchaCode === '') {
                cmApi.prompt.toast('请输入图形验证码计算结果');
                refreshCaptcha();
                return;
            }
            cmApi.request.httpPostAsyncNoLoading('service/nhyy/captchaMath?option=chkCode&code=' + imgCaptchaCode,
                                          {}, 'slyyQhmsModule.slyyThirdSubmitImageCaptchaCallback');
        } else {
                   loginSMSVcode_DjsAmountYy = 180;
                   if (loginSMSVcode_intervalProcessYy != '') {
                      clearInterval(loginSMSVcode_intervalProcessYy);
                   }
           $$('#slyyThirdYzmDiv').css('display', 'none');
           $$('#slyyThirdYzmSendBtn').removeAttr('disabled');
           $$('#slyyThirdYzmSendBtn').text("发送验证码");
           $$('#slyyThirdYzmSendBtn').css('background-color', '#4CAF50');

           slyyQhmsSubmit();
        }
    }

    function slyyThirdSubmitImageCaptchaCallback(jsonObj) {
        if (!jsonObj || "" == jsonObj) {
            cmApi.prompt.toast('网络异常，请检查您的网络连接');
            refreshCaptcha();
            return;
        }
        if (jsonObj.retCode == '0' || !jsonObj.data) {
            cmApi.prompt.toast('系统异常，请联系客服');
            refreshCaptcha();
            return;
        }
        if (jsonObj.data.retCode !== '1') {
            cmApi.prompt.toast(jsonObj.data.msg);
            refreshCaptcha();
            return;
        }
        loginSMSVcode_DjsAmountYy = 180;
        if (loginSMSVcode_intervalProcessYy != '') {
           clearInterval(loginSMSVcode_intervalProcessYy);
        }
        $$('#slyyThirdYzmDiv').css('display', 'none');
        $$('#slyyThirdYzmSendBtn').removeAttr('disabled');
        $$('#slyyThirdYzmSendBtn').text("发送验证码");
        $$('#slyyThirdYzmSendBtn').css('background-color', '#4CAF50');

        slyyThirdImageCaptchaVerifyUUID = jsonObj.data.uuid;

        slyyQhmsSubmit();
    }

    return {
        onViewInit: onViewInit,
        slyyQhmsGeolocationCallback: slyyQhmsGeolocationCallback,
        slyyFpmsJsonObj: slyyFpmsJsonObj,
        slyyQhmsLatitude: slyyQhmsLatitude,
        slyyQhmsLongitude: slyyQhmsLongitude,
        slyyQhmsHomeRQ_punchin: slyyQhmsHomeRQ_punchin,
        querySlyyQhmsDateListCallback: querySlyyQhmsDateListCallback,
        slyyQhmsSubmitCallback: slyyQhmsSubmitCallback,
        goSlyyQhmsSecond: goSlyyQhmsSecond,
        goSlyyQhmsThird: goSlyyQhmsThird,
        todelcph: todelcph,
        subCph: subCph,
        delCphli: delCphli,
        slyyQhmsSubmit: slyyQhmsSubmit,
        checkCphCallback : checkCphCallback,
        slyyQhmsHomeChangeCalendarDate: slyyQhmsHomeChangeCalendarDate,
        slNotice: slNotice,
        continueYy: continueYy,
        yyProcess: yyProcess,
        slyyQhmsHomeRQ: slyyQhmsHomeRQ,
        slyyQhmsJsonObj: slyyQhmsJsonObj,
        pwBlur: pwBlur,
        getGrxxStaCallback: getGrxxStaCallback,
        getResvMxListCallback : getResvMxListCallback,
        getResvSjListCallback : getResvSjListCallback,
        resvRefresh : resvRefresh,
        JSRNameChangeView : JSRNameChangeView,
        getNowFormatDate : getNowFormatDate,
        openCyrSelect : openCyrSelect,
        getCyrxxCallback : getCyrxxCallback,
        selectCyr : selectCyr,
        openClSelect : openClSelect,
        getClxxCallback : getClxxCallback,
        selectCl : selectCl,
        openClSelectForNh : openClSelectForNh,
        initClxxForNh : initClxxForNh,
        getClxxCallbackForNh : getClxxCallbackForNh,
        selectClForNh : selectClForNh,
        openTzdSelect : openTzdSelect,
        getTzdxxCallback : getTzdxxCallback,
        selectTzd : selectTzd,
        openZlddSelect : openZlddSelect,
        toGdlk :toGdlk,
        checkFrequencyCallback:checkFrequencyCallback,
        checkFrequencyForSubmitYyCallback:checkFrequencyForSubmitYyCallback,
        sendSMSCallback:sendSMSCallback,
        sendSMS:sendSMS,
        jlcx:jlcx,
        qd:qd,
        qx:qx,
        setJlcx : setJlcx,
        changePriceSearchArea: changePriceSearchArea,
        completePriceSearch: completePriceSearch,
        clearPriceSearchValue: clearPriceSearchValue,
        selectedVarietyButton: selectedVarietyButton,
        closeSelectedMaskLayer: closeSelectedMaskLayer,
        selectedDistanceButton: selectedDistanceButton,
        backQhmsHome:backQhmsHome,
        back:back,
        searchKqmcBtn: searchKqmcBtn,
        nearStorageSearch: nearStorageSearch,
        distanceCheckCallback: distanceCheckCallback,
        hdmCheckCallback: hdmCheckCallback,
        goBackAndEnableDiv: goBackAndEnableDiv,
	    enableDivsByClass:enableDivsByClass,
	    yzmDivCancel: yzmDivCancel,
	    yzmDivYes: yzmDivYes,
	    beforeSendSMSImageCaptchaCallback: beforeSendSMSImageCaptchaCallback,
	    slyyVerifyCodeCheckSubmit: slyyVerifyCodeCheckSubmit,
	    slyyThirdSubmitImageCaptchaCallback: slyyThirdSubmitImageCaptchaCallback,
	    cllxSelect: cllxSelect,
	    refreshCaptcha: refreshCaptcha,
        openYyjl:openYyjl
    }
});