import Vue from 'vue'
import {
  Button, //按钮
  Form, //表单
  FormItem, //表单项
  Input, //输入框
  Message, //消息提示
  Container, //布局
  Header, //头部
  Aside, //左边栏
  Main, //内容
  Menu, //菜单
  Submenu, //二级菜单
  MenuItem, //菜单项
  Breadcrumb, //面包屑导航
  BreadcrumbItem, //面包屑导航项
  Card, //卡片
  Row, //栅格布局 行
  Col, //栅格布局 列
  Table, //表格
  TableColumn, //表格 列
  Switch, //开关
  Tooltip, //文字提示
  Pagination, //分页
  Dialog, //对话框
  MessageBox, //弹框
  Tag, //标签
  Tree, //树形控件
  Select, //选择器
  Option, //选项
  Cascader, //级联选择器
  Alert, //警告框
  Tabs, //页签
  TabPane, //页签
  Steps, //步骤条
  Step, //步骤条
  CheckboxGroup, //复选框
  Checkbox, //复选框
  Upload, //上传
  Timeline, //时间线
  TimelineItem, //时间线
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
