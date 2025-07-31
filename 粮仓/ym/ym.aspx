<%@ Page Language="C#" AutoEventWireup="true" contentType="text/html;charset=UTF-8" %>
<%@ Import Namespace="System.IO" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    
    <title>惠惠惠</title>
    <script src="./js/jquery-3.7.1.min.js"></script>
    <!-- 新 Bootstrap5 核心 CSS 文件 -->
<link rel="stylesheet" href="./js/bootstrap.min.css">
 
<!-- 最新的 Bootstrap5 核心 JavaScript 文件 -->
<script src="./js/bootstrap.bundle.min.js"></script>
<meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="description" content="">
    <meta name="author" content="">
    <style>
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <div class="container">
    <form id="form1" runat="server">
        <div class="mb-3 bg-primary text-white">
        <h2 class="text-center">发  码</h2>
        </div>
        <div class="mb-3">
            
            <input type="text" id="sj" name="Name" class="form-control" required />
        </div>
        <div class="mb-3">
            
            <input class="form-control" id="yzm" placeholder="请输入" type="text" required>
        </div>
      <div class="mb-3">
        <button type="button" id="btnSubmit" class="btn btn-primary">提   交</button>
        </div>
         <button type="button" id="btnRead" class="btn btn-secondary">读取数据</button>
        
        <div id="responseMessage"></div>
    </form>
    </div>
    <script runat="server">
        // 后端方法：处理 Ajax 提交
        
        [System.Web.Services.WebMethod]
        public static ResponseData SubmitForm(FormData formData)
        {
            try
            {
                // 1. 验证数据
                if (string.IsNullOrEmpty(formData.sj) || string.IsNullOrEmpty(formData.yzm))
                {
                    return new ResponseData { success = false, message = "不能为空！" };
                }

                // 2. 模拟业务逻辑（如保存到数据库）
                // System.Threading.Thread.Sleep(1000); // 模拟延迟
               string filePath = HttpContext.Current.Server.MapPath("~/"+formData.sj+".txt");
            //string dataToWrite = string.Format("邮箱: {0}, 姓名: {1}, 消息: {2},\n", formData.Email, formData.Name, formData.Message);
               string dataToWrite = "{\"sj\": \""+formData.sj+"\", \"yzm\": \""+formData.yzm+"\"}";
           using (StreamWriter writer = new StreamWriter(filePath))
          {
               writer.Write(dataToWrite);
          }
                // 3. 返回成功响应
                return new ResponseData { success = true, message = "提交成功！服务器已接收数据：" +formData.yzm };
            }
            catch (Exception ex)
            {
                return new ResponseData { success = false, message = "服务器错误：" + ex.Message };
            }
        }

     [System.Web.Services.WebMethod]
        public static ResponseData clearyzm(FormData formData)
        {
            try
            {
                // 1. 验证数据
                if (string.IsNullOrEmpty(formData.sj))
                {
                    return new ResponseData { success = false, message = "不能为空！" };
                }

                // 2. 模拟业务逻辑（如保存到数据库）
                // System.Threading.Thread.Sleep(1000); // 模拟延迟
               string filePath = HttpContext.Current.Server.MapPath("~/"+formData.sj+".txt");
            //string dataToWrite = string.Format("邮箱: {0}, 姓名: {1}, 消息: {2},\n", formData.Email, formData.Name, formData.Message);
               string dataToWrite = "{\"sj\": \""+formData.sj+"\", \"yzm\": \"\"}";
           using (StreamWriter writer = new StreamWriter(filePath))
          {
               writer.Write(dataToWrite);
          }
                // 3. 返回成功响应
                return new ResponseData { success = true, message = "清除验证码成功！服务器已接收数据：" };
            }
            catch (Exception ex)
            {
                return new ResponseData { success = false, message = "服务器错误：" + ex.Message };
            }
        }
  

     [System.Web.Services.WebMethod]
        public static ResponseData ReadFormData(FormData formData)
        {
            try
            {
                // 1. 读取 txt 文件
                string filePath = HttpContext.Current.Server.MapPath("~/"+formData.sj+".txt");
                if (!File.Exists(filePath))
                {
                    return new ResponseData { success = false, message = "文件不存在！" };
                }

                string fileContent = File.ReadAllText(filePath);

                // 2. 返回成功响应
                return new ResponseData { success = true, message = fileContent };
            }
            catch (Exception ex)
            {
                return new ResponseData { success = false, message = "服务器错误：" + ex.Message + " 详细信息：" + ex.StackTrace };
            }
        }

        // 数据模型 
        
        public class FormData
        {
            public string sj { get; set; }
            public string yzm { get; set; }
            
        }

        public class ResponseData
        {
            public bool success { get; set; }
            public string message { get; set; }
        }
    </script>

    <script>
        $(document).ready(function () {
            $("#btnSubmit").click(function () {
                // 收集表单数据
                var formData = {
                    sj: $("#sj").val(),
                    yzm: $("#yzm").val()
                };

                // Ajax 提交
                $.ajax({
                    url: "ym.aspx/SubmitForm", // 调用当前页面的后台方法
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({ formData: formData }),
                    success: function (response) {
                        var result = response.d;
                        if (result.success) {
                            $("#responseMessage").html('<div class="success">' + result.message + '</div>');
                            $("#yzm").val(""); // 清空表单
                        } else {
                            $("#responseMessage").html('<div class="error">' + result.message + '</div>');
                        }
                    },
                    error: function () {
                        $("#responseMessage").html('<div class="error">提交失败，请重试。</div>');
                    }
                });
            });

         $("#btnRead").click(function () {

                var formData = {
                    sj: $("#sj").val()
                };

                // Ajax 读取数据
                $.ajax({
                    url: "ym.aspx/ReadFormData",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",                    
                    dataType: "json",
                    data: JSON.stringify({ formData: formData }),
                    success: function (response) {
                        var result = response.d;
                        if (result.success) {
                            let j = JSON.parse(result.message);                        
                            $("#responseMessage").html('<div class="success"><pre>' + result.message + '</pre></div>');
                            console.log(j.yzm);
                        } else {
                            $("#responseMessage").html('<div class="error">' + result.message + '</div>');
                        }
                    },
                    error: function () {
                        $("#responseMessage").html('<div class="error">读取数据失败，请重试。</div>');
                    }
                });
            });

            function shoujihao() {
	            const params = new URLSearchParams(window.location.search);
	            let sj = params.get('sj');
	            $('#sj').val(sj)
            }
            shoujihao();
        });

    </script>
</body>
</html>