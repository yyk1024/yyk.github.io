
function y_post(url,data){
$('#loadIngModal').modal('show');
$.ajax({
   url:url,   
   type:"POST",    
   data:data, 
   beforeSend:function(request){ request.setRequestHeader ("Content-Type", "application/json");  
                                 request.setRequestHeader ("Authorization","Basic ZXNiX3BsbTAxOmJlc3RfNzg5MA==");}, 
   success:function(result){ 
                               $("#view").html("<p>"+JSON.stringify(result)+"</p>");
                               $('#loadIngModal').modal('hide'); }, 
   error:function(request,errorInfo){ $('#loadIngModal').modal('hide');
                                            $("#view").html("调用接口失败"); } });

}
function TestInfo(){
     var receiveTestInfo='http://111.13.120.107:8080/PurchaseSB/Quality/Common/ProxyService/PoCommonQualityUpdateSyncRestProxy/receiveTestInfo';
     var updateTestInfo='http://111.13.120.107:8080/PurchaseSB/Quality/Common/ProxyService/PoCommonQualityUpdateSyncRestProxy/updateTestInfo';
}
function receiveTestInfo() {
        
        if (document.getElementById("upload_receiveTestInfo").files.length==0)
        {
            alert('请选择检测信息数据文件；');
            return;
        }
        var selectedFile = document.getElementById("upload_receiveTestInfo").files[0];
        var u="/receiveTestInfo";
        var name = selectedFile.name;
        var size = selectedFile.size;
        var reader = new FileReader();
         reader.readAsText(selectedFile);//读取文件的内容
        
         reader.onload = function(){
             console.log("读取结果：", this.result);
             var arr=JSON.parse(this.result);
             console.log(arr);
             console.log(arr[0]);
             //y_post(u,JSON.stringify(arr[0]));
             y_post(u,this.result);
             console.log("读取结果转为JSON：");
             let json = JSON.parse(this.result);
             console.log(json.name);
             console.log(json.age);
             //document.getElementById("upload_receiveTestInfo").value="";
         };
 
     }

function updateTestInfo() {

        if (document.getElementById("upload_receiveTestInfo").files.length==0)
        {
            alert('请选择检测成分数据文件；');
            return;
        }

        var selectedFile = document.getElementById("upload_updateTestInfo").files[0];
        var u="/updateTestInfo";
        var name = selectedFile.name;
        var size = selectedFile.size;
        var reader = new FileReader();
         reader.readAsText(selectedFile);//读取文件的内容
        
         reader.onload = function(){
             console.log("读取结果：", this.result);
             var arr=JSON.parse(this.result);
             console.log(arr);
             console.log(arr[0]);
             //y_post(u,JSON.stringify(arr[0]));
             y_post(u,this.result);
             console.log("读取结果转为JSON：");
             let json = JSON.parse(this.result);
             console.log(json.name);
             console.log(json.age);
         };
 
     }
	    