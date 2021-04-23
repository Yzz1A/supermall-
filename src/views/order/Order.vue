<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <!-- 点击弹出修改地址对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClose">
      <!-- 内容区域 -->
      <el-form :model="addressForm" ref="addressFormRef" :rules="addressFormRules" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" :props="{ expandTrigger: 'hover' }" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 点击弹出物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线组件 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, logistics } from 'network/order'

import cityData from './cityData'
import wuliu from './wuliu'

export default {
  name: 'Order',
  data() {
    return {
      //查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //订单列表
      orderList: [],
      //订单条数
      total: 0,
      //控制修改订单地址对话框的显示与隐藏
      addressVisible: false,
      //修改订单地址表单
      addressForm: { address1: [], address2: '' },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      },
      //城市数据
      cityData: cityData,
      //控制物流进度对话框的显示与隐藏
      progressVisible: false,
      //物流信息
      //progressInfo: [], //接口崩溃
      progressInfo: wuliu,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单列表
    getOrderList() {
      getOrderList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error('获取商品列表失败')
        }
        this.orderList = res.data.goods
        this.total = res.data.total
      })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    //展示修改订单地址对话框
    showBox() {
      this.addressVisible = true
    },
    //关闭对话框清空表单
    addressDialogClose() {
      this.$refs.addressFormRef.resetFields()
    },
    //展示物流进度对话框
    showProgressBox() {
      /* logistics().then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取物流信息失败')
        }
        this.progressInfo = res.data
        console.log(this.progressInfo)
      }) */

      this.progressVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
