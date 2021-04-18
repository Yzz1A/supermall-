<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 展开内容 -->
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- for循环嵌套渲染二级权限 -->
                <el-row
                  :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 嵌套渲染三级权限 -->
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditVisible(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightVisible(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点击弹出添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击弹出编辑角色对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 内容区域 -->
      <el-form :model="editRole" ref="editRoleRef" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击弹出分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 内容区域 树形图  :data数据源  :props绑定字段  show-checkbox复选框  default-expand-all展开所有节点-->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getRoleById,
  addRole,
  editSubmitRole,
  deleteRoleById,
  getRightsList,
  setRights,
} from "network/roles";

export default {
  name: "Roles",
  data() {
    return {
      roleList: [], //角色列表
      addForm: { roleName: "", roleDesc: "" }, //添加表单
      addDialogVisible: false, //控制添加角色对话框的隐藏与显示
      editDialogVisible: false, //控制编辑角色对话框的隐藏与显示
      editRole: {}, //编辑角色信息
      url: "",
      setRightDialogVisible: false, //控制分配权限对话框的隐藏与显示
      rightsList: [], //权限列表
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      defaultKeys: [], //默认选中的节点id值数组
      roleId: "", //当前即将分配权限的角色id
    };
  },
  created() {
    this.getRoleList1();
  },
  methods: {
    getRoleList1() {
      getRoleList().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.roleList = res.data;
      });
    },
    //监听编辑角色按钮的点击事件
    showEditVisible(id) {
      this.url = "roles/" + id;
      getRoleById(this.url).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("查询角色信息失败");
        }
        this.editRole = res.data;
      });
      this.editDialogVisible = true;
    },
    //修改角色信息并提交
    editRoles() {
      this.$refs.editRoleRef.validate((valid) => {
        if (!valid) return;
        editSubmitRole("roles/" + this.editRole.roleId, {
          roleName: this.editRole.roleName,
          roleDesc: this.editRole.roleDesc,
        }).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error("修改用户信息失败");
          }
          this.$message.success("修改用户信息成功");
          //隐藏添加用户的对话框
          this.editDialogVisible = false;
          //重新请求角色列表
          this.getRoleList1();
        });
      });
    },
    //监听修改用户表单的关闭事件
    editDialogClose() {
      this.$refs.editRoleRef.resetFields();
    },
    //监听删除按钮的点击事件
    removeRoleById(id) {
      //弹框询问用户是否删除数据
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
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
            //请求数据库删除角色
            return deleteRoleById("roles/" + id);
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
            return this.$message.error("删除角色失败");
          }
          //重新请求角色列表
          this.getRoleList1();
        });
    },
    //监听添加用户表单的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //监听添加按钮的点击事件
    addRoles() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) retuen; //valid为false则返回,否则请求添加
        addRole(this.addForm).then((res) => {
          //console.log(res);
          if (res.meta.status !== 201) {
            this.$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功");
          //隐藏添加用户的对话框
          this.addDialogVisible = false;
          //重新请求角色列表
          this.getRoleList1();
        });
      });
    },
    //根据 id删除对应权限
    removeRightById(role, rightId) {
      //弹框提示用户是否要删除
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
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
            //请求数据库删除权限
            return deleteRoleById(`roles/${role.id}/rights/${rightId}`);
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
            return this.$message.error("删除权限失败");
          }
          role.children = res.data; //返回的data, 是当前角色下最新的权限数据,所以给角色信息重新赋值权限
        });
    },
    //展示分配权限的对话框
    showSetRightVisible(role) {
      this.roleId = role.id;
      //获取所有权限数据
      getRightsList().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取权限失败");
        }
        this.rightsList = res.data; //把获取到的数据保存到 data 中
      });

      //递归获取三级节点id
      this.getLeafKeys(role, this.defaultKeys);
      //显示分配权限对话框
      this.setRightDialogVisible = true;
    },
    //通过递归的形式,获取角色下所有三级权限的id并保存到 defaultKeys 数组中
    getLeafKeys(node, arr) {
      //如果当前节点不包括children属性,则是三级节点,把id值添加到数组中
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defaultKeys = []; //关闭时清空保存的数据
    },
    //点击为角色分配权限
    allotRights() {
      const keys = [
        //展开 目前全选中的节点的 key 组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        //展开 目前半选中的节点的 key 组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      //分配权限
      setRights(`roles/${this.roleId}/rights`, {
        rids: idStr,
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("分配权限失败");
        }
        this.$message.success("分配权限成功");
        //重新请求角色列表
        this.getRoleList1();
        this.roleList = res.data;
        //隐藏对话框
        this.setRightDialogVisible = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
