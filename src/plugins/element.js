import Vue from "vue";
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
} from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
