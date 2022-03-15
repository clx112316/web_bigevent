// 点击"去注册账号"的链接
$(function () {
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })

    // 点击"去登录"的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    //自定义表单验证规则
    var form = layui.form;    //从 layui中获取form对象
    var layer = layui.layer;    //从 layui中获取layer对象
    form.verify({
        //自定义一个 pwd 的密码校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容
            //通过属性选择器获取密码框中的内容
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认提交事件
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        //发起 post 请求
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录~', {
                time: 2000    //设定关闭时间
            }, function () {
                $('#link_login').click();
            });
        })
    })

    //监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // 发起 Ajax 请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功!', {
                    time: 2000
                }, function () {
                    //将登录成功后得到的 token 字符串，保存到 LocationStorage 中
                    localStorage.setItem('token', res.token);
                    //跳转到后台主页
                    window.location.href = './index.html';
                })
            }
        })
    })
})