/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

$(function() {
    ///幼儿一寸照片
    $("#avatar").on("click",function() {
        ossUtil.ImageUploadOss({
            uploaded:function (res) {
                $("#avatar_img_url").val(res.url);
                $("#avatar_url").val(res.url);
                alert("上传成功!");
            }
        });
    });

    //房产证照片
    $("#fczzp").on("click",function() {
        ossUtil.ImageUploadOss({
            uploaded:function (res) {
                $("#fczzp_img_url").val(res.url);
                $("#fczzp_url").val(res.url);
                alert("上传成功!");
            }
        });
    });



    //户口本首页
    $("#hkbzp_home").on("click",function() {
        ossUtil.ImageUploadOss({
            uploaded:function (res) {
                $("#hkbzp_home_img_url").val(res.url);
                $("#hkbzp_home_url").val(res.url);
                alert("上传成功!");
            }
        });
    });


    //户口本户主页
    $("#hkbzp_m").on("click",function() {
        ossUtil.ImageUploadOss({
            uploaded:function (res) {
                $("#hkbzp_m_img_url").val(res.url);
                $("#hkbzp_m_url").val(res.url);
                alert("上传成功!");
            }
        });
    });


    //户口本本人页
    $("#hkbzp").on("click",function() {
        ossUtil.ImageUploadOss({
            uploaded:function (res) {
                $("#hkbzp_img_url").val(res.url);
                $("#hkbzp_url").val(res.url);
                alert("上传成功!");
            }
        });
    });

    //出生证明照片
    $("#cszzp").on("click",function() {
        ossUtil.ImageUploadOss({
            uploaded:function (res) {
                $("#cszzp_img_url").val(res.url);
                $("#cszzp_url").val(res.url);
                alert("上传成功!");
            }
        });
    });

});
