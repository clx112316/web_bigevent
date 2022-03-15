$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    //为添加分类按钮添加点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })
    //通过代理，监听添加文章分类表单的提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList();
                layer.msg('新增文章分类成功！')
                //根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    //因为修改按钮是动态添加，所以通过代理为修改按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });

        //发起Ajax请求
        var id = $(this).attr('data-id');   //获取id
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        })
    })

    //通过代理，监听修改表单的提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                initArtCateList();
                layer.msg('更新分类信息成功！');
                //根据索引，关闭对应的弹出层
                layer.close(indexEdit);
            }
        })
    })

    //因为删除按钮是动态添加，所以通过代理为修改按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})