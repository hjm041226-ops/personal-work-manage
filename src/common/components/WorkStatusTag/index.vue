<script setup>
// ============================================================
// WorkStatusTag —— 作品展示状态徽标（已发布 / 草稿 / 已归档）
// 纯展示组件：目录骨架保持一致，逻辑极简就地实现
// ============================================================
import { computed } from 'vue'
import './css/index.scss'

const props = defineProps({
  status: { type: String, default: 'published' }, // published | draft | archived
  label: { type: String, default: '' },
})

const MAP = { published: '已发布', draft: '草稿', archived: '已归档' }

const text = computed(() => props.label || MAP[props.status] || props.status)
</script>

<template>
  <span class="ws-tag" :class="`ws-tag--${status}`">
    <i class="ws-tag__dot"></i>
    {{ text }}
  </span>
</template>
