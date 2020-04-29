function initUpload(inputId, arr, imgArr) {
    var prevImgsPath = []; //初始化图片预览
    var prevConfigArr = [];// 初始化预览图片信息
    if (imgArr && imgArr.length > 0) {
        $.each(imgArr, function () {
            prevImgsPath.push(this.filePath);
            arr[this.fileId] = this;
            var prevConfig = {
                filetype: this.fileType,
                caption: this.originName,
                size: this.fileSize,
                type: 'image',
                key: this.fileId,
                extra: {
                    id: this.fileId
                }
            };
            prevConfigArr.push(prevConfig);

        })

    }

    $("#" + inputId).fileinput({
        'theme': 'explorer-fas',
        'uploadUrl': '/common/upload/image',
        overwriteInitial: false,
        initialPreviewAsData: true,
        showClose: false,
        maxFileSize: 10240, //最大文件大小10240KB(10M)，如果不设置，默认大小25M
        allowedFileTypes: ['image'],
        allowedFileExtensions: ['jpg', 'jpeg', 'png', 'gif'],
        maxFileCount: 5,
//            uploadExtraData: {
//                folderName: folderName
//            },
        initialPreview: prevImgsPath,
        initialPreviewConfig: prevConfigArr,
        deleteUrl: '/base/fileInfo/remove',
//            deleteExtraData:function(data){
//                console.log('deleteExtraData',data)
//            },
    }).on('filepreupload', function (event, data, previewId, index) {     //上传中
//                console.log('文件正在上传');
    }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
        console.log('文件上传成功', data);
        var res = data.response;
        if (res && res.code === 0) {
            var file = data.files[index];
            var fileInfo = {};
            fileInfo.originName = file.name;
            fileInfo.fileSize = file.size;
            fileInfo.fileType = file.type;
            fileInfo.relationType = 'cert_img';
            fileInfo.filePath = res.fileName;
            var name = res.fileName.substr(res.fileName.lastIndexOf('/') + 1, res.fileName.length);
            fileInfo.fileName = name;
            arr[previewId] = fileInfo;
        }


    }).on('fileerror', function (event, data, msg) {  //一个文件上传失败
        console.log('文件上传失败！', data);


    }).on('fileremoved', function (event, id, index) {
        //未上传的文件删除
    }).on('filedeleted', function (event, key, jqXHR, data) {
        //预加载的文件删除
        delete arr[key];
    }).on('filesuccessremove', function (event, id) {
        // 删除本页面上传成功的图片
        delete arr[id];
    }).on('filecleared', function (event) {
        //文件全部清除
        arr = {};
    }).on('filereset', function (event) {
        console.log("filereset");
    });
}

function alertUpload(inputId, msg) {
    var filesCount = $('#' + inputId).fileinput('getFilesCount');
    if (filesCount > 0) {
        $.modal.alertWarning("有" + filesCount + msg + "张图片未上传");
        return false;
    }
    return true;
}

function image(uploadDivId) {
    var inputVal=$("#"+uploadDivId+" :input[type=hidden]:first");
    var uploadFlag=$("#"+uploadDivId+" :input[name=uploadFlag]");
    var preview=$("#"+uploadDivId+" .fileinput-preview");
    var control=preview.parent();
    $("#"+uploadDivId+" .clearImg").click(function () {
        inputVal.val("");
        preview.empty();
        control.removeClass("fileinput-exists");
        control.addClass("fileinput-new");
        if(uploadFlag.length==1){
            uploadFlag.val("0");
        }

    })
    $('#'+uploadDivId+' :input[type=file]').on('change.bs.fileinput', function (e) {
        var file = $(this)[0].files[0];

        if (file == undefined || file == null || file == "") {
            inputVal.val("");
            return;
        }
        var formData = new FormData();
        formData.append('file', file);

        $.ajax({
            url: ctx + 'common/upload/image',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            accept: 'images',
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.code == 0) {
                    var img = "<image src='" + data.fileName + "'/>"
                    preview.empty();
                    preview.append(img)
                    control.removeClass("fileinput-new");
                    control.addClass("fileinput-exists");
                    inputVal.val(data.fileName);
                    if(uploadFlag.length==1){
                        uploadFlag.val("1");
                    }
                    layer.msg("上传成功");
                } else {
                    inputVal.val("");
                    layer.msg("上传失败");
                }
            },
            error: function (data) {
                layer.msg(data.msg);
            }
        });
    });
}

function changeImage(uploadDivId,imageUrl){
    var inputVal=$("#"+uploadDivId+" :input[type=hidden]:first");
    var preview=$("#"+uploadDivId+" .fileinput-preview");
    var control=preview.parent();
    if(imageUrl){
        var img = "<image src='" + imageUrl+ "'/>"
        preview.empty();
        preview.append(img)
        control.removeClass("fileinput-new");
        control.addClass("fileinput-exists");
        inputVal.val(imageUrl);
    }else{
        inputVal.val("");
        preview.empty();
        control.removeClass("fileinput-exists");
        control.addClass("fileinput-new");
    }

}