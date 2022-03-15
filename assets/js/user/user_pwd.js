$(function () {
    var form = layui.form;
    var layer = layui.layer;

    //为表单添加校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码长度必须在6~12位之间，且不能出现空格'],
        samePwd: function (value) {
            if ($('[name=oldPwd]').val() === value) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function (value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次新密码不一致！'
            }
        }
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        //发起 Ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('重置密码失败！')
                }
                layer.msg('重置密码成功！', { time: 2000 }, function () {
                    //原生的form DOM对象存在reset(),将jQuery对象转换为DOM对象
                    $('.layui-form')[0].reset();
                })
            }
        })
    })
})