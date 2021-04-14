import Vue from "vue";
//      按钮,   表单,  表单项,    输入框,消息提示
import { Button, Form, FormItem, Input, Message } from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

Vue.prototype.$message = Message;
