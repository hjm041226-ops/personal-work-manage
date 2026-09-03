<script setup>
// ============================================================
// WorkForm —— 上传 / 编辑作品共用表单（基础信息 + 封面 + 描述 + 属性展示配置）
// 使用 payload 架构；暴露 validate / form / resetForm 给页面底部操作条
// ============================================================
import { ref, watch } from 'vue'
import {
  ProfileOutlined,
  PictureOutlined,
  FileTextOutlined,
  SlidersOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import CoverUpload from '@/common/components/CoverUpload/index.vue'
import MarkdownToolbar from '@/common/components/MarkdownToolbar/index.vue'
import { DESC_MAX } from './state'
import assemble from './asserblem'
import './css/index.scss'

const props = defineProps({
  mode: { type: String, default: 'edit' }, // 'upload' | 'edit'
  workId: { type: String, default: '' }, // 展示用编号
  initial: { type: Object, default: () => ({}) }, // 编辑回显数据
})

const payload = assemble({ props })

// 内部 ref：a-form 实例 / 描述 textarea（供 module 使用）
const formEl = ref(null)
const descRef = ref(null)
payload.$formEl = formEl
payload.$descRef = descRef

const descMax = DESC_MAX

const rules = {
  title: [{ required: true, whitespace: true, message: '请输入作品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择作品分类', trigger: 'change' }],
}

// 路由参数切换（同组件复用）时重置表单 —— 真正的生命周期/挂载逻辑仍在 module/lifecycle.js
watch(
  () => props.initial,
  (val) => payload.resetForm(val || {}),
  { deep: true }
)

defineExpose({
  validate: () => payload.validate(),
  getData: () => payload.getData(),
  form: payload.form,
  resetForm: (init) => payload.resetForm(init || {}),
})

/** 标签输入回车新增 */
function onTagEnter() {
  payload.addTag()
}
</script>

<template>
  <div class="wf">
    <!-- 基础信息 -->
    <section class="wf-card">
      <header class="wf-card__head">
        <h2 class="wf-card__title">
          <ProfileOutlined class="wf-card__icon" />
          基础信息
        </h2>
        <span class="wf-card__flag">REQUIRED</span>
      </header>

      <a-form ref="formEl" :model="payload.form" :rules="rules" layout="vertical" class="wf-form">
        <a-form-item label="作品编号 (ID)">
          <div class="wf-id">
            <span class="wf-id__hash">{{ workId ? `#${workId}` : '待后端生成' }}</span>
          </div>
        </a-form-item>

        <a-form-item name="title" label="作品名称" required>
          <a-input
            v-model:value="payload.form.title"
            allow-clear
            placeholder="例如：SaaS 智能化数据分析中台体验重构"
          />
        </a-form-item>

        <div class="wf-grid">
          <a-form-item name="category" label="作品分类" required>
            <a-select
              v-model:value="payload.form.category"
              :options="payload.categoryOptions"
              placeholder="请选择作品分类"
            />
          </a-form-item>
          <a-form-item name="date" label="项目完成日期">
            <a-date-picker
              v-model:value="payload.form.date"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              placeholder="选择日期"
            />
          </a-form-item>
          <a-form-item name="url" label="作品链接">
            <a-input
              v-model:value="payload.form.url"
              addon-before="https://"
              allow-clear
              placeholder="atelier.design/cases/analytics-hub"
            />
          </a-form-item>
          <a-form-item name="repo" label="仓库链接">
            <a-input
              v-model:value="payload.form.repo"
              addon-before="https://"
              allow-clear
              placeholder="github.com/your-repo/project"
            />
          </a-form-item>
        </div>
      </a-form>
    </section>

    <!-- 作品封面 -->
    <section class="wf-card">
      <header class="wf-card__head">
        <h2 class="wf-card__title">
          <PictureOutlined class="wf-card__icon" />
          作品封面
        </h2>
        <span class="wf-card__hint">推荐 16:10，PNG/WEBP/JPG 最高 20MB</span>
      </header>
      <CoverUpload
        v-model:cover="payload.form.cover"
        :fileName="payload.form.coverFile"
        :meta="payload.form.coverMeta"
        badge="当前封面"
        @change="payload.onCoverChange"
      />
    </section>

    <!-- 作品描述 -->
    <section class="wf-card">
      <header class="wf-card__head">
        <h2 class="wf-card__title">
          <FileTextOutlined class="wf-card__icon" />
          作品描述
        </h2>
        <span class="wf-card__flag">MARKDOWN</span>
      </header>

      <div class="wf-desc">
        <MarkdownToolbar @exec="payload.execCommand" />
        <a-textarea
          ref="descRef"
          v-model:value="payload.form.desc"
          :rows="6"
          class="wf-desc__area"
          :maxlength="descMax"
          placeholder="撰写该项目的思考过程、核心问题解决策略以及业务指标成果..."
          @input="payload.onDescInput"
        />
        <div class="wf-desc__count">{{ payload.descCount }} 字</div>
      </div>
    </section>

    <!-- 属性与展示配置 -->
    <section class="wf-card">
      <header class="wf-card__head">
        <h2 class="wf-card__title">
          <SlidersOutlined class="wf-card__icon" />
          属性与展示配置
        </h2>
      </header>

      <div class="wf-switch-row">
        <div class="wf-switch-row__text">
          <span class="wf-switch-row__label">公开展示状态</span>
          <span class="wf-switch-row__desc">允许访客在公开作品集中浏览此项目</span>
        </div>
        <a-switch v-model:checked="payload.form.published" />
      </div>

      <div class="wf-switch-row">
        <div class="wf-switch-row__text">
          <span class="wf-switch-row__label">首页焦点推荐</span>
          <span class="wf-switch-row__desc">在首页置顶大图展位轮播展示</span>
        </div>
        <a-switch v-model:checked="payload.form.featured" />
      </div>

      <div class="wf-tags">
        <label class="wf-tags__label">作品标签 (Tags)</label>
        <div class="wf-tags__box">
          <span v-for="(tag, i) in payload.form.tags" :key="tag" class="wf-tags__chip">
            <span>#{{ tag }}</span>
            <button type="button" aria-label="移除标签" @click="payload.removeTag(i)">
              <CloseOutlined />
            </button>
          </span>
          <a-input
            v-model:value="payload.newTag"
            class="wf-tags__input"
            placeholder="输入标签按回车添加..."
            @pressEnter="onTagEnter"
          >
            <template #suffix><PlusOutlined /></template>
          </a-input>
        </div>
      </div>
    </section>
  </div>
</template>
