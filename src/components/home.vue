<template>
    <div class="container">
        <el-container class="main">
            <el-aside :width="tabWidth+'px'">
                <div>
                    <div class="isClossTab" @click="isClossTabFun">
                        <i :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" ></i>
                    </div>

                    <el-menu :class="'menu'" :default-active="defaultActiveIndex" router :collapse="isCollapse" @select="handleSelect">
                        <el-menu-item index="/Dashboard">
                            <i class="el-icon-tickets"></i>
                            <span slot="title">首页</span>
                        </el-menu-item>
                        <el-menu-item index="/Order">
                            <i class="el-icon-menu"></i>
                            <span slot="title">生成订单</span>
                        </el-menu-item>
                        <el-menu-item index="/DataOper">
                            <i class="el-icon-tickets"></i>
                            <span slot="title">药品管理</span>
                        </el-menu-item>                        
                        <el-menu-item index="/OrderManage">
                            <i class="el-icon-setting"></i>
                            <span slot="title">订单管理</span>
                        </el-menu-item>
                    </el-menu>
                </div>
            </el-aside>
            <el-container>
                <el-header class="main-header">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <img src="" alt="">
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main>
                    <div>
                        <router-view></router-view>
                    </div>
                </el-main>

            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: false,
                tabWidth: 150,
                intelval: null,
                defaultActiveIndex: "/",
            };
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelect(index){
                this.defaultActiveIndex = index;
            },
            isClossTabFun(){
                clearInterval(this.intelval);
                if(!this.isCollapse){
                    this.intelval = setInterval(()=>{
                        if(this.tabWidth<= 64)
                            clearInterval(this.intelval);
                        this.tabWidth -= 1;
                    }, 1);
                }else{
                    this.tabWidth = 150;
                }
                this.isCollapse = !this.isCollapse;
            }
        }
    }
</script>
<style>
    *{
        padding: 0;
        margin: 0;
    }

</style>
<style scoped lang="scss">

    $header-height:60px;
    $background-color: #29aa99;
    $color: #FFF;

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }
    .main{
        height: calc(100vh - 60px);
        min-width: 800px;
        min-height: 600px;
        overflow: hidden;

        aside{
            overflow: visible;
            height: 100%;
            background-color: $background-color;
            color: #FFF;

            .isClossTab{
                width: 100%;
                height: $header-height;
                cursor: pointer;
                font-size: 25px;
                text-align: center;
                line-height: $header-height;
                font-weight: bold;
                border-right: 1px solid #807c7c;
                box-sizing: border-box;
            }
            .menu {
                width: 100%;
                border-right:0;


            }

        }

        .main-header {
            background-color: $background-color;
            color: $color;

            .el-dropdown{
                cursor: pointer;
                float: right;
            }
            .el-dropdown-link{

                img{
                    $imgMargin: (($header-height - 50)/2);
                    display:inline-block;
                    width:50px;
                    height: 50px;
                    border-radius: 25px;
                    background-color: #FFF;
                    margin-top: $imgMargin;
                }
            }
        }

        .crumbs {
            margin-bottom: 20px;
        }

        .main-footer{
            text-align: center;
            background-color: $background-color;
            color: $color;
            line-height: 50px;
        }

    }

</style>

