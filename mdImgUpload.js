function initPasteDragImg(Editor){
    var doc = document.getElementById(Editor.id)
    doc.addEventListener('paste', function (event) {
        var items = (event.clipboardData || window.clipboardData).items;
        var file = null;
        if (items && items.length) {
            // 搜索剪切板items
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    file = items[i].getAsFile();
                    break;
                }
            }
        } else {
            console.log("当前浏览器不支持");
            return;
        }
        if (!file) {
            console.log("粘贴内容非图片");
            return;
        }
        uploadImg(file,Editor);
    });

    var dashboard = document.getElementById(Editor.id)
    dashboard.addEventListener("dragover", function (e) {
        e.preventDefault()
        e.stopPropagation()
    })
    dashboard.addEventListener("dragenter", function (e) {
        e.preventDefault()
        e.stopPropagation()
    })
    dashboard.addEventListener("drop", function (e) {
        e.preventDefault()
        e.stopPropagation()
     var files = this.files || e.dataTransfer.files;
     uploadImg(files[0],Editor);
     })
}
function uploadImg(file,Editor){
    var formData = new FormData();
    var fileName=new Date().getTime()+"."+file.name.split(".").pop();
    formData.append('editormd-image-file', file, fileName);

    $.ajax({
        url: Editor.settings.imageUploadURL,
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (msg) {

            var success=msg['success'];
            if(success==1){
                var url=msg["url"];
                if(/\.(png|jpg|jpeg|gif|bmp|ico)$/.test(url)){
                    Editor.insertValue("![图片alt]("+msg["url"]+" ''图片title'')");
                }else{
                    Editor.insertValue("[下载附件]("+msg["url"]+")");
                }     
            }else{
                console.log(msg);
                alert("上传失败");
            }
        }
    });


}

//使用方法
//1.页面引入uploadImg.js
<script src="uploadImg.js" type="text/javascript"></script>

// 2.editor.md配置开启图片上传功能,onload事件里面初始化插件
var testEditor = editormd("test-editormd", {
    width: "90%",
    height: 740,
    path : '../lib/',
    theme : "dark",
    previewTheme : "dark",
    editorTheme : "pastel-on-dark",
    codeFold : true,
    saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
    searchReplace : true,

    imageUpload : true, //必须
    imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    imageUploadURL : "./php/upload.php", //必须
    onload : function() {
        initPasteDragImg(this); //必须

    }
});