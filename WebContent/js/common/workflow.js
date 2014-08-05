  //流程图跟踪
    function graphTrace(pid) {
        // 获取图片资源
        var imageUrl = root+"/workflow/loadbyprocessinstance?pid=" +pid + "&type=image";
        $.getJSON(root + '/workflow/traceprocess?pid=' + pid, function(infos) {
            var positionHtml = "";
            // 生成图片
            var varsArray = new Array();
            $.each(infos, function(i, v) {
                var $positionDiv = $('<div/>', {
                    'class': 'activity-attr'
                }).css({
                    position: 'absolute',
                    left: (v.x - 1),
                    top: (v.y - 1),
                    width: (v.width - 2),
                    height: (v.height - 2),
                    backgroundColor: 'black',
                    opacity: 0,
                    zIndex: $.fn.qtip.zindex - 10
                });

                // 节点边框
                var $border = $('<div/>', {
                    'class': 'activity-attr-border'
                }).css({
                    position: 'absolute',
                    left: (v.x - 1),
                    top: (v.y - 1),
                    width: (v.width - 4),
                    height: (v.height - 3),
                    zIndex: $.fn.qtip.zindex - 20
                });

                if (v.currentActiviti) {
                    $border.addClass('ui-corner-all-12').css({
                        border: '3px solid red'
                    });
                }
                positionHtml += $positionDiv.outerHTML() + $border.outerHTML();
                varsArray[varsArray.length] = v.vars;
            });

            if ($('#workflowTraceDialog').length == 0) {
                $('<div/>', {
                    id: 'workflowTraceDialog',
                    
                    title: '查看流程（按ESC键可以关闭）',
                    html: "<div><img src='" + imageUrl + "' style='position:absolute; left:0px; top:0px;' />" +
                    "<div id='processImageBorder'>" +
                    positionHtml +
                    "</div>" +
                    "</div>"
                }).appendTo('body');
            } else {
                $('#workflowTraceDialog img').attr('src', imageUrl);
                $('#workflowTraceDialog #processImageBorder').html(positionHtml);
            }

            // 设置每个节点的data
            $('#workflowTraceDialog .activity-attr').each(function(i, v) {
                $(this).data('vars', varsArray[i]);
            });

            // 打开对话框
            $('#workflowTraceDialog').dialog({
                modal: true,
                resizable: false,
                dragable: false,
                open: function() {
                    $('#workflowTraceDialog').css('padding', '0.2em');
                    $('#workflowTraceDialog .ui-accordion-content').css('padding', '0.2em').height($('#workflowTraceDialog').height() - 75);

                },
                width: document.documentElement.clientWidth * 0.95,
                height: document.documentElement.clientHeight * 0.95
            });

        });
    }