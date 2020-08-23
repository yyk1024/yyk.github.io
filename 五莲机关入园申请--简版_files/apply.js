/**
 * Created by wtfdjyd on 2015/12/21.
 */

$.ajaxSetup({
    cache: false
});

var age_dateObj = $("#age");
var lhsj_dataObj =$("#lhsj");
if (age_dateObj.length > 0) {
    var time = {
        elem: '#age',
        istime: true,
        format: 'YYYY-MM-DD'
    };
    laydate(time);
}
if (lhsj_dataObj.length > 0) {
    var time = {
        elem: '#lhsj',
        istime: true,
        format: 'YYYY-MM-DD'
    };
    laydate(time);
}

function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}
function checkcard(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;

    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }
    if (intStrLen == 18) {
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        intCheckDigit = parityBit[lngProduct % 11];
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}

var regCardNo = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/; //身份证号
var regTel = new RegExp('^\\d{11}$');  //手机号
var regNum = new RegExp('^[0-9]*$');  //数字




var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div style="display:inline-block; display:inline \0; *display:inline; position:relative;"></div>'));
            var pos = self.position(), h = self.outerHeight(true);
            var holder = $('<span style="position:absolute; top:0; left:0; width:auto;"></span>').text(txt).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
$(document).ready(function () {
    JPlaceHolder.init();
    function tick () {
        var max = 15;

        var interval = setInterval(function() {
            $('a.f_right').data('max', max);

            if (max == 0) {
                $('span.f_right').text(' ');
                clearInterval(interval);
                return;
            }

            $('span.f_right').html('&nbsp;' + max);
            max--;

        }, 1000);
    }

    // tick();

    function switchTab(index) {

        var nav = $('#total_ul li')[index];
        $(nav).addClass('active');
        $(nav).siblings().removeClass('active');

        var el = '#total_' + index;
        $(el).show();

        for (var i=0; i<4; i++) {
            if (i == index) {
                continue;
            }
            var el = '#total_' + i;
            $(el).hide();
        }
        if(index==3){ //兼容IE8flash上传控件加载
            fcz();
        }

    }

    $('a.f_right').click(function(e) {
        e.preventDefault();

        var max = $(this).data('max');
        var index = $(this).data('index');

        if (max > 0) {
            alert('请在' + max + '秒后进行下一步');
            return;
        }

        if (!true) {
            return;
        } else {
            var idxlayer = layer.open({
                type: 1,
                content: '<div style="padding:10px;">正在联网保存，请稍候!</div>',
                closeBtn: 0,
                title: false,
                offset: '200px',
                btn: []
            });

            setTimeout(function() {
                layer.close(idxlayer);

                // move right
                $('a.f_right').data('index', index + 1);

                switchTab(index + 1);

                // check last
                switch (index) {
                    case 0:
                        $('a.f_left').show();
                        break;
                    case 2:
                        $('a.f_right').hide();
                        return;
                }
            //点下一步需要等待15秒
            }, 20 * 1000);
        }
    });

    $('a.f_left').click(function(e) {
        e.preventDefault();

        var index = $('a.f_right').data('index');

        // move left
        $('a.f_right').data('index', index - 1);

        switchTab(index - 1);

        switch (index) {
            case 1:
                $(this).hide();
                break;

            case 3:
                $('a.f_right').show();
                break;
        }
    });

    $('#total_ul li').click(function(e) {
        e.preventDefault();
        return;

        var index = $(this).data('index');
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var el = '#total_' + index;
        $(el).show();

        for (var i=1; i<5; i++) {
            if (i == index) {
                continue;
            }

            var el = '#total_' + i;
            $(el).hide();
        }
    });

    // 验证码倒计时
    var countdown = 60;
    var times;
    function settime(val) {
        if (countdown == 0) {
            val.text("免费获取验证码");
            val.attr('isclick', 1);
            clearTimeout(times);
        } else {
            val.text("重新发送(" + countdown + ")");
            countdown--;
            val.attr('isclick', 0);
            times = setTimeout(function() {
                settime(val);
            }, 1000);
        }
    }

    //倒计时按钮
    $('#smsVerify').on('click', function(event) {
        event.preventDefault();
        if($(this).attr('isclick') == 1) {
            var smsMobile = $('#apply_infor .inpform_mobile').val();

            if (smsMobile == '') {
                alert('第一行家长手机号不能为空!');
                return false;
            }

            if (!regTel.test(smsMobile)) {
                alert('请填写成确的手机号码!');
                return false;
            }

            $.ajax({
                url: root + '/apply.do?verifycode&smsMobile=' + smsMobile,
                dataType: 'json',
                success: function(data) {
                    if (data.success) {
                        alert('验证信息已发送');
                        return;
                    }

                    if (data.error) {
                        alert(data.error);
                        return;
                    }

                    alert('网络异常');
                },
                error: function(xhr, msg, e) {
                    alert('网络异常');
                }
            });

            settime($(this));
        }
    });


    function isclear(){
        var cleartype =$('#isClear').val();
        if(cleartype==1) {
            location.reload();
        }
    }

    document.onkeydown = function() {
        if (event.keyCode == 9) {  //禁止tab键
            return false; //
        }
    };

    $('input.disablepaste').bind('paste', function (e) {
        e.preventDefault();
        alert('本页面禁止粘贴!');
        return false;
    });

    window.deleterow = function deleterow(event) {
        if (confirm('确定删除该家属信息吗?')) {
            $(this).closest('tr').remove();
        }
    };

    window.addrow = function addrow(familyFields) {

        var content = $('<tr>');

        var select = $('<select>');
        var parents = ['爸爸', '妈妈', '爷爷', '奶奶', '姥爷', '姥姥', '叔叔', '阿姨', '保姆', '其它'];
        for (var i=0; i<parents.length; i++) {
            var opt = $('<option>').attr('value', i+1).text(parents[i]);
            select.append(opt);
        }

        // 关系
        var td0 = $('<td>').append(select.attr('id', 'row_cell_0'));
        content.append(td0);
        // 姓名
        var td1 = $('<td>').append($('<input>').attr('id', 'row_cell_1'));
        content.append(td1);
        // 年龄
        if (familyFields.indexOf('nl') !== -1) {
            var td2 = $('<td>').append($('<input>').attr('id', 'row_cell_2'));
            content.append(td2);
        }
        // 学历
        if (familyFields.indexOf('xl') !== -1) {
            var select = $('<select>');
            var parents = ['博士研究生', '硕士研究生', '大学本科', '大学专科', '中等专科', '普通高中', '职业高中', '技工学校', '初中', '小学', '其它'];
            for (var i=0; i<parents.length; i++) {
                var opt = $('<option>').attr('value', i+1).text(parents[i]);
                select.append(opt);
                if (i==2) select.attr('selected', 'selected');
            }
            var td3 = $('<td>').append(select.attr('id', 'row_cell_3'));
            content.append(td3);
        }
        // 工作单位
        var td4 = $('<td>').append($('<input>').attr('id', 'row_cell_4'));
        content.append(td4);
        // 职业
        if (familyFields.indexOf('zy') !== -1) {
            var td5 = $('<td>').append($('<input>').attr('id', 'row_cell_5'));
            content.append(td5);
        }
        // 电话
        var td6 = $('<td>').append($('<input>').attr('id', 'row_cell_6'));
        content.append(td6);
        // 籍贯
        //var td7 = $('<td>').append($('<input>').attr('id', 'row_cell_7'));
        //content.append(td7);
        // 是否幼儿的直接监护人
        var td7 = $('<td>').append($('<input>').attr('id', 'row_cell_7'));
        content.append(td7);
        if (familyFields.indexOf('hjszd') !== -1) {
            var td8 = $('<td>').append($('<input>').attr('id', 'row_cell_8'));
            content.append(td8);
        }
        // 身份证号
        if (familyFields.indexOf('cardno') !== -1) {
            var td9 = $('<td>').append($('<input>').attr('id', 'row_cell_9'));
            content.append(td9);
        }
        // 操作
        var td10 = $('<td>').append($('<img>').attr('src', '/images/icon_remove.gif').css('width', '1rem')).css('text-align', 'center');
        td10.click(deleterow);
        content.append(td10);
        if($('#fsub tr').length>6){
            alert("最多填加6条家长信息!");
            return;
        }
        $('#fsub tr:last').after(content);
    };

    $('.aBtns').on('click', '.js_apply', function (event) {
        event.preventDefault();



        if ($('#name').val() == '') {
            alert('幼儿姓名不能为空!');
            isclear();
            $('#apply_infor #name').focus();
            return false;
        }
        if ($('#apply_infor #cardNo').val() == '') {
            alert('幼儿身份证号不能为空!');
            isclear();
            $('#apply_infor #cardNo').focus();
            return false;
        }
        if ($.trim($('#cardNo').val()) != "") {
            var num = $("#cardNo").val();
            var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
            var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
            var varArray = new Array();
            var intValue;
            var lngProduct = 0;
            var intCheckDigit;
            var intStrLen = num.length;
            var idNumber = num;

            if ((intStrLen != 15) && (intStrLen != 18)) {
                alert("[幼儿身份证号]的长度不正确,请重新输入!!!");
                isclear();
                $('#apply_infor #cardNo').focus();
                return false;
            }
            for (i = 0; i < intStrLen; i++) {
                varArray[i] = idNumber.charAt(i);
                if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                    alert("[幼儿身份证号]的格式不正确,请重新输入!!!");
                    isclear();
                    $('#apply_infor #cardNo').focus();
                    return false;
                } else if (i < 17) {
                    varArray[i] = varArray[i] * factorArr[i];
                }
            }
            if (intStrLen == 18) {
                var date8 = idNumber.substring(6, 14);
                if (isDate8(date8) == false) {
                    alert("[幼儿身份证号]日期格式不正确,请重新输入!!!");
                    isclear();
                    $('#apply_infor #cardNo').focus();
                    return false;
                }
                for (i = 0; i < 17; i++) {
                    lngProduct = lngProduct + varArray[i];
                }
                intCheckDigit = parityBit[lngProduct % 11];
                if (varArray[17] != intCheckDigit) {
                    alert("[幼儿身份证号]内容错误,请重新输入!!!");
                    isclear();
                    $('#apply_infor #cardNo').focus();
                    return false;
                }
                if($('#apply_infor #age').val()!=''){
                    var birth1 =$('#apply_infor #age').val().replace(/\-/g,'');
                    if(birth1!=date8){
                        alert('幼儿生日与身份证号上的生日不符，请核实！');
                        isclear();
                        $('#apply_infor #age').focus();
                        return false;
                    }
                }
            }
            else {
                var date6 = idNumber.substring(6, 12);
                if (isDate6(date6) == false) {
                    alert("[幼儿身份证号]日期格式不正确,请重新输入!!!");
                    isclear();
                    $('#apply_infor #cardNo').focus();
                    return false;
                }
            }
        }
        if ($('#apply_infor #age').val() == ''||$('#apply_infor #age').val() == '请填写幼儿的出生日期') {
            alert('幼儿出生日期不能为空!');
            isclear();
            $('#apply_infor #age').focus();
            return false;
        }



            if ($('#apply_infor #avatar_img_url').val()==''){
                alert('请上传幼儿一寸照片!');
                isclear();
                return false;
            }
            if ($('#apply_infor #natives').val() == '') { //这段注释掉,因为接口共用,简版没有户籍地址
                alert('幼儿户籍地址不能为空!');
                isclear();
                $('#apply_infor #natives').focus();
                return false;
            }
            if ($('#apply_infor #address').val() == '') {
                alert('幼儿现居住地址不能为空!');
                isclear();
                $('#apply_infor #address').focus();
                return false;
            }
            if ($.trim($('#apply_infor #address').val()).length <6) {
                alert('幼儿现居住地址格式不对!');
                isclear();
                $('#apply_infor #address').focus();
                return false;
            }
            if ($('#apply_infor #sssq').val() == '') { //20170328新添加
                alert('所属社区不能为空!');
                isclear();
                $('#apply_infor #sssq').focus();
                return false;
            }
            if ($('#apply_infor #lhsj').val() == ''||$('#apply_infor #lhsj').val() == '请填写落户时间') { //20170328新添加
                alert('落户时间不能为空!');
                isclear();
                $('#apply_infor #lhsj').focus();
                return false;
            }
            if ($('#apply_infor #hkxz').val() == '') {
                alert('户口性质不能为空!');
                isclear();
                $('#apply_infor #hkxz').focus();
                return false;
            }
            if ($('#apply_infor #hzxm').val() == '') {  //20170328新添加
                alert('户主姓名不能为空!');
                isclear();
                $('#apply_infor #hzxm').focus();
                return false;
            }
            if ($('#apply_infor #relationship').val() == '') { //
                alert('与户主的关系不能为空!');
                isclear();
                $('#apply_infor #relationship').focus();
                return false;
            }
            if ($('#apply_infor #yxdz').val() == '') { //
                alert('邮箱地址不能为空!');
                isclear();
                $('#apply_infor #yxdz').focus();
                return false;
            }

            if ($('#apply_infor #yxys').val() == '') { //丰台三幼分园招生计划
                alert('意向园所不能为空!');
                isclear();
                $('#apply_infor #yxys').focus();
                return false;
            }

            //if(document.getElementById("mark").value=='') {
            //    alert('备注不能为空!');
            //    isclear();
            //    $('#apply_infor #mark').focus();
            //    return false;
            //}
            if($('#mark').val()=='') {
                alert('备注不能为空!');
                isclear();
                $('#apply_infor #mark').focus();
                return false;
            }


            //-------第一行家长验证
            if ($('#apply_infor .inpform_name').val() == '') {
                alert('第一行家长姓名不能为空!');
                isclear();
                $('#apply_infor .inpform_name').focus();
                return false;
            }
            if ($('#apply_infor .inpform_nl').val() == '') {
                alert('家长年龄不能为空!');
                isclear();
                $('#apply_infor .inpform_nl').focus();
                return false;
            }
            if ($.trim($('.inpform_nl').val()) != "") {
                if (!regNum.test($.trim($('.inpform_nl').val()))) {
                    alert("家长年龄必须是数字!");
                    isclear();
                    $('.inpform_nl').focus();
                    return false;
                }
            }
            if ($('#apply_infor .inpform_gzdw').val() == '') {
                alert('第一行家长工作单位不能为空!');
                isclear();
                $('#apply_infor .inpform_gzdw').focus();
                return false;
            }
            if ($('#apply_infor .inpform_zy').val() == '') {
                alert('第一行家长职业不能为空!');
                isclear();
                $('#apply_infor .inpform_zy').focus();
                return false;
            }
            if ($('#apply_infor .inpform_mobile').val() == '') {
                alert('第一行家长手机号不能为空!');
                isclear();
                $('#apply_infor .inpform_mobile').focus();
                return false;
            }
            if ($.trim($('.inpform_mobile').val()) != "") {
                if (!regTel.test($.trim($('.inpform_mobile').val()))) {
                    alert("请添加正确的家长手机号");
                    isclear();
                    $('.inpform_mobile').focus();
                    return false;
                }
            }
            //20170321取消家长籍贯
            //if ($('#apply_infor .inpform_jg').val() == '') {
            //    alert('第一行家长籍贯不能为空!');
            //    isclear();
            //    $('#apply_infor .inpform_jg').focus();
            //    return false;
            //}
            if ($('#apply_infor .inpform_jhr').val() == '') {
                alert('请填写是否为幼儿的第一监护人!');
                isclear();
                $('#apply_infor .inpform_jhr').focus();
                return false;
            }
            if ($('#apply_infor .inpform_hjszd').val() == '') {
                alert('第一行家长户籍所在地不能为空!');
                isclear();
                $('#apply_infor .inpform_hjszd').focus();
                return false;
            }
            if ($('#apply_infor .inpform_card').val() == '') {
                alert('第一行家长身份证号不能为空!');
                isclear();
                $('#apply_infor .inpform_card').focus();
                return false;
            }
            if ($.trim($('.inpform_card').val()) != "") {
                if (checkcard($.trim($('.inpform_card').val())) == false) {
                    alert("家长身份证号填写错误,请重新输入!!!");
                    isclear();
                    $('.inpform_card').focus();
                    return false;
                }
            }
            //------第二行必填家长验证
            if ($('#apply_infor .inpform_name2').val() == '') {
                alert('家长姓名不能为空!');
                isclear();
                $('#apply_infor .inpform_name2').focus();
                return false;
            }
            if ($('#apply_infor .inpform_nl2').val() == '') {
                alert('家长年龄不能为空!');
                isclear();
                $('#apply_infor .inpform_nl2').focus();
                return false;
            }
            if ($.trim($('.inpform_nl2').val()) != "") {
                if (!regNum.test($.trim($('.inpform_nl2').val()))) {
                    alert("家长年龄必须是数字!");
                    isclear();
                    $('.inpform_nl2').focus();
                    return false;
                }
            }
            if ($('#apply_infor .inpform_gzdw2').val() == '') {
                alert('家长工作单位不能为空!');
                isclear();
                $('#apply_infor .inpform_gzdw2').focus();
                return false;
            }
            if ($('#apply_infor .inpform_zy2').val() == '') {
                alert('家长职业不能为空!');
                isclear();
                $('#apply_infor .inpform_zy2').focus();
                return false;
            }
            if ($('#apply_infor .inpform_mobile2').val() == '') {
                alert('家长手机号不能为空!');
                isclear();
                $('#apply_infor .inpform_mobile2').focus();
                return false;
            }
            if ($.trim($('.inpform_mobile2').val()) != "") {
                if (!regTel.test($.trim($('.inpform_mobile2').val()))) {
                    alert("请添加正确的家长手机号");
                    isclear();
                    $('.inpform_mobile2').focus();
                    return false;
                }
            }
            //20170321取消家长籍贯
            //if ($('#apply_infor .inpform_jg2').val() == '') {
            //    alert('家长籍贯不能为空!');
            //    isclear();
            //    $('#apply_infor .inpform_jg2').focus();
            //    return false;
            //}
            if ($('#apply_infor .inpform_jhr2').val() == '') {
                alert('请填写是否为幼儿的第一监护人!');
                isclear();
                $('#apply_infor .inpform_jhr2').focus();
                return false;
            }
            if ($('#apply_infor .inpform_hjszd2').val() == '') {
                alert('家长户籍所在地不能为空!');
                isclear();
                $('#apply_infor .inpform_hjszd2').focus();
                return false;
            }
            if ($('#apply_infor .inpform_card2').val() == '') {
                alert('家长身份证号不能为空!');
                isclear();
                $('#apply_infor .inpform_card2').focus();
                return false;
            }
            if ($.trim($('.inpform_card2').val()) != "") {
                if (checkcard($.trim($('.inpform_card2').val())) == false) {
                    alert("家长身份证号填写错误,请重新输入!!!");
                    isclear();
                    $('.inpform_card2').focus();
                    return false;
                }
            }
            //幼儿情况说明验证
            if($('#historySchool').val()==''){
                alert('[是否参加过亲子教育]不能为空!');
                isclear();
                $('#historySchool').focus();
                return false;
            }
            if($('#historyStudy').val()==''){
                alert('[有哪方面特长]不能为空!');
                isclear();
                $('#historyStudy').focus();
                return false;
            }
            if($('#historyGm').val()==''){
                alert('[有何药物过敏或者过敏原]不能为空!');
                isclear();
                $('#historyGm').focus();
                return false;
            }
            if($('#yq').val()==''){
                alert('[有何特殊情况与要求]不能为空!');
                isclear();
                $('#yq').focus();
                return false;
            }
            if($('#birth').val()==''){
                alert('[是否有出生证]不能为空!');
                isclear();
                $('#birth').focus();
                return false;
            }
            if($('#yfjz').val()==''){
                alert('[是否有预防接种证]不能为空!');
                isclear();
                $('#yfjz').focus();
                return false;
            }
            if($('#crb').val()==''){
                alert('[患过何种传染病]不能为空!');
                isclear();
                $('#crb').focus();
                return false;
            }
            if($('#jss').val()==''){
                alert('[是否寄宿生]不能为空!');
                isclear();
                $('#jss').focus();
                return false;
            }
            if($('#sqznv').val()==''){
                alert('[是否进城务工随迁子女]不能为空!');
                isclear();
                $('#sqznv').focus();
                return false;
            }
            if($('#lset').val()==''){
                alert('[是否留守儿童]不能为空!');
                isclear();
                $('#lset').focus();
                return false;
            }
            if($('#cjye').val()==''){
                alert('[是否残疾幼儿]不能为空!');
                isclear();
                $('#cjye').focus();
                return false;
            }
            if($('#cjyelb').val()==''){
                alert('[残疾幼儿类别]不能为空!');
                isclear();
                $('#cjyelb').focus();
                return false;
            }
            if($('#guer').val()==''){
                alert('[是否孤儿]不能为空!');
                isclear();
                $('#guer').focus();
                return false;
            }
            if($('#dibao').val()==''){
                alert('[是否低保]不能为空!');
                isclear();
                $('#dibao').focus();
                return false;
            }
            if($('#jszz').val()==''){
                alert('[是否接受资助]不能为空!');
                isclear();
                $('#jszz').focus();
                return false;
            }

            if($('#baoxian').val()==''){
                alert('[是否参加一老一小保险]不能为空!');
                isclear();
                $('#baoxian').focus();
                return false;
            }

            if($('#work').val()==''){
                alert('[外来务工人员是否有《居住证》、《用工合同》或《营业执照》]不能为空!');
                isclear();
                $('#work').focus();
                return false;
            }

            if($('#room').val()==''){
                alert('[家庭是否有房产证]不能为空!');
                isclear();
                $('#room').focus();
                return false;
            }
            if ($('#apply_infor #fczzp_img_url').val()==''){
                alert('请上传房产证或购房合同照片!');
                isclear();
                return false;
            }

            if ($('#apply_infor #hkbzp_home_img_url').val()==''){
                alert('请上传户口本首页照片!');
                isclear();
                return false;
            }

            if ($('#apply_infor #hkbzp_m_img_url').val()==''){
                alert('请上传户口本户主页照片!');
                isclear();
                return false;
            }

            if ($('#apply_infor #hkbzp_img_url').val()==''){
                alert('请上传户口本本人页照片!');
                isclear();
                return false;
            }
            if ($('#apply_infor #cszzp_img_url').val()==''){
                alert('请上传出生证照片!');
                isclear();
                return false;
            }

            var check_code = $("#check_code").val();
            if(check_code==""){
                alert("请填写验证码！");
                $('#check_code').focus();
                return;
            }

            var planId = $('#planId').val();
            var dataObj = {};
            dataObj["gardenId"] = $('#gardenId').val();  //园所ID
            dataObj["planId"] = $('#planId').val();
            dataObj["name"] = $('#name').val();  //姓名
            dataObj["sex"] = $("input[name='sex']:checked").val();  //性别
            dataObj["isOne"] = $("input[name='isOne']:checked").val();  //是否独生
            dataObj["cardNo"] = $('#cardNo').val();    //身份证号
            dataObj["birthday"] = $('#age').val() + ' 00:00:00';  //出生日期
            dataObj["natives"] = $('#natives').val();  //户籍地址
            dataObj["national"]=$('#national').find("option:selected").text();  //民族
            dataObj["avatarUrl"]=$('#avatar_img_url').val(); //幼儿头像照片
            dataObj["address"] = $('#address').val(); //现住址

            dataObj["sssq"]=$('#sssq').val();  //20170328 所属社区
            dataObj["lhsj"]=$('#lhsj').val()+' 00:00:00';  //20170328 落户时间
            dataObj["hkxz"] = $('#hkxz').val();    //户口性质
            dataObj["hzxm"] =$('#hzxm').val(); //20170328 户主姓名
            dataObj["relationship"]=$('#relationship').val(); //幼儿与户主的关系
            dataObj["email"] = $('#yxdz').val();  //电邮
            dataObj["yxys"]=$('#yxys').val();  //意向园所[分园]
            dataObj["mark"] = $('#mark').val();    //备注

            dataObj["historySchool"] = $('#historySchool').val();  //上过哪所学校
            dataObj["historyStudy"] = $('#historyStudy').val();      //兴趣爱好
            dataObj["historyGm"] = $('#historyGm').val();          //过敏
            dataObj["yq"] = $('#yq').val();                          //特殊要求
            dataObj["birth"] = $('#birth').val();                      //是否有出生证明
            dataObj["inoculation"] = $('#yfjz').val();                 //预防接种证
            dataObj["crb"] = $('#crb').val();                        //传染病
            dataObj["jss"] = $('#jss').val();                        //是否寄宿生
            dataObj["sqznv"] = $('#sqznv').val();                   //是否随迁子女
            dataObj["lset"] = $('#lset').val();                     //是否留守儿童
            dataObj["cjye"] = $('#cjye').val();                     //是否残疾幼儿
            dataObj["cjyelb"] = $('#cjyelb').val();                //残疾幼儿类别
            dataObj["guer"] = $('#guer').val();                    //是否孤儿
            dataObj["jkzk"] = $('#jkzk').val();                    //幼儿健康状况
            dataObj["baoxian"]= $('#baoxian').val();             //20170329 是否参加一老一小保险
            dataObj["dibao"] = $('#dibao').val();
            dataObj["jszz"] = $('#jszz').val();
            dataObj["work"] = $('#work').val();  //外地人员务工证
            dataObj["room"] = $('#room').val();  //房产证
            dataObj["fczzpUrl"]=$('#fczzp_img_url').val(); //房产证照片地址
            dataObj["hkbzpHomeUrl"]=$('#hkbzp_home_img_url').val();//户口本首页照片地址
            dataObj["hkbzpmUrl"]=$('#hkbzp_m_img_url').val(); //户口本户主页照片地址
            dataObj["hkbzpUrl"]= $('#hkbzp_img_url').val(); //户口本本人页照片地址
            dataObj["cszzpUrl"]= $('#cszzp_img_url').val(); //出生证照片地址
            dataObj["checkCode"] = $('#check_code').val();  //验证码
            $('#fsub tr').each(function(index, tr) {
                if (index == 0) return;
                index -= 1;
                dataObj['onlineRegMemberSubList[' + index +'].gx'] = $(tr).find("#row_cell_0").find("option:selected").text();  //关系
                dataObj['onlineRegMemberSubList[' + index + '].name'] = $(tr).find("#row_cell_1").val();  //姓名
                dataObj['onlineRegMemberSubList[' + index + '].age'] = $(tr).find("#row_cell_2").val();  //年龄
                dataObj['onlineRegMemberSubList[' + index + '].xl'] = $(tr).find("#row_cell_3").find("option:selected").text();  ///学历
                dataObj['onlineRegMemberSubList[' + index + '].gzdw'] = $(tr).find("#row_cell_4").val();  //工作单位
                dataObj['onlineRegMemberSubList[' + index + '].zy'] = $(tr).find("#row_cell_5").val();  //职业
                dataObj['onlineRegMemberSubList[' + index + '].mobile'] = $(tr).find("#row_cell_6").val();  //电话 必填  需验证
                dataObj['onlineRegMemberSubList[' + index + '].jhr'] = $(tr).find("#row_cell_7").val();  //是否幼儿的第一监护人
                dataObj['onlineRegMemberSubList[' + index + '].hjszd'] = $(tr).find("#row_cell_8").val();  //户籍所在地
                dataObj['onlineRegMemberSubList[' + index + '].cardno'] = $(tr).find("#row_cell_9").val();  //身份证号 要求验证重复
            });
            var index = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            //var completeTips;
            //if($('#completeTips').val()==null||$('#completeTips').val()=='') {
            //    completeTips = "资料提交成功!待审核中,录取与否以幼儿园电话或短信通知为准!";
            //}else {
            //    completeTips = $('#completeTips').val();
            //}
            $.post(root + '/apply.do?save', dataObj, function (data) {
                var json_obj = $.parseJSON(data);
                if (json_obj.success) {
                    var completeTips;
                    if(json_obj.datas.messges==null){
                        completeTips="资料提交成功!待审核中,录取与否以幼儿园电话或短信通知为准!";
                    }else{
                        completeTips =json_obj.datas.messges;
                    }
                    //alert(json_obj.datas.messges);
                    alert(completeTips);
                    var query = location.search.substring(1);
                    if (query.indexOf('old') == -1) {
                        location.href = root + "/apply.do";
                    } else {
                        location.href = root + "/apply.do?old";
                    }
                } else {
                    layer.close(index);//error
                    var errorMessage = json_obj.error;
                    alert(errorMessage);
                    if(errorMessage=='验证码错误!'){

                        // document.getElementById("createCheckCode").src=document.getElementById("createCheckCode").src + "?nocache="+new Date().getTime();
                        document.getElementById("createCheckCode").click();
                    }


                    isclear();
                }
            }, 'json');

            setTimeout(function() {
                //统计点击某招生计划的"报名"数据
                _hmt.push(['_setCustomVar', 1, '点击报名',  planId, 2]);
            }, 3 * 1000);

    });






    $('.js_check').on('click', function(event) {
        event.preventDefault();
        var planId =$(this).attr('planId');
        var isPass = 0;
        var url;

        if($(this).attr('old')!=null) {
           url =root + "/apply.do?note&old&planId="+planId;
        }
        else{
            url=root + "/apply.do?note&planId="+planId;
        }
        $.post(root + '/apply.do?check',{
            "planId": planId
        }, function(data) {
            var json_obj = $.parseJSON(data);
            if (json_obj.success) {
                location.href=url;
            } else {
                var errorMessage = json_obj.error;
                alert(errorMessage);
                return;
            }
        },'json');

        setTimeout(function() {
            //统计点击某招生计划的"我要报名"数据
            _hmt.push(['_trackEvent', 'want_to_join ', 'click', planId]);
            _hmt.push(['_setCustomVar', 1, '点击招生计划',  planId, 2]);
        }, 3 * 1000);


    });

    $('.js_next').on('click',function(event){
        event.preventDefault();
        var planId =$(this).attr('planId');
        var url;
        if($(this).attr('old')!=null) {
            url =root + "/apply.do?input&old&planId="+planId;
        }
        else{
            url=root + "/apply.do?input&planId="+planId;
        }
        var ischeck = document.getElementById('selAgree');
        if (ischeck.checked) {
            location.href=url;
        }
        else{
            alert("请先阅读以上报名须知,并勾选同意复选框!");
            return;
        }
    });

});
