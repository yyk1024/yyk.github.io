'use strict';

var ossUtil = $.extend({}, ossUtil);
/**
 * 上传图片 返回url
 * @param options
 * @constructor
 */
ossUtil.ImageUploadOss = function(options){

    var opt = {
        accept:'image/png,image/gif,image/jpeg', //可以选择文件
        fileType:'.png,.gif,.jpg',
        fileSize:1024*1000,//1MB
        token:undefined,
        tokenUrl:root + "/apply.do?getUploadOssToken", //获取key地址
        prefix:"",//上传文件前缀
        before:function () {
            return true;
        },
        progress:function (p) {
            console.info( Math.floor(p * 100) + '%');
        },
        uploaded:function (res) {

        },
        then:function (res) {

        },
        catch:function (err) {
            console.info(err);
            alert("文件上传失败！");
        },
        checkError:function (tip) {
            alert(tip);
        }
    };
    /*
     token:
     accessKeyId
     accessKeySecret
     securityToken
     expiration
     expirationTime
     bucketName
     domain
     */
    $.extend(opt,options);
    var fileInput = $("<input type=\"file\" name=\"upload\" accept=\""+opt.accept+"\">").css({display:'none'}).appendTo($("body"));
    fileInput.bind("change",function(){
        var files = this.files;
        if (files && checkFile(files[0])){
            uploadFile(files[0]);
        }
    }).click();

    function uploadFile(file) {
        tencentOssUpload(file,{dir: 'h5/site/'},function (data) {
            var imgUrl = data.url
            if (data.onprogress){
                opt.progress(data.onprogress);
            }
            if (imgUrl){
                opt.then({url: imgUrl});
                opt.uploaded({url: imgUrl});
            }
        })
        // var client = new OSS({
        //     region: region,
        //     accessKeyId: opt.token.accessKeyId,
        //     accessKeySecret: opt.token.accessKeySecret,
        //     stsToken: opt.token.securityToken,
        //     bucket: opt.token.bucketName
        // });
        // var type = file.name.substring(file.name.lastIndexOf("."));
        // var key = makeKey()+type;
        // client.multipartUpload(key, file, {
        //     progress: function (p) {
        //         return function (done) {
        //             opt.progress(p);
        //             done();
        //         }
        //     }
        // }).then(function (res) {
        //     opt.then(res);
        //     opt.uploaded({url:opt.token.domain+"/"+opt.token.bucketName+res.name,name:res.name});
        // }).catch(function (err) {
        //     opt.catch(err)
        // });
    }

    /**
     * 检查文件
     * @param file
     */
    function checkFile(file) {
        if (file){
            var type = file.name.substring(file.name.lastIndexOf("."));
            if (opt.fileType.indexOf(type.toLowerCase())==-1){
                console.info("类型错误:"+type);
                opt.checkError("类型错误:"+opt.fileType);
                return false;
            }
            if (opt.fileSize<file.size){
                console.info("文件过大:"+(file.size/(1024*1000))+"MB");
                opt.checkError("文件过大:"+(file.size/(1024*1000))+"MB");
                return false;
            }
            return opt.before();
        }else {
            console.info("未检测到上传文件！");
            return false;
        }
    }
}
