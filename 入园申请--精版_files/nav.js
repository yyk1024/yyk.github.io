$(document).ready(function() {
	// var tobar = '<div class="tobar">\
	// 			    <a href="#" class="a_erw">扫码<dl><dt><img src="../images/erw.gif" height="92" width="92" alt="" /></dt><dd>微家园APP</dd></dl></a>\
	// 			    <a href="#" class="a_jia">加盟</a>\
	// 			    <a href="#" class="a_kef">客服</a>\
	// 			</div>';

	//$('body').append(tobar);
	$('.nav ul li').hover(function(){
		$(this).find('.submenu').show();
	},function(){
		$(this).find('.submenu').hide();
	});

	foot();
	$(window).resize(function(){
		foot();
	});
});

//footer
function foot(){
	if($(window).height() > $('body').height()){
		$('#footer').css('position', 'fixed');
	}else{
		$('#footer').css('position', 'inherit');
	}
}

