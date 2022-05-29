$(function() {
    //调用 getUserInfo 函数 ，获取用户基本信息
    getUserInfo()

    let layer = layui.layer
        //点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        //提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //当用户选择退出，与登录事件相反，先清空token，再跳转到 login 页面
            localStorage.removeItem('token')
            location.href = '/login.html'
                //layui 中，关闭 confirm 询问框
            layer.close(index);
        })
    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //优化code，从而写在了 baseAPI.js 中
        // headers : {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用渲染用户头像
            renderAvatar(res.data)
        },
        //优化权限控制的代码, 写到 baseAPI.js 中
        //无论成功或失败，默认都会调用 complete 回调函数
        // complete : function(res) {
        //     // console.log('调用了 complete 回调函数')
        //     // console.log(res)
        //     //在 complete 回调函数中，可以使用 responseJSON 拿到服务器响应回来的数据
        //     //{"status":1,"message":"身份认证失败！"}
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空token
        //         localStorage.removeItem('token')
        //         //2.强制跳转到 login 页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1. 获取用户名称
    let name = user.nickname || user.username
        //2. 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1 渲染头像图像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2 渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}