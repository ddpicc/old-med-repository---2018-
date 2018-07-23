<template lang="html">

  <div class="list">
    <el-input  placeholder="请输入关键字" icon="search"  class="search"  v-model="search" ></el-input>
      <el-table
    :data="tables"
    stripe
    element-loading-text="拼命加载中"
    header-row-class-name="tableHeader"
    v-loading.fullscreen.lock="loading"
    empty-text="亲，暂时没有数据哦"
    border
    style="width: 100%">
            <el-table-column
            fixed
            prop="medname"
            label="药品名称"
            align="center"
            width="120">
            </el-table-column>
            <el-table-column
            prop="alias"
            label="别名"
            align="center"
            width="100">
            </el-table-column>
            <el-table-column
            prop="spec"
            label="规格"
            align="center"
            width="100">
            </el-table-column>
            <el-table-column
            prop="count"
            label="数量"
            align="center"
            width="100">
            </el-table-column>
            <el-table-column
            prop="baseprice"
            label="进价"
            align="center"
            width="150">
            </el-table-column>
            
            <el-table-column
            prop="sellprice"
            label="零售价"
            align="center"
            width="150">
            </el-table-column>
            <el-table-column
            prop="profit"
            label="利润"
            align="center"
            width="150">
            </el-table-column>
            <el-table-column
            label="操作"
            align="center"
            width="360">
            <template slot-scope="scope">
                <el-button  size="small" type="success" @click="modify(scope.row)">修改</el-button>
                <el-button type="danger" size="small" @click="deleteDate(scope.row['_id'])">删除</el-button>
            </template>
            </el-table-column>
  </el-table>
  

    <!-- 新增数据 -->
  <el-dialog title="新增数据" :visible.sync="addFormVisible" class="addArea" modal custom-class="addFormArea" @close="closeAdd">
  <el-form :model="addForm" class="addForm">

    <el-form-item label="药品名称" :label-width="formLabelWidth">
      <el-input v-model="addForm.medname" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="别名" :label-width="formLabelWidth">
      <el-input v-model="addForm.alias" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="规格" :label-width="formLabelWidth">
      <el-input v-model="addForm.spec" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="数量" :label-width="formLabelWidth">
      <el-input v-model="addForm.count" auto-complete="off"></el-input>
    </el-form-item>

     <el-form-item label="进价" :label-width="formLabelWidth">
      <el-input v-model="addForm.baseprice" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="零售价" :label-width="formLabelWidth">
      <el-input v-model="addForm.sellprice" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="利润" :label-width="formLabelWidth">
      <el-input v-model="addForm.profit" auto-complete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addSure">确 定</el-button>
  </div>
</el-dialog>

<!-- 修改数据 -->
  <el-dialog title="修改数据" :visible.sync="modifyFormVisible" class="addArea" modal custom-class="addFormArea">
  <el-form :model="modifyForm" class="addForm">

    <el-form-item label="药品名称" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.medname" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="别名" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.alias" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="规格" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.spec" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="数量" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.count" auto-complete="off"></el-input>
    </el-form-item>

     <el-form-item label="进价" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.baseprice" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="零售价" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.sellprice" auto-complete="off"></el-input>
    </el-form-item>

    <el-form-item label="利润" :label-width="formLabelWidth">
      <el-input v-model="modifyForm.profit" auto-complete="off"></el-input>
    </el-form-item>



  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="modifyFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifySure">确 定</el-button>
  </div>
</el-dialog>


<!-- 添加图片 
<el-dialog title="添加图片" :visible.sync="addpicVisible" class="addPicArea" @close="closePicAdd">
  <el-form :model="addpicform">
    <el-form-item label="图片地址" :label-width="formLabelWidth">
      <el-input v-model="addpicform.url" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addpicVisible = false">取 消</el-button>
    <el-button type="primary" @click="addpicSure">确 定</el-button>
  </div>
</el-dialog>-->

<el-button type="primary" class="addBtn" @click="add" icon="el-icon-plus">添加</el-button>
  
  </div>
</template>

<script>
export default {
  name: "list",
  data: function() {
    return {
      tableData: [],
      addFormVisible: false,
      modifyFormVisible: false,
      addpicVisible: false,
      search: '',    //搜索
      modifyId: "",
      addpicId: "",
      addpicform: {
        url: ""
      },
      addForm: {
        medname: "",
        alias: "",
        spec: "",
        count: "",
        baseprice: "",
        sellprice: "",
        profit: "",
      },
      modifyForm: {
        medname: "",
        alias: "",
        spec: "",
        count: "",
        baseprice: "",
        sellprice: "",
        profit: "",
      },
      formLabelWidth: "120px",
      loading: false
    };
  },

  computed:{
    tables:function(){
      var search=this.search;
      if(search){
        if(search.charAt(0) == '<'){
          let limitValue = parseInt(search.substr(1));
          return  this.tableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
              return dataNews.count < limitValue
            })
          }) 

        }
        else{
          return  this.tableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
      }
      return this.tableData;
    }
  },

  methods: {

    add: function() {
      this.addFormVisible = true;
    },
    addSure: function() {
      var that = this;

      this.addFormVisible = false;
      //调新增接口,在回调函数中刷新一次

      var addObj = this.addForm;

      this.$http.post("/medapi/hero", addObj).then(
        function(response) {
          if (response.ok) {
            this.$message({
              message: "添加成功",
              type: "success",
              onClose: function() {
                that.getAll();
              }
            });
          }
        },
        function() {
          // this.loading = false;
        }
      );
    },
    // 关闭dialog的函数
    closeAdd: function() {
      this.addForm.medname = "";
      this.addForm.alias = "";
      this.addForm.spec = "";
      this.addForm.count = "";
      this.addForm.baseprice = "";
      this.addForm.sellprice = "";
      this.addForm.profit = "";
    },
    //修改操作
    modify: function(row) {
      this.modifyFormVisible = true;
      this.modifyForm = Object.assign({}, row);
      this.modifyId = row["_id"];
    },
    modifySure: function() {
      var that = this;
      this.$http
        .put(`/medapi/hero/${this.modifyId}`, this.modifyForm, {
          emulateJSON: true
        })
        .then(
          function(response) {
            if (response.ok) {
              this.modifyFormVisible = false;
              this.$message({
              message: "修改成功",
              type: "success",
              onClose: function() {
                that.getAll();
              }
            });
            }
          },
          function() {
            // this.loading = false;
          }
        );
    },
    // 删除操作
    deleteDate: function(id) {
      var that = this;
      var deleteId = id;

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`/medapi/hero/${deleteId}`).then(
            function(response) {
              if (response.ok) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getAll();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            },
            function() {
              // this.loading = false;
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取全部数据
    getAll: function() {
      this.loading = true;
      this.$http.get("/medapi/hero").then(
        function(response) {
          this.loading = false;
          this.tableData = response.body;
        },
        function() {
          this.loading = false;
          console.log("error");
        }
      );
    },
    addPic: function(id) {
      this.addpicId = id;
      this.addpicVisible = true;
    },
    closePicAdd: function() {
      this.addpicform.url = "";
    },
    addpicSure: function() {
      //如果没有填入图片地址的话，提示报错
      if (!this.addpicform.url.trim()) {
        this.$notify.error({
          title: "错误",
          message: "请输入正确的图片地址"
        });
        return;
      }

      var addObj = {
        url: this.addpicform.url
      };

      this.$http.put(`/medapi/addpic/${this.addpicId}`, addObj).then(
        function(response) {
          console.log(response);
          if (response.ok) {
            this.addpicVisible = false;
            this.$notify({
              title: "成功",
              message: "添加图片成功",
              type: "success"
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "添加图片失败"
            });
          }
        },
        function() {
          // this.loading = false;
        }
      );
    }
  },

  //页面初始化进来查询数据
  mounted: function() {
    this.getAll();
  }
};
</script>

<style lang="css">
.tableHeader {
  color: #000;
}
div.list {
  width: 90%;
  margin: 0 auto;
}
.addBtn {
  margin: 50px auto 0;
  display: block;
}
.addArea .el-input {
  width: 200px;
}
.addPicArea .el-input {
  width: 500px;
}
.addForm {
  overflow: hidden;
}
.addForm .el-form-item {
  float: left;
}
.addFormArea .el-dialog__header .el-dialog__title {
  text-align: left;
}
</style>
