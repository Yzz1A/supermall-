<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    logout() {
      window.sessionStorage.removeItem("token"); //清除 token
      this.$router.push("/login"); //重新跳转
    },
  },
};
</script>

<style lang="less" scoped>
</style>