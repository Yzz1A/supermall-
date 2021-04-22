<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部提示 -->
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon> </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="基本信息" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单数据动态参数 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :label="cb" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单数据静态属性 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台API地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getParams, addGoods } from 'network/goodsadd'

//引入 lodash 插件
import _ from 'lodash'

export default {
  name: 'GoodsAdd',
  data() {
    return {
      // steps 和 tabs公用属性,点击切换 tabs 时修改 name 值,同时修改步骤条
      activeIndex: 0,
      //添加商品表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], //商品所属的分类数组
        pics: [], //图片的数组
        goods_introduce: '', //商品介绍
        attrs: [], //商品参数,包含动态参数和静态属性
      },
      //验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      //商品分类列表
      catelist: [],
      //
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //动态参数数据
      manyTableData: [],
      //静态属性数据
      onlyTableData: [],
      //上传图片的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传组件的 headers 请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //图片预览路径
      previewPath: '',
      //
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类
    getCateList() {
      getCateList().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error('获取商品列表失败')
        }
        this.catelist = res.data
      })
    },
    //级联选择器选择项变化触发
    handleChange() {
      //console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    //切换标签之前的钩子，若返回 false则阻止切换。
    beforeTabLeave(activeName, oldActiveName) {
      //console.log('即将进入' + activeName)
      //console.log('即将离开' + oldActiveName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //切换tab标签
    tabClicked() {
      //访问动态参数面板
      if (this.activeIndex === '1') {
        getParams(`categories/${this.cateId}/attributes`, { sel: 'many' }).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error('获取参数列表失败')
          }
          this.manyTableData = res.data

          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
        })
      } else if (this.activeIndex === '2') {
        getParams(`categories/${this.cateId}/attributes`, { sel: 'only' }).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error('获取参数列表失败')
          }
          this.onlyTableData = res.data
        })
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      //console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //处理移出图片的操作
    handleRemove(file) {
      //console.log(file)
      //1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      //2.从pics数组中找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      //3.调用数组的 splice 方法,把图片信息从 pics数组中移除
      this.addForm.pics.splice(i, 1)
      //console.log(this.addForm)
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      //console.log(response)
      //1.拼接得到图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      //2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
      //console.log(this.addForm)
    },
    //添加商品
    add() {
      //表单校验
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }

        //共用 goods_cat 属性,跟级联选择器冲突,级联要求数组,请求时要求字符串
        //this.addForm.goods_cat = this.addForm.goods_cat.join(',')

        //深拷贝
        const form = _.cloneDeep(this.addForm)

        //处理goods_cat
        form.goods_cat = form.goods_cat.join(',')

        //处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })

        //处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })

        form.attrs = this.addForm.attrs
        //console.log(form)
        //console.log(this.addForm)

        //发送数据添加商品
        addGoods(form).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败')
          }
          this.$message.success('添加商品成功')

          this.$router.push('/goods')
        })
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 10px;
}
</style>
