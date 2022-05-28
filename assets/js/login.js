$(function(){
    //点击 “去注册账号” 的链接
    $('#link_reg').on('click', function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击 “去登录” 的链接
    $('#link_login').on('click', function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从 Layui 获取 form 对象
    let form = layui.form
    let layer = layui.layer
    //通过 form.verify() 来自定义校验规则
    form.verify({
        pwd : [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
          ],
        //   校验两次密码是否一致的规则
        repwd : function(value) {
              //通过形参拿到的是确认密码的内容
              //还需要拿到密码框内的内容
              //然后进行一次等于的判断
              //如果判断失败，则 return 一个提示消息即可
              let pwd = $('.reg-box [name=password]').val()
              if(pwd !== value) {
                  return '两次密码不一致'
              }
          }  
    })
     
    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        let data = { username : $('#form_reg [name=username]').val(), password : $('#form_reg [name=password]').val()}
        $.post('/api/reguser', data, function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            //模拟人的点击行为
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url : '/api/login',
            method : 'POST',
            data : $(this).serialize(),
            success : function(res) {
                if(res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // console.log(res.token)
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })



})