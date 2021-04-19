<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单 -->
      <el-form class="login_form" label-width="0px" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名  prop验证规则-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login(loginForm)">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginRequest } from 'network/login'

export default {
  name: 'Login',
  data() {
    return {
      //登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单验证规则
      loginFormRules: {
        username: [
          //required->必填项  message->提示消息  trigger->触发时机,输入框失去焦点时触发
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    login(loginForm) {
      /* 
        validate 方法  对整个表单进行验证 验证通过返回true 否则返回false
      */
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return //验证为false返回,否则继续
        loginRequest(loginForm).then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error('登录失败!') //$message.error  element组件的提示消息方法
          }
          this.$message.success('登录成功')
          /* 
            1.将登录成功之后的 token 保存到客户端的 sessionStorage 中
              1.1.登陆中除了登陆之外的其他 API 接口,必须在登录后才能访问
              1.2.token 只应该在当前网站打开期间有效,所有将 token 保存在 sessionStorage 中
            2.通过路由跳转到后台主页,路由地址是 /home
          */
          window.sessionStorage.setItem('token', res.data.token) //把 token 记录在 sessionStorage 中
          this.$router.push('/home') //跳转到 home
        })
      })
    },
    //重置表单
    /* 
        1.给表单添加 ref引用 ref的值就是表单组件的实例对象
        2.通过 this.$refs 访问到表单组件实例对象loginFormRef
        3.通过 resetFields 方法重置表单 
      */
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  /* 居中  position left top transform*/
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}</style
>>
