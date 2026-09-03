<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import useDesignTokens from '@/common/composables/useDesignTokens'

dayjs.locale('zh-cn')
const theme = useDesignTokens()
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="theme">
    <router-view />
  </a-config-provider>
</template>

<style lang="scss">
// 应用级根样式（组件样式均在各组件 css/ 目录下）
</style>
