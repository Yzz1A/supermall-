<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 
        :getter 列与列的间隙
        :span 列的宽度
       -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加   clear 在点击由 clearable 属性生成的清空按钮时触发-->
          <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="handleSearchChange">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchChange(params.query)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表  data数据绑定  border边框 stripe隔行变色  label当前列表项的标题  prop当前列表项的数据-->
      <el-table :data="userlist" border stripe>
        <!-- type="index" 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 这里插槽的值会覆盖prop的值,所以这里不需要prop属性 -->
          <template v-slot="scope">
            <!-- scope.row可以获取当前行所有数据  v-model绑定true/false表示开关 -->
            <!-- {{ scope.row }} -->
            <el-switch v-model="scope.row.mg_state" @change="changeUserStatu(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditVisible(scope.row.id)">
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">
            </el-button>
            <!-- enterable鼠标是否可进入到 tooltip 中 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- 分配角色按钮 -->
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="params.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 点击添加用户弹出对话框  visible.sync控制显示与隐藏-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击弹出编辑用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getUserList1,
  changeUserStatus,
  addUser,
  editUser,
  submitEditUser,
  deleteUserById,
} from "network/home";

export default {
  name: "Users",
  data() {
    //定义验证邮箱规则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb(); //合法的邮箱
      }
      cb(new Error("请输入正确的邮箱"));
    };
    //定义验证手机号规则
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb(); //合法的手机号
      }
      cb(new Error("请输入正确的手机号"));
    };
    return {
      params: { query: "", pagenum: 1, pagesize: 2 },
      userlist: [],
      total: 0,
      url: "",
      addDialogVisible: false, //控制添加用户对话框的隐藏与显示
      addForm: { username: "", password: "", email: "", mobile: "" }, //添加用户的表单信息
      addFormRules: {
        //添加用户表单的验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible: false, //控制修改用户对话框的隐藏与显示
      editForm: {}, //修改用户
    };
  },
  created() {
    getUserList().then((res) => {
      //console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    });
  },
  methods: {
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.params.pagesize = newSize;
      //console.log(this.params.pagesize);
      //console.log(this.params);
      //值改变之后重新请求渲染
      getUserList1(this.params).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.userlist = res.data.users;
        this.total = res.data.total;

        this.params.pagesize = 2;
      });
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage;
      //console.log(this.params.newPage);
      getUserList1(this.params).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.userlist = res.data.users;
        this.total = res.data.total;

        this.params.pagenum = 1;
      });
    },
    //监听搜索框改变的事件
    handleSearchChange(newQuery) {
      this.params.query = newQuery;
      //console.log(this.params.newQuery);
      getUserList1(this.params).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败");
        }
        this.userlist = res.data.users;
        this.total = res.data.total;

        this.params.query = "";
      });
    },
    //监听用户状态开关按钮 状态改变重新发起请求
    changeUserStatu(userInfo) {
      this.url = `users/${userInfo.id}/state/${userInfo.mg_state}`;
      //console.log(this.url);
      changeUserStatus(this.url).then((res) => {
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state;
          this.$message.error("用户状态更新失败");
        }
        this.$message.success("用户状态更新成功");
      });
    },
    //监听添加用户表单的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //监听添加用户按钮的点击事件
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        //console.log(valid);
        if (!valid) retuen; //valid为false则返回,否则请求添加
        addUser(this.addForm)
          .then((res) => {
            //console.log(res);
            if (res.meta.status !== 201) {
              this.$message.error("添加用户失败");
            }
            this.$message.success("添加用户成功");
            //隐藏添加用户的对话框
            this.addDialogVisible = false;
            //重新请求用户列表
            return getUserList();
          })
          .then((res) => {
            //console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("获取用户列表失败");
            }
            this.userlist = res.data.users;
            this.total = res.data.total;
          });
      });
    },
    //监听编辑用户按钮的点击事件
    showEditVisible(id) {
      this.url = "users/" + id;
      editUser(this.url).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("查询用户信息失败");
        }
        this.editForm = res.data;
      });
      this.editDialogVisible = true;
    },
    //监听修改用户表单的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并提交
    editUser() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) retuen;
        submitEditUser("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
          .then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error("修改用户信息失败");
            }
            this.$message.success("修改用户信息成功");
            //隐藏添加用户的对话框
            this.editDialogVisible = false;
            //重新请求用户列表
            return getUserList1(this.params);
          })
          .then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error("获取用户列表失败");
            }
            this.userlist = res.data.users;
            this.total = res.data.total;
          });
      });
    },
    //根据id删除对应用户信息
    removeUserById(id) {
      //弹框询问用户是否删除数据
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          () => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //请求数据库删除用户
            return deleteUserById("users/" + id);
          },
          () => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        )
        .then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          //重新请求用户列表
          return getUserList1(this.params);
        })
        .then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取用户列表失败");
          }
          this.userlist = res.data.users;
          this.total = res.data.total;
        });
    },
  },
};
</script>

<style lang="less" scoped></style>
