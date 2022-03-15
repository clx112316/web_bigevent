$(function () {
    //调用 getUserInfo() 方法获取用户信息
    getUserInfo();

    var layer = layui.layer;
    //设定退出点击事件
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
            function (index) {
                //清空本地存储中的 token
                localStorage.removeItem('token');
                //重新跳转到 登录页面
                location.href = './login.html';

                layer.close(index);
            });
    })
})

//定义 getUserInfo() 方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg = '获取用户信息失败！'
            }
            //调用 renderAvatar() 渲染用户头像
            renderAvatar(res.data);
        }
        //无论成功还是失败，最终都会调用 complete 回调函数
        // complete: function (res) {
        //     //在 complete 回调函数中，可以使用 res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //强制清空 token
        //         localStorage.removeItem('token');
        //         //强制跳转到 登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

//渲染用户头像
function renderAvatar(user) {
    //1.获取用户名称
    var name = user.nickname || user.username;
    //2.设置欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    //3.按需渲染用户头像
    if (user.user_pic != null) {
        //3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

//定义点击文章列表的方法
function clickList() {
    $('#artList').click();
}



