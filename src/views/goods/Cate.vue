<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="cateList" style="width: 100%" row-key="cat_id" border :tree-props="{ children: 'children' }">
        <!-- <el-table-column type="index" label="#"> </el-table-column> -->
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template v-slot="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditVisible(scope.row.cat_id)">编辑 </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 内容区域 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击弹出编辑分类对话框 -->
    <el-dialog title="编辑分类信息" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容区域 -->
      <el-form :model="cateForm" ref="cateFormRef" label-width="70px">
        <el-form-item label="分类名称">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getParentCateList, addClass, getCateById, editCateById, removeCateById } from 'network/cate'

export default {
  name: 'Cate',
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [], //商品分类的数据列表
      total: 0, //总数据条数
      addCateDialogVisible: false, //控制添加分类对话框的显示与隐藏
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: '', //将要添加的分类的名称
        cat_pid: 0, //父级分类id
        cat_level: 0, //分类的等级,默认要添加的是一级分类
      },
      //添加分类的表单数据对象的校验规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      parentCateList: [], //父级分类的列表
      //级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedKeys: [], //选中的父级分类的 id 数组
      cateForm: {}, //查询到的分类
      editDialogVisible: false, //控制编辑分类对话框的显示与隐藏
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取商品列表
    getGoodsList() {
      getCateList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error('获取商品列表失败')
        }
        this.cateList = res.data.result //把数据列表 赋值给 cateList
        this.total = res.data.total //把总条数赋值给 total
      })
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //
    showAddCateDialog() {
      //先获取父级分类数据列表
      this.getParent()
      //再展示对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    getParent() {
      getParentCateList().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error('获取父级分类数据失败')
        }
        this.parentCateList = res.data
      })
    },
    //选择项发生变化触发这个函数
    parentCateChange() {
      //console.log(this.selectedKeys);
      //如果 selectedKeys 的 length 大于 0 ,证明有选中父级分类
      //反之,则没有父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //点击按钮添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate((valid) => {
        if (!valid) return
        addClass(this.addCateForm).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败')
          }
          this.$message.success('添加分类成功')
          this.getGoodsList()
          this.addCateDialogVisible = false
        })
      })
    },
    //监听添加分类表单的关闭
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //监听编辑按钮的点击事件
    showEditVisible(id) {
      getCateById(`categories/${id}`).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询分类失败')
        }
        this.cateForm = res.data
      })
      this.editDialogVisible = true
    },
    //修改分类信息并提交
    editCate() {
      this.$refs.cateFormRef.validate((valid) => {
        if (!valid) return
        editCateById('categories/' + this.cateForm.cat_id, {
          cat_name: this.cateForm.cat_name,
        }).then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error('修改分类失败')
          }
          this.$message.success('修改用户信息成功')
          this.editDialogVisible = false
          this.getGoodsList()
        })
      })
    },
    //监听删除分类的点击事件
    removeCate(id) {
      //弹框询问用户是否删除数据
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(
          () => {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            //请求数据库删除分类
            return removeCateById('categories/' + id)
          },
          () => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          }
        )
        .then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          this.getGoodsList()
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
