<script setup>
// ============================================================
// WorkEdit —— 编辑作品（/works/:id/edit）
// 主区域复用 common/components/WorkForm；页面负责头部 + 底部操作条
// ============================================================
import { computed, ref } from 'vue'
import { ArrowLeftOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons-vue'
import WorkForm from '@/common/components/WorkForm/index.vue'
import assemble from './asserblem'
import './css/index.scss'

const payload = assemble()

const formRef = ref(null)
payload.$formRef = formRef
payload.saving = false

const pageTitle = computed(() =>
  payload.record ? `编辑作品：${payload.record.title}` : '编辑作品'
)
</script>

<template>
  <div class="we page-content">
    <a-spin :spinning="payload.loading" wrapper-class-name="we__spin">
      <!-- 页面头部：返回 + 面包屑 + 标题 -->
      <div class="we__head">
        <div class="we__head-left">
          <button type="button" class="we__back" aria-label="返回" @click="payload.goBack()">
            <ArrowLeftOutlined />
          </button>
          <div class="we__heading">
            <span class="we__crumb">作品管理 / 编辑模式</span>
            <h1 class="we__title">{{ pageTitle }}</h1>
          </div>
        </div>
      </div>

      <!-- 编辑表单 -->
      <WorkForm
        v-if="payload.record"
        ref="formRef"
        mode="edit"
        :work-id="payload.record.id"
        :initial="payload.record"
      />

      <!-- 底部操作条 -->
      <div class="we__bar">
        <a-button size="large" class="we__bar-cancel" @click="payload.cancelEdit()">
          <template #icon><CloseOutlined /></template>
          取消修改
        </a-button>
        <a-button type="primary" size="large" :loading="payload.saving" @click="payload.saveEdit()">
          <template #icon><SaveOutlined /></template>
          保存修改
        </a-button>
      </div>
    </a-spin>
  </div>
</template>
