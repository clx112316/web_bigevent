$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //定义表单校验规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间！';
            }
        }
    })

    initUserInfo();
    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                //调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    //为表单添加重置效果
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //调用 initUserInfo() 方法，重新获取用户的基本信息
        initUserInfo();
    })

    //更新用户信息
    $('.layui-form').on('submit', function (e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //发起 Ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！', { time: 2000 }, function () {
                    // 调用父页面中的方法，重新渲染用户的头像和用户信息
                    window.parent.getUserInfo();
                })
            }
        })
    })
})

