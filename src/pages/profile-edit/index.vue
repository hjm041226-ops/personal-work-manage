<script setup>
// ============================================================
// ProfileEdit —— 个人资料编辑（/profile）
// ============================================================
import { ref } from 'vue'
import { ArrowLeftOutlined, CameraOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue'
import assemble from './asserblem'
import './css/index.scss'

const payload = assemble()

const formEl = ref(null)
payload.$formEl = formEl

const rules = {
  name: [{ required: true, whitespace: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}
</script>

<template>
  <div class="pe page-content">
    <!-- 页头 -->
    <div class="pe__head">
      <div class="pe__head-left">
        <button type="button" class="pe__back" aria-label="返回" @click="payload.goBack()">
          <ArrowLeftOutlined />
        </button>
        <div class="pe__heading">
          <h1 class="pe__title">个人资料编辑</h1>
          <p class="pe__subtitle">维护个人档案与账号信息</p>
        </div>
      </div>
    </div>

    <div class="pe__grid">
      <!-- 头像卡片 -->
      <section class="pe-card pe-card--avatar">
        <div class="pe-avatar">
          <img
            class="pe-avatar__img"
            :src="payload.avatar"
            alt="头像"
            @error="$event.target.src = '/logo.svg'"
          />
          <a-upload
            :show-upload-list="false"
            :before-upload="payload.chooseAvatar"
            accept=".png,.jpg,.jpeg,.webp"
          >
            <button type="button" class="pe-avatar__edit" aria-label="更换头像">
              <CameraOutlined />
            </button>
          </a-upload>
        </div>
        <div class="pe-card__identity">
          <span class="pe-card__name">{{ payload.name || '—' }}</span>
          <span class="pe-card__role">{{ payload.title || '—' }}</span>
        </div>
        <p class="pe-card__tip">支持 PNG / WEBP / JPG，不超过 5MB</p>
      </section>

      <!-- 信息表单 -->
      <section class="pe-card pe-card--form">
        <a-form ref="formEl" :model="payload" :rules="rules" layout="vertical">
          <a-form-item label="姓名" name="name" required>
            <a-input v-model:value="payload.name" allow-clear placeholder="请输入姓名" />
          </a-form-item>

          <a-form-item label="个人简介" name="bio">
            <a-textarea
              v-model:value="payload.bio"
              :rows="4"
              :maxlength="200"
              placeholder="用几句话介绍自己与设计理念..."
              @input="payload.onBioInput"
            />
            <div class="pe__count">限制 200 字 · 当前 {{ payload.bioCount }} 字</div>
          </a-form-item>

          <a-form-item label="电子邮箱" name="email" required>
            <a-input v-model:value="payload.email" allow-clear placeholder="name@example.com" />
          </a-form-item>

          <a-form-item label="个人仓库链接" name="website">
            <a-input v-model:value="payload.website" allow-clear placeholder="https://yourname.design" />
          </a-form-item>
        </a-form>

        <div class="pe__actions">
          <a-button size="large" class="pe__cancel" @click="payload.cancel()">
            <template #icon><CloseOutlined /></template>
            取消
          </a-button>
          <a-button type="primary" size="large" :loading="payload.submitting" @click="payload.save()">
            <template #icon><CheckOutlined /></template>
            保存更改
          </a-button>
        </div>
      </section>
    </div>
  </div>
</template>
