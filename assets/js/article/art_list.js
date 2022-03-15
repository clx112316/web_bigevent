$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,    //页码值，默认请求第一页的数据
        pagesize: 2,    //每页显示几条数据，默认每页显示2条
        cate_id: '',    //文章分类的 Id
        state: ''     //文章发布的状态
    }

    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);

        const y = dt.getFullYear();
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());

        const hh = padZero(dt.getHours());
        const mm = padZero(dt.getMinutes());
        const ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable();
    initCate();
    //定义获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表成功！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    //定义渲染下拉选择框的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表成功！')
                }
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#formCate').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();    //调用 initTable() 方法，重新渲染table界面
    })

    //通过代理，为删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        var len = $('.btn-delete').length;
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    //当完成数据删除后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余数据了，则让页码值-1 之后
                    //再重新调用 initTable 方法
                    if (len === 1) {
                        //如果 len 的值等于 1 ，证明删除完毕后，页面上就没有数据了
                        //页码值必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })

    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号,指向存放分页的容器，值可以是容器ID、DOM对象。
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum,   //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],    //每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            //分页发生切换的时候，触发  jump 回调
            //触发 jump 回调的方式有两种：
            //1. 点击页码的时候，会触发 jump 回调
            //2.只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                //可以通过first的值，来判断是通过哪种方式，触发的jump回调
                // 如果 first 的值 是 true，则是方式2触发的
                //否则就是 方式1 触发的
                q.pagenum = obj.curr;     //把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit;      //把最新的条目数，赋值到 q 这个查询参数的 pagesize 属性中
                //根据最新的查询参数对象 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable();
                }
            }
        });
    }
})