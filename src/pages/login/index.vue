<script setup>
// ============================================================
// Login —— 登录页（独立整屏）
// 生命周期/方法在 module/ 下，此处只装配 payload + 模板
// ============================================================
import { MailOutlined, LockOutlined } from '@ant-design/icons-vue'
import assemble from './asserblem'
import './css/index.scss'

const payload = assemble()

const rules = {
  email: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
</script>

<template>
  <div class="login-page">
    <!-- 背景装饰光斑（纯 CSS，无图片） -->
    <span class="login-page__blob login-page__blob--a"></span>
    <span class="login-page__blob login-page__blob--b"></span>

    <div class="login-card">
      <div class="login-card__brand">
        <img class="login-card__logo" src="/logo.svg" alt="ATELIER" />
      </div>

      <h1 class="login-card__title">ATELIER 作品集后台系统</h1>
      <p class="login-card__subtitle">Portfolio Studio Admin Console</p>

      <a-form
        :model="payload"
        :rules="rules"
        layout="vertical"
        class="login-form"
        @finish="payload.submit"
      >
        <a-form-item name="email">
          <a-input
            v-model:value="payload.email"
            size="large"
            placeholder="admin@atelier-studio.com"
            autocomplete="username"
          >
            <template #prefix><MailOutlined /></template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
            v-model:value="payload.password"
            size="large"
            placeholder="密码"
            autocomplete="current-password"
          >
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>

        <div class="login-card__options">
          <a-checkbox v-model:checked="payload.remember">记住登录状态</a-checkbox>
          <a-button type="link" class="login-card__forgot" @click="payload.onForgot()">
            忘记密码？
          </a-button>
        </div>

        <a-button
          type="primary"
          html-type="submit"
          block
          size="large"
          class="login-card__submit"
          :loading="payload.submitting"
        >
          {{ payload.submitting ? '验证凭据中...' : '立即登录系统' }}
        </a-button>
      </a-form>

      <div class="login-card__foot">
        <span class="login-card__copy">© 2024 ATELIER Studio. 保留所有权利。</span>
      </div>
    </div>
  </div>
</template>
