var completeLoad = true
if (typeof(jQuery) != 'undefined' && typeof(layui) !='undefined') {
	
	function getregion(){
		$.getJSON("/client/default/js/region.json", function (data){  
			$('#drpprovince').html(''); 
			$('#drpprovince').append('<option value="">请选择省</option>');
	     
		      $.each(data.RECORDS, function (infoIndex, info){
			        if(info.pid ==0){
			            $('#drpprovince').append('<option  value=' + info.id + '>' + info.name + '</option>');
			        } 
		        }) 
	        // layui.form.render('select');
	    }) 	  
	}
 	$(document).ready(function() {
 		var datas = null;
		$(".wrap").css("display","block");
		$("input").bind("cut copy paste", function(e) {  
				layer.msg('禁止粘贴');  
				e.preventDefault();  
		});  
 
		document.oncontextmenu = function(){ 
			return false; 
		} 
		document.onkeydown = function(){ 
			if (event.ctrlKey && window.event.keyCode==67){ 
				return false; 
			} 
			if (event.ctrlKey && window.event.keyCode==86){ 
				return false; 
			} 
			if(window.event && window.event.keyCode == 123) {
	        return false; 
		    }
				if((window.event.ctrlKey) && (window.event.shiftKey) && (window.event.keyCode == 73)) {
		        return false; 
		    }
				if((window.event.ctrlKey) && (window.event.keyCode == 85)) {
		        return false; 
		    }
		} 
		document.body.oncopy = function (){ 
			return false; 
		} 
		document.onselectstart = function(){ 
			return false; 
		}
		
		
		
		//省市县JSON	
		getregion();

	})

	

 	// 出生日期判断
	function getbithday(){
	    var birthday="";
	    var idCard = $.trim($("#identity").val());  
	    if(idCard.length != 18){  
	        layer.msg("身份证号必须是18位")
	    }else{
	        birthday = idCard.substr(6,8); 
	        if( parseInt(birthday) < 20160901){
	            layer.msg("出生日期不能早于2016年9月1号")
	            //$("#birthday").val("")
	        }else if( parseInt(birthday) > 20170831){
	            layer.msg("出生日期不能晚于2017年8月31日")
	            //$("#birthday").val("")
	        }else if(isCardID(idCard) != true){         
	            layer.msg("身份证号码不是真实身份证!")
	        }else{
	            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
	            $("#birthday").val(birthday);
	            if (idCard.substr(16,1)%2){
	                $("#sexmal").prop("checked","true");
	    
	            }else{
	                $("#sexfemal").prop("checked","true");
	            }
	            layui.form.render(); 
	        }        
	    }
	}

	//身份证真实性判断
	function isCardID(sId){
	    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
	     var iSum=0 ;
	     var info="" ;
	     if(!/^\d{17}(\d|x)$/i.test(sId)) {
	        return "你输入的身份证长度或格式错误";
	    }
	     sId=sId.replace(/x$/i,"a");
	     if(aCity[parseInt(sId.substr(0,2))]==null) {
	        return "你的身份证地区非法";
	    }
	     sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
	     var d=new Date(sBirthday.replace(/-/g,"/")) ;
	     if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
	        return "身份证上的出生日期非法";
	    }
	     for(var i = 17;i>=0;i --){
	        iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
	     } 
	     if(iSum%11!=1) {
	        return "你输入的身份证号非法";
	    }
	     return true;
	}
	//去掉连续重复字符
	function removeRepetition(str){
		// str = str.replace(/\ +/g,"");
  //   	str = str.replace(/[ ]/g,"");
  //   	str = str.replace(/[\r\n]/g,"");
       	  var result="";
          len=str.length;   
        for(var i=0 ; i<len;i++){
            if(str[0]==str[1]){
                str=str.slice(1);
            }else{
                result=result+str[0];
                str=str.slice(1);
            }
        }
        return result;
    }
	//关闭确认信息框
	function closeContent(obj){
		$('#'+obj).css('display','none');
		$('input').removeAttr('readonly').removeAttr('disabled');
	  	$('select').removeAttr('disabled');
	  	layui.form.render(); 
	  	$("#ybd-contents").html('');
	  	$('#ybd-shadow').css('display','none')
	}
	//关闭确认信息框
	function doSubmits(){
		closeContent('ybd-confirm-msg');
		$("#w0w0rar").submit();		
	}
	// 二次验证重点信息
	function revalidate(){
		var birthday="";
	    var idCard = $.trim($("#identity").val());  
	    if(idCard.length != 18){  
	        layer.msg("身份证号必须是18位")
	        return false
	    }else{
	        birthday = idCard.substr(6,8); 
	        if( parseInt(birthday) < 20160901){
	            layer.msg("出生日期不能早于2016年9月1号")
	            //$("#birthday").val("")
	        }else if( parseInt(birthday) > 20170831){
	            layer.msg("出生日期不能晚于2017年8月31日")
	            //$("#birthday").val("")
	        }else if(isCardID(idCard) != true){         
	            layer.msg("身份证号码不是真实身份证!")
	        }else{
	            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
	            $("#birthday").val(birthday);
	            if ($.trim($("#identity").val()).substr(16,1)%2){
	                if ($("#sexmal").val() != "男"){
	                	layer.msg("所选性别与身份证包含性别不一致")
	                }
	            }else{
	                if ($("#sexfemal").val() != "女"){
	                	layer.msg("所选性别与身份证包含性别不一致")
	                }
	            }	            
	        }  
	        return false      
	    }
	    return true
	}	
	//获取完整地址
	function getalladdress(){

		$("#xxaddress").val($("#drpprovince option:selected").text() + $("#drpcity option:selected").text()+ $("#drparea option:selected").text() + $("#xxaddress").val())

	}

	//验证码
	function verifyVali(src){
        $.ajax({
            //请求方式
            type : "POST",
            //请求的媒体类型
            dataType:'json',
            //请求地址
            url:"/Index---ajax_verify.html",
            //数据，json字符串
            data : {"verify":src},
            //请求成功
            success : function(res) {  
                   console.log(res.status)         
	              if(res.status == 1){
	                return 1
	              }else{
	                return 0
	              }
            },
            //请求失败，包含具体的错误信息
            error : function(e){
                console.log(e.status);
                console.log(e.responseText);
            }

        })
    }
	//copy展示内容
	(function (original) {
	  jQuery.fn.clone = function () {
	    var result           = original.apply(this, arguments),
	        my_textareas     = this.find('textarea').add(this.filter('textarea')),
	        result_textareas = result.find('textarea').add(result.filter('textarea')),
	        my_selects       = this.find('select').add(this.filter('select')),
	        result_selects   = result.find('select').add(result.filter('select'));
	 
	    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
	    for (var i = 0, l = my_selects.length;   i < l; ++i) {
	      for (var j = 0, m = my_selects[i].options.length; j < m; ++j) {
	        if (my_selects[i].options[j].selected === true) {
	          result_selects[i].options[j].selected = true;
	        }
	      }
	    }
	    return result;
	  };
	}) (jQuery.fn.clone);
	

	layui.use(['form', 'laydate', 'layer', 'element'], function(){
	    var form = layui.form,
	  	    laydate = layui.laydate,
	  	    element = layui.element,
	        layer = layui.layer ;
		laydate.render({
	       elem: '#birthday'
	      });
	    //省市联动
	    form.on('select(drpprovince)', function (data) {
	    	// if(!$('#drpprovince').html()){
	    	// 	getregion()
	    	// }
	    	// console.log($('#drpprovince').html())
	    	// console.log(!$('#drpprovince').html())
	        var proid = data.value;	       
	        $('#drpcity').html("");
	        $('#drparea').html("");
	        $.getJSON("/client/default/js/region.json", function (data){
	            $.each(data.RECORDS, function (infoIndex, info){
	                 if(info.pid == parseInt(proid)){
	                   
	                    $('#drpcity').append('<option  value=' + info.id + '>' + info.name + '</option>');
	                 }
	                 if(info.pid == $('#drpcity').val()){
	                    $('#drparea').append('<option  value=' + info.id + '>' + info.name + '</option>');
	                 }
	                 
	              })
	            form.render();
	        })     
	    });
	    //省市联动
	    form.on('select(drpcity)', function (data) {
	        var cityid = data.value;
	        $('#drparea').html("");
	        $.getJSON("/client/default/js/region.json", function (data){
	            $.each(data.RECORDS, function (infoIndex, info){
	                 if(info.pid ==cityid){
	                    $('#drparea').append('<option  value=' + info.id + '>' + info.name + '</option>');
                    }	                 
                })
	            form.render();
	        })  
	    });
	    //禁止性别选项
	    form.on('radio(refusesex)', function(data){

		  return false;
		});  

	    //自定义验证规则
		form.verify({
		    yourName: function(value){
		      if(value.length < 2 || value.length > 8){
		        return '幼儿姓名两到八个汉字';
		      }
		    }
		    ,youerCszbh: [
		      /^[a-zA-Z0-9]{5,21}$/
		      ,'出生证编号格式不对'
		    ]
		    ,hkbbh: [
		      /^[a-zA-Z0-9]{3,21}$/
		      ,'户口簿编号格式不对'
		    ]
		    ,continustr: function(value){
		    	value = value.replace(/\ +/g,"");
		    	value = value.replace(/[ ]/g,"");
		    	value = value.replace(/[\r\n]/g,"");
		    	var regcontinustr=/([0-9a-zA-Z])\1{2}/;
			    if(regcontinustr.test(value)){
					return "有连续重复的无效字符";
				}
		    }
		    ,sfzvalidate: function(value){
			    if($.trim($("#identity").val()).length != 18){  
			        return "身份证号必须是18位"
			    }else{
			        if( parseInt($.trim($("#identity").val()).substr(6,8)) < 20160901){
			            return "出生日期不能早于2016年9月1号"
			        }else if( parseInt($.trim($("#identity").val()).substr(6,8)) > 20170831){
			            return "出生日期不能晚于2017年8月31日"
			        }else if(isCardID($.trim($("#identity").val())) != true){         
			            return "身份证号码不是真实身份证!"
			        }      
			    }
		    	
		    }
		    ,birthvalidate: function (value){
		    	console.log(parseInt(value.substr(0)))
		    	if( parseInt(value) < 20160901){
			        return "出生日期不能早于2016年9月1号"
		        }else if( parseInt(value) > 20170831){
		            return "出生日期不能晚于2017年8月31日"
		        }
		    }
		    ,sexvalidate: function(value){
		    	value = $('input[name="youer_sex"]:checked ').val()
		    	if ($.trim($("#identity").val()).substr(16,1)%2){
	                if (value != "男"){
	                	return "所选性别与身份证包含性别不一致"
	                }
	            }else{
	                if (value != "女"){
	                	return "所选性别与身份证包含性别不一致"
	                }
	            }
		    }
		    ,maxcontent: function(value){
		    	value = value.replace(/\ +/g,"");
		    	value = value.replace(/[ ]/g,"");
		    	value = value.replace(/[\r\n]/g,"");
		    	if(value.length < 50){
		    		 return '问题答案有效字数最少50字';
		    	}else{
		    		if(removeRepetition(value).length < 50 ){
		    			return '问题答案有效字数最少50字！当前有效字符数为 '+removeRepetition(value).length;
		    		}
		    		// value = value.replace(/\ +/g,"");
			    	// value = value.replace(/[ ]/g,"");
			    	// value = value.replace(/[\r\n]/g,"");
			     //   var s1 = value;
			     //   var c;
			     //   var cc = value.match(/([0-9a-zA-Z])\1+/g); 

			     //   if(cc){
				    //    for(var i = 0;i<cc.length;i++){
			     //           c = cc[i].substring(0,1);
			     //           s1 = s1.replace(cc[i],c);
				    // 	}
				    // 	if(s1.length < 50 || s1.length > 100){
				    //      return '问题答案字数最少50字，最多100字';
				    //     }
			     //   }else{
			     //   	    if(value.length < 50 || value.length > 100){
				    //      return '问题答案字数最少50字，最多100字';
				    //     }
			     //   }	
		    	}	    	      
				
		    }
		    ,otherReq: function(value,item){
		    	var $ = layui.$;
		    	var verifyName=$(item).attr('name')
		    	,verifyType=$(item).attr('type')
		    	,formElem=$(item).parents('.layui-form')//获取当前所在的form元素，如果存在的话
				,verifyElem=formElem.find('input[name='+verifyName+']')//获取需要校验的元素
				,isTrue= verifyElem.is(':checked')//是否命中校验
				,focusElem = verifyElem.next().find('i.layui-icon');//焦点元素
				if(!isTrue || !value){
			        //定位焦点
			        focusElem.css(verifyType=='radio'?{"color":"#FF5722"}:{"border-color":"#FF5722"});
			        //对非输入框设置焦点
			        focusElem.first().attr("tabIndex","1").css("outline","0").blur(function() {
			            focusElem.css(verifyType=='radio'?{"color":""}:{"border-color":""});
			         }).focus();
			        return '必填项不能为空';
				}
		    }
		    ,validateVerify: function(value){
		    	var status = 0 ,msg ='验证码错误';
			    $.ajax({
		            //请求方式
		            type : "POST",
		            //请求的媒体类型
		            dataType:'json',
		            //请求地址
		            url:"/Index---ajax_verify.html",
		            //数据，json字符串
		            data : {"verify":value},
		            async: false,
		            //请求成功
		            success : function(res) {  
		            	if(res){
		                  status = res.status   
		                  msg = res.info
		                 }
		            },
		            //请求失败，包含具体的错误信息
		            error : function(e){
		                console.log(e.status);
		                console.log(e.responseText);
		            }

		        })
		        if(value != 5661){
		        	
		        	return msg
		        }
		       
		    }
		});

		 //监听提交
	    form.on('submit(baoming)', function(data){
	    	
	    	$("#bmprov").val($("#drpprovince option:selected").text())
	    	$("#bmcity").val($("#drpcity option:selected").text())
	    	$("#bmdist").val($("#drparea option:selected").text())
	    	
	    	
	    	var birthday="";
		    var idCard = $.trim($("#identity").val());  
		    if(idCard.length != 18){  
		        layer.msg("身份证号必须是18位")
		    }else{
		        birthday = idCard.substr(6,8); 
		        if( parseInt(birthday) < 20160901){
		            layer.msg("出生日期不能早于2016年9月1号")
		            //$("#birthday").val("")
		        }else if( parseInt(birthday) > 20170831){
		            layer.msg("出生日期不能晚于2017年8月31日")
		            //$("#birthday").val("")
		        }else if(isCardID(idCard) != true){         
		            layer.msg("身份证号码不是真实身份证!")
		        }else{
		            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
		            $("#birthday").val(birthday);
		            if (idCard.substr(16,1)%2){
		                $("#sexmal").prop("checked","true");
		    
		            }else{
		                $("#sexfemal").prop("checked","true");
		            }
		            layui.form.render(); 
		            datas = JSON.stringify(data.field);
		            $.ajax({
			            //请求方式
			            type : "POST",
			            //请求的媒体类型
			            dataType:'json',
			            //请求地址
			            url:"/Index---ajax_token.html",
			            //数据，json字符串
			            data : {"tokens":$("#tokens").val()},
			            async: false,
			            //请求成功
			            success : function(res) {  
			            	if(res){
			            		if(res.status == 0){
			            			$("#tokens").val(res.data)
			            		}
			                  
			                 }
			            },
			            //请求失败，包含具体的错误信息
			            error : function(e){
			                console.log(e.status);
			                console.log(e.responseText);
			            }

			        })
		            $("li.wenjuan").each(function(){
						$(this).find("input.hids").remove();
						$(this).append("<input type='hidden' class='hids' name='"+$(this).attr("data-wt")+"' value='"+$(this).attr("data-val")+"'/>")
					});
		            $('#ybd-shadow').css('display','block');
		            $('#ybd-contents').empty();
		            var inputs =  $('#ybd-clone-node-sign').find('.layui-input');
		            for (var i = 0; i< inputs.length; i++){
						inputs.eq(i).val(inputs.eq(i).val());
					}
		            $('#ybd-clone-node-sign').clone().appendTo($('#ybd-contents')).find('div.ybd-sign-yzm').remove();
		            $('input').attr({"readonly":"readonly","disabled":"disabled"});
		            $('select').attr({"disabled":"disabled"});
		            $('#ybd-confirm-msg').find('textarea').attr({"readonly":"readonly","disabled":"disabled"});
		            form.render(); 
		            $('#ybd-confirm-msg').fadeIn(); 
			        return false;	
		        }        
		    }
	    	      	
	    });
	})
}else { 

	alert("页面未正常加载，请刷新重试！");
	setTimeout(window.location.reload(),5000); 
} 
