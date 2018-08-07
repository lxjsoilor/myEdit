(function($) {
    $.fn.myEdit = function(callback) {
        var $this = $(this[0]);
        var $parent = $(this[0]).parent();
        var orignClass = $(this[0]).attr('class');
        $this.addClass('myEdit')
        $parent.css('position', 'relative');

        $this.on('click', function() {
            $this.attr('contenteditable', true);
            $parent.append(editHtml);
            $parent.append(controlHtml);
            $parent.attr('class', 'edit_control_box');
        });
        if (!isInstan) {
            $('title').after($('<style>.edit_bar{position:absolute;top:-33px;left:0px;width:450px;height:auto;border-radius:3px;background:rgba(0,0,0,1);padding:5px;}.edit_bar button{float:left;font-weight:bold;width:auto;height:auto;background:#333;color:#fff;margin:0 2px;padding:3px 5px;text-align:center;border-radius:1px;font-family:"Courier New";border:none;}.edit_bar button:hover{background:#fff;color:#000;cursor:pointer;}.edit_bar .imgMenu,.edit_bar .fontFamilyMenu{display:none;position:absolute;z-index:9111;right:0;top:30px;border:1px solid #111;background:#333;padding:3px;}.img_border{display:inline-block;position:relative;font-size:0px;line-height:0px;}.img_border>div{width:10%;height:10%;display:inline-block;position:absolute;cursor:move;}.img_border .left_top{left:0px;top:0px;cursor:nw-resize;}.img_border .left_center{height:80%;left:0px;top:50%;transform:translateY(-50%);cursor:w-resize;}.img_border .left_bottom{left:0px;bottom:0px;cursor:ne-resize;}.img_border .top_center{width:80%;left:50%;transform:translateX(-50%);top:0px;cursor:s-resize;}.img_border .right_top{right:0px;top:0px;cursor:ne-resize;}.img_border .right_center{height:80%;right:0px;top:50%;transform:translateY(-50%);cursor:w-resize;}.img_border .right_bottom{right:0px;bottom:0px;cursor:nw-resize;}.img_border .bottom_center{width:80%;left:50%;transform:translateX(-50%);bottom:0px;cursor:s-resize;}.edit_control_box>.myEdit{display:inline-block;word-break:break-all;overflow-x:visible;overflow-y:hidden;width:100%;font-size:16px;margin:0px;}.edit_control_box{padding:1px;position:relative;display:inline-block;font-size:0px;}.edit_control{}.edit_control_right_bottom{width:10px;height:10px;position:absolute;right:-10px;bottom:-10px;cursor:nw-resize;}.edit_control_right{width:10px;height:100%;position:absolute;right:-10px;top:0px;cursor:w-resize;}.edit_control_bottom{width:100%;height:10px;position:absolute;left:0px;bottom:-10px;cursor:s-resize;}</style>'))
            isInstan = true;
        }
        $(document).on('click', '.' + orignClass + '~.edit_bar button', function(e) {

            e.stopPropagation();
            var dataId = $(this).attr('data-id');
            switch (dataId) {
                case "fontset":
                    $('.fontFamilyMenu').show();
                    $('.imgMenu').hide();
                    break;
                case "link":
                    var link = prompt("填写链接地址:", "http://");
                    if (link && link != '' && link != 'http://') {
                        document.execCommand('createLink', false, link);
                    }
                    break;
                case 'FontName':
                    var val = $(this).attr("data-value");
                    document.execCommand(dataId, false, val);
                    $('div.fontFamilyMenu').remove();
                    break;
                case 'fileSelect':
                    $('.fontFamilyMenu').hide();
                    $('.imgMenu').show();
                    break;
                case 'localImg':
                    // 解决图片重复创建问题
                    var canLoad = true;
                    window.URL = window.URL || window.webkitURL;
                    if ($('#fileElem')[0]) {
                        $('#fileElem')[0].click();
                    }
                    e.preventDefault();

                    $(document).on('change', '#fileElem', function(ev) {
                        var reader = new FileReader();
                        var AllowImgFileSize = 2100000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
                        var file = ev.target.files[0];
                        var imgUrlBase64;
                        if (file) {
                            imgUrlBase64 = reader.readAsDataURL(file);
                            reader.onload = function(e) {
                                if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
                                    alert('上传失败，请上传不大于2M的图片！');
                                    return;
                                } else {
                                    document.execCommand("insertimage", 0, reader.result);
                                }
                            }
                        };
                    });
                    break;
                case 'srcImg':
                    var src = prompt("填写图片链接地址:");
                    if (!!src) {
                        document.execCommand("insertimage", 0, src);
                    };
                    break;
                case 'save':
                    $this.attr('contenteditable', false);
                    $('.' + orignClass + '~.edit_bar').remove();
                    if (typeof callback == 'function') {
                        callback($('.' + orignClass).html());
                    }
                    break;
                default:
                    document.execCommand(dataId, false, null);
                    break;
            };
        });
        $(document).on('click', function(e) {
            $('.fontFamilyMenu').hide();
            $('.imgMenu').hide();
        });
        $(document).on('mousedown', 'img[src]', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).parent().attr('class') != 'img_border') {
                var imgHtml = $(
                    '<div class="img_border"><div class="left_top"></div><div class="left_center"></div><div class="left_bottom"></div><div class="top_center"></div><div class="right_top"></div><div class="right_center"></div><div class="right_bottom"></div><div class="bottom_center"></div></div> ;'
                );
                imgHtml.append($(this).clone());
                $(this).replaceWith(imgHtml);
                $(this).remove();
            }
        });
        //图片缩放
        $(document).on('mousedown', '.img_border>div', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var canStretch = true;
            var imgObj = $(this).parent('.img_border').children('img');
            var orignHeight = imgObj.height();
            var orignWidth = imgObj.width();

            var scale = orignHeight / orignWidth;

            var startX = e.pageX;
            var startY = e.pageY;
            var distX = 0;

            switch ($(this).attr('class')) {
                case 'right_center':
                    $(document).on('mousemove', function(e) {
                        if (!canStretch) return;
                        distX = startX - e.pageX;
                        imgObj.css('width', (orignWidth - distX) + 'px');
                        imgObj.css('height', orignHeight)
                    });
                    $(document).on('mouseup', function(e) {
                        canStretch = false;
                        imgObj.css('border-width', '0px');
                    });
                    break;
                case 'left_center':
                    $(document).on('mousemove', function(e) {
                        if (!canStretch) return;
                        distX = startX - e.pageX;
                        imgObj.css('width', (orignWidth + distX) + 'px');
                        imgObj.css('height', orignHeight)
                    });
                    $(document).on('mouseup', function(e) {
                        canStretch = false;
                        imgObj.css('border-width', '0px');
                    });
                    break;
                case 'right_bottom':
                case 'right_top':

                    $(document).on('mousemove', function(e) {
                        if (!canStretch) return;
                        distX = startX - e.pageX;
                        imgObj.css('width', (orignWidth - distX) + 'px');
                        imgObj.css('height', (orignWidth - distX) * scale + 'px');
                    });
                    $(document).on('mouseup', function(e) {
                        canStretch = false;
                        imgObj.css('border-width', '0px');
                    });
                    break;
                case 'left_bottom':
                case 'left_top':
                    $(document).on('mousemove', function(e) {
                        if (!canStretch) return;
                        distX = startX - e.pageX;
                        imgObj.css('width', (orignWidth + distX) + 'px');
                        imgObj.css('height', (orignWidth + distX) * scale + 'px')
                    });
                    $(document).on('mouseup', function(e) {
                        canStretch = false;
                        imgObj.css('border-width', '0px');
                    });
                    break;
                case 'top_center':
                    $(document).on('mousemove', function(e) {
                        if (!canStretch) return;
                        distY = startY - e.pageY;
                        imgObj.css('height', (orignHeight + distY) + 'px');
                        imgObj.css('width', orignWidth + 'px')
                    });
                    $(document).on('mouseup', function(e) {
                        canStretch = false;
                        imgObj.css('border-width', '0px');
                    });
                    break;
                case 'bottom_center':

                    $(document).on('mousemove', function(e) {
                        if (!canStretch) return;
                        distY = startY - e.pageY;
                        imgObj.css('height', (orignHeight - distY) + 'px');
                        imgObj.css('width', orignWidth + 'px')
                    });
                    $(document).on('mouseup', function(e) {
                        canStretch = false;
                        imgObj.css('border-width', '0px');
                    });
                    break;
                default:
                    break;
            }
        });


        // 输入框缩放

        $(document).on('mousedown', '.edit_control', function(e) {
            var canStretch = true;
            var _this = $(this);
            var editBox = $(this).parent().children('.myEdit');
            var orignWidth = editBox.width();
            var orignHeight = editBox.height();

            var startX = e.pageX;
            var startY = e.pageY;
            var distX = 0;
            var distY = 0;
            _this.parent().addClass("currentEdit");
            $(document).on('mousemove', function(e) {
                if (!canStretch) return;
                _this.parent().addClass("currentEdit");
                distX = startX - e.pageX;
                distY = startY - e.pageY;
                if (_this.hasClass('edit_control_right')) {
                    distY = 0;
                } else if (_this.hasClass('edit_control_bottom')) {
                    distX = 0;
                }
                editBox.width(orignWidth - distX);
                editBox.height(orignHeight - distY);
            });
            $(document).on('mouseup', function(e) {
                if (canStretch) {
                    $("div.edit_control_box").removeClass("currentEdit");
                };
                canStretch = false;
            });

        })
    };
})(jQuery);

var editHtml = '<div class="edit_bar">\
                    <input type="file" id="fileElem" multiple accept="image/*" style="display:none;">\
                    <button data-id="undo">Undo</button>\
                    <button data-id="redo">Redo</button>\
                    <button data-id="bold">Bold</button>\
                    <button data-id="underline">Underline</button>\
                    <button data-id="link">Link</button>\
                    <button id="fileSelect" data-id="fileSelect">Image</button>\
                    <button data-id="fontset">fontSet</button>\
                    <button data-id="save">Save</button>\
                    <div class="fontFamilyMenu" draggable="false">\
                        <button data-id="FontName" data-value="Microsoft YaHei">微软雅黑</button>\
                        <button data-id="FontName" data-value="SimSun">宋体</button>\
                    </div>\
                    <div class="imgMenu" draggable="false" style="margin-left:-90px;">\
                        <button data-id="localImg" data-value="localImg">本地图片</button>\
                        <button data-id="srcImg" data-value="srcImg">图片链接</button>\
                    </div>\
                </div>';

var controlHtml = '<div class="edit_control edit_control_right"></div>\
                    <div class="edit_control edit_control_right_bottom"></div>\
                    <div class="edit_control edit_control_bottom"></div>';
var isInstan = false;

console.log(32453242423);