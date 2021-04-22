/* 导入 vue 相关 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* 导入插件相关 */
import './plugins/element.js' //导入element
import VueQuillEditor from 'vue-quill-editor' //导入富文本编辑器

/* 导入样式相关 */
import 'assets/css/global.css' //全局样式表
//富文本编辑器样式表
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

//将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

//过滤器
Vue.filter('dataFormat', (originVal) => {
  const dt = new Date(originVal * 1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
