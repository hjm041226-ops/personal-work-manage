<script setup>
// ============================================================
// CoverUpload —— 单封面：预览 + 更换/上传 + 删除
// 使用 payload 架构：方法在 module/、变量在 state/、卸载 revoke 在 module/lifecycle.js
// ============================================================
import { computed } from 'vue'
import { PictureOutlined, UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { IMG_FALLBACK } from '@/common/api/assets'
import assemble from './asserblem'
import './css/index.scss'

const props = defineProps({
  cover: { type: String, default: '' }, // v-model:cover
  fileName: { type: String, default: '' },
  meta: { type: String, default: '' },
  badge: { type: String, default: '' }, // 角标文案，如「当前主封面」
  replaceLabel: { type: String, default: '更换封面' },
  showRemove: { type: Boolean, default: true },
  hint: { type: String, default: '' },
})

const emit = defineEmits(['update:cover', 'change'])
const payload = assemble({ emit })

const displayName = computed(() => payload.fileInfo.name || props.fileName)
const displayMeta = computed(() => payload.fileInfo.meta || props.meta)
</script>

<template>
  <div class="cover-upload">
    <div class="cover-upload__preview">
      <img
        v-if="cover"
        class="cover-upload__img"
        :src="cover"
        :alt="displayName || '作品封面'"
        :fallback="IMG_FALLBACK"
        @error="$event.target.src = IMG_FALLBACK"
      />
      <div v-else class="cover-upload__placeholder">
        <PictureOutlined />
        <span>暂无封面</span>
      </div>

      <span v-if="badge && cover" class="cover-upload__badge">{{ badge }}</span>
      <button
        v-if="showRemove && cover"
        type="button"
        class="cover-upload__remove"
        aria-label="移除文件"
        @click="payload.removeCover()"
      >
        <DeleteOutlined />
      </button>
    </div>

    <div class="cover-upload__meta">
      <div class="cover-upload__file">
        <span class="cover-upload__file-name">{{ displayName || '未选择文件' }}</span>
        <span v-if="displayMeta" class="cover-upload__file-meta">{{ displayMeta }}</span>
      </div>

      <div class="cover-upload__actions">
        <a-upload
          :show-upload-list="false"
          :before-upload="payload.pickFile"
          accept=".png,.jpg,.jpeg,.webp"
        >
          <button type="button" class="cover-upload__btn cover-upload__btn--primary">
            <UploadOutlined v-if="!cover" />
            <EditOutlined v-else />
            <span>{{ cover ? replaceLabel : '上传封面' }}</span>
          </button>
        </a-upload>
        <a-button v-if="showRemove && cover" class="cover-upload__btn--danger" danger type="text" @click="payload.removeCover()">
          <template #icon><DeleteOutlined /></template>
          删除
        </a-button>
      </div>
    </div>

    <p v-if="hint" class="cover-upload__hint">{{ hint }}</p>
  </div>
</template>
