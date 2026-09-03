<script setup>
// ============================================================
// WorkUpload —— 上传新作品（/works/upload）
// 主区域复用 common/components/WorkForm；页面负责头部 + 底部操作条
// ============================================================
import { ref } from 'vue'
import { ArrowLeftOutlined, SendOutlined, SaveOutlined } from '@ant-design/icons-vue'
import WorkForm from '@/common/components/WorkForm/index.vue'
import assemble from './asserblem'
import './css/index.scss'

const payload = assemble()

const formRef = ref(null)
payload.$formRef = formRef

// 稳定引用：避免每次渲染生成新对象触发 WorkForm 的 watch 重置
const EMPTY_INITIAL = {}
</script>

<template>
  <div class="wu page-content">
    <!-- 页面头部 -->
    <div class="wu__head">
      <div class="wu__head-left">
        <button type="button" class="wu__back" aria-label="返回" @click="payload.goBack()">
          <ArrowLeftOutlined />
        </button>
        <div class="wu__heading">
          <span class="wu__crumb">作品管理 / 创作发布</span>
          <h1 class="wu__title">上传新作品</h1>
        </div>
      </div>
    </div>

    <!-- 表单（上传模式；编号由后端 B3 生成后返回，此处展示占位） -->
    <WorkForm ref="formRef" mode="upload" work-id="" :initial="EMPTY_INITIAL" />

    <!-- 底部操作条 -->
    <div class="wu__bar">
      <a-button size="large" class="wu__bar-draft" @click="payload.saveDraft()">
        <template #icon><SaveOutlined /></template>
        保存草稿
      </a-button>
      <a-button type="primary" size="large" :loading="payload.saving" @click="payload.publish()">
        <template #icon><SendOutlined /></template>
        发布作品
      </a-button>
    </div>
  </div>
</template>
