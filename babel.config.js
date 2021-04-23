//发布阶段用到的 babel 插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console') //发布时删除所有的 console
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    //发布时的插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import', //路由懒加载
  ],
}
