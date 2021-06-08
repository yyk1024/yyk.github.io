//没啥用
Date.prototype.format=function(e){
	                  var t,r,n,o,i,s={"y+":this.getFullYear(),"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S+":this.getMilliseconds()};
	                  /(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),
	                  t="0000";
	                  for(r in s)
	                  	new RegExp("("+r+")").test(e)&&(n=Math.min(RegExp.$1.length,t.length),o=0,i=""+s[r],o="y+"==r?4==n?0:2:i.length-Math.max(i.length,n),e=e.replace(RegExp.$1,(t+i).substr(o+t.length)));
	                  return e};
function formatDate(e){
	                   var t=new Date(e),r=""+(t.getMonth()+1),n=""+t.getDate(),o=t.getFullYear();
	                   return hour=""+t.getHours(),minute=""+t.getMinutes(),r.length<2&&(r="0"+r),n.length<2&&(n="0"+n),hour.length<2&&(hour="0"+hour),minute.length<2&&(minute="0"+minute),
	                   o+"年"+r+"月"+n+"日 "+hour+":"+minute}
function setCookie(e,t){
	                   var r,n,o,i,s={};
	                   s[e]=t,r=document.cookie?document.cookie.split("; "):[];
	                   try{
	                   	  for(n=0;n<r.length;n++)
	                   		  o=r[n].split("="),"rms_xqbm"==o[0]&&(i=unescape(o[1])?unescape(o[1]):"{}",s=JSON.parse(i),s[e]=t)}
	                   catch(a){}
	                   document.cookie="rms_xqbm="+escape(JSON.stringify(s))+";path=/;expires=Mon, 31 Dec 9999 23:59:59 UTC;"}

function getCookie(e){
	                   var t,r,n,o=document.cookie?document.cookie.split("; "):[],i="";
	                   try{
	                   	   for(t=0;t<o.length;t++)
	                   	   	   r=o[t].split("="),"rms_xqbm"==r[0]&&(n=JSON.parse(unescape(r[1])),i="undefined"==typeof n[e]?"":n[e])}
	                   catch(s){}
	                   return i+""}

function clearCookie(){document.cookie="rms_xqbm ="+escape("")+";path=/;expires=Mon, 31 Dec 9999 23:59:59 UTC;"}

function setTestCookie(e,t){document.cookie=e+"="+escape(t)+";path=/;expires=Mon, 31 Dec 9999 23:59:59 UTC;"}

function getTestCookie(e){
	                      var t,r,n=document.cookie.split("; ");
	                      for(t=0;t<n.length;t++)
	                      	  if(r=n[t].split("="),e==r[0])
	                      	  	return r.length>1?unescape(r[1]):"";
	                      return""}

function CharMode(e){return e>=48&&57>=e?1:e>=65&&90>=e?2:e>=97&&122>=e?4:8}

function bitTotal(e){var t=0;for(i=0;i<4;i++)1&e&&t++,e>>>=1;return t}

function checkStrong(e){if(e.length<6)return 0;var t=0;for(i=0;i<e.length;i++)t|=CharMode(e.charCodeAt(i));return bitTotal(t)}

function pwStrength(e){var t=$(e).val(),r=0;if(null==t||""==t)return r;switch(S_level=checkStrong(t),S_level){case 0:r=1;break;case 1:r=2;break;case 2:r=3;break;default:r=3}return r}

function IdentityCodeValid(e,t,r){var n,o,i,s=0,a=e,u="",l={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙",21:"辽宁",22:"吉林",23:"黑龙",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
                                  if(r=r?r:getcommonVal("birthdayPeriodArr"),!/^\d{17}(\d|x)$/i.test(a))
                                     return u="请正确输入身份证号码";
                                  if(a=a.replace(/x$/i,"a"),null===l[parseInt(a.substr(0,2))])
                                  	 return u="请正确输入身份证号码";
                                  if(n=a.substr(6,4)+"-"+Number(a.substr(10,2))+"-"+Number(a.substr(12,2)),o=new Date(n.replace(/-/g,"/")),n!==o.getFullYear()+"-"+(o.getMonth()+1)+"-"+o.getDate())
                                  	 return u="请正确输入身份证号码";
                                  if(t===!0&&(n=a.substr(6,4)+a.substr(10,2)+a.substr(12,2),!(parseInt(n,10)>=parseInt(r[0],10)&&parseInt(n,10)<=parseInt(r[1],10))))
                                  	 return u="孩子出生日期不符合招生条件";
                                  for(i=17;i>=0;i--)
                                  	  s+=Math.pow(2,i)%11*parseInt(a.charAt(17-i),11);
                                  return s%11!==1?u="请正确输入身份证号码":""}

function isDate(e){
	               var t,r,n,o,i,s,a,u,l=e;
	               return/^\d{8}$/.test(l)&&(l=l.substring(0,4)+"-"+l.substring(4,6)+"-"+l.substring(6,8)),null===l?!1:(t=String.fromCharCode(65293),r="-",n="",o="",i="",l.length<8||l.length>10?!1:(s=l.split(r),3!==s.length&&(s=l.split(t),3!==s.length)?!1:4!==s[0].length?!1:(n=s[0],o=s[1],i=s[2],isNaN(n)?!1:isNaN(o)?!1:isNaN(i)?!1:(a=n+"/"+o+"/"+i,u=new Date(a),u.getFullYear()!==parseInt(n,10)?!1:u.getMonth()!==parseInt(o,10)-1?!1:u.getDate()!==parseInt(i,10)?!1:!0))))}
try{
	console.log('为保证报名流程的正常进行，请立即关闭当前调试窗口，否则页面将不定时刷新，由此引发的后果由您个人承担！！！');
     window.chrome = null}
catch(e){}