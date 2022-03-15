$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCate();
    //定义加载文章分类的方法
    function initArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //调用 form.render() 重新渲染表单
                form.render();
            }
        })
    }
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面添加点击事件
    $('#select-bgc').on('click', function () {
        $('#file').click();
    })

    //监听file文件的change 事件
    $('#file').on('change', function (e) {
        //1.获取到文件的列表数组
        var file = e.target.files;
        //判断用户是否选择了文件
        if (file.length === 0) {
            return layer.msg('请选择图片！')
        }
        //2.根据选择的文件，创建一个对应的 URL 地址
        var imgURL = URL.createObjectURL(file[0]);
        //3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image.cropper('destroy')   //销毁旧的裁剪区域
            .attr('src', imgURL)   //重新绘制图片路径
            .cropper(options)    //重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布';
    //为存为草稿按钮绑定点击事件
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    })

    //监听表单的submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //定义 FormData对象
        var formdata = new FormData($(this)[0]);
        //将文章发布状态添加到FormData对象中
        formdata.append('state', art_state);
        //将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件对象存储到FormData对象中
                formdata.append('cover_img', blob);
                //发起Ajax请求
                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    data: formdata,
                    processData: false,  // 不处理数据
                    contentType: false,   // 不设置内容类型
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('文章发布失败！')
                        }
                        layer.msg('文章发布成功！');
                        window.parent.clickList();   //调用父元素中的clickList方法，模拟点击文章列表
                        // location.href = '/article/art_list.html';
                    }
                })
            })

    })
})