<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// @see https://element-plus.org/zh-CN/component/config-provider.html#api
const size = 'large'
const zIndex = 3000
</script>
<style lang="stylus">
html,
body {
  height 100%
  overflow hidden
}
#app {
  height: 100vh;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  color: #333
}
</style>
