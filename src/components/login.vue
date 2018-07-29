<template>

<!--背景图-->
<div class = "note" :style = "note">
<el-button type = "primary" style = "width:100%;" @click="jump" >跳转</el-button>
<!--login框，表单+tab标签页的组合-->
<div class = "loginFrame">
 
<!--表单组件放在外面，标签栏在里面-->
    <el-form :model="account" class = "demo-ruleForm login-container">
 
<div class = "formGroup">
<el-form-item label = "账号" class = "form-inline">
    <el-input v-model="account.username"  auto-complete = "off" placeholder = "请输入您的账号" class = "form-control" ></el-input></el-form-item> 
<el-form-item label = "密码" class = "form-inline">
    <el-input v-model="account.password" auto-complete = "off" placeholder = "请输入密码" class = "form-control" ></el-input></el-form-item>
</div>
<div class = "remFor">
<el-checkbox v-model = "checked" checked class = "remember">记住密码</el-checkbox>
<a href ="''" class = "forget">忘记密码？</a>
</div>
  
  <div class = "formButton">
<el-form-item style = "width:100%;">
    <el-button type = "primary" style = "width:100%;" @click="checkuser" >登录</el-button>
</el-form-item>
</div>
    </el-form>
    </div>
    </div>
 
</template>
 
<script>
export default {
    name: 'login',
    data() {
        return {
            logining : false,
            note: {
                position:"absolute",
                top:"0px",
                left:"0px",
                width: "100%",
                height:"100%",
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                
            
            },
            account : {
                username:'',
                password:'',
            },
            checked: false,
           
        };
        
    },
    methods: {
        checkuser: function(){
            if(this.account.username === 'clp' && this.account.password == 'clp'){
                alert('login');
            }

        },
        jump: function(){
            this.$router.push('/');
        }
      },
}</script>
 
<style>
 
.login-container {
    
    -webkit-border-radius: 5px;
    border-radius: 15px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(255,255,255,0.7)
 
    ;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
   
}
label{
    width:70px;
    text-align:left;
    
    
    }
 
.form-control{
    width:270px;
    flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
 
}
.remember{
    width:250px;
    text-align:left;
 
    
}
.forget{
    width:500px;
    text-align:right;
    font-size:14px;
    font-family:PingFang SC;
    
}
.remFor{
    margin-bottom: 10px;
    padding-bottom: 10px;
}
.tabsUser{
    display: inline-block;
    margin-left: 0px;
    margin-right:0px;
    text-align:center;
    font-size:25px;
}
 
 
 
 </style>
