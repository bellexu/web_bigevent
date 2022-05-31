$(function() {

    let layer = layui.layer
    let form = layui.form
        //不要忘记调用
    initArtCateList()
        //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res)
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //由于script内的结构属于点击之后才会添加
    //所以要通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增列表失败')
                }
                initArtCateList()
                layer.msg('新增列表成功')
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式为 btn-edit 按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });

        let id = $(this).attr('data-id')
            // console.log(id)
            //发起请求 获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改数据失败')
                }
                layer.msg('修改数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        let id2 = $(this).attr('data-id')
            //提示用户是否要删除
        layer.confirm('确认要删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id2,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败')
                    }
                    layer.msg('删除数据成功')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})