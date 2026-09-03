<script setup>
// ============================================================
// AppShell - 后台框架（侧边栏 + 顶栏 + 内容区）
// 生命周期/方法均位于 module/ 与 state/，此处仅装配 payload
// ============================================================
import { computed } from 'vue'
import {
  MenuOutlined,
  FolderOpenOutlined,
  CloudUploadOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import assemble from './asserblem'
import { useUserStore } from '@/store/user'
import './css/index.scss'

const payload = assemble()

const userStore = useUserStore()
const displayName = computed(() => userStore.displayName || 'ATELIER')
const displayAvatar = computed(() => userStore.avatar || '')
</script>

<template>
  <a-layout class="app-shell">
    <!-- 左侧导航：桌面可折叠 / 平板以下折叠为 0 宽度 -->
    <a-layout-sider
      v-model:collapsed="payload.collapsed"
      :trigger="null"
      :breakpoint="'lg'"
      :collapsed-width="0"
      collapsible
      class="app-sider"
      width="232"
    >
      <div class="app-sider__brand" :class="{ 'app-sider__brand--mini': payload.collapsed }">
        <img class="app-sider__logo" src="/logo.svg" alt="Portfolio Studio Admin Logo" />
        <div v-if="!payload.collapsed" class="app-sider__brand-text">
          <span class="app-sider__brand-title">ATELIER</span>
          <span class="app-sider__brand-sub">CMS STUDIO</span>
        </div>
      </div>

      <div v-if="!payload.collapsed" class="app-sider__caption">Content Architecture</div>

      <a-menu
        :selected-keys="payload.selectedKeys"
        mode="inline"
        class="app-sider__menu"
        @click="payload.onMenuClick"
      >
        <a-menu-item key="/works">
          <template #icon><FolderOpenOutlined /></template>
          作品管理
        </a-menu-item>
        <a-menu-item key="/works/upload">
          <template #icon><CloudUploadOutlined /></template>
          上传作品
        </a-menu-item>
      </a-menu>

      <div v-if="!payload.collapsed" class="app-sider__foot">© 2024 ATELIER STUDIO INC.</div>
    </a-layout-sider>

    <!-- 右侧：顶栏 + 内容 -->
    <a-layout class="app-main">
      <a-layout-header class="app-header">
        <div class="app-header__left">
          <button class="app-header__burger" type="button" aria-label="展开导航" @click="payload.toggleSider">
            <MenuOutlined />
          </button>
          <span class="app-header__title">
            <img class="app-header__logo" src="/logo.svg" alt="ATELIER" />
            <b>ATELIER CMS</b>
          </span>
          <a-breadcrumb class="app-header__crumb">
            <a-breadcrumb-item>作品集管理后台</a-breadcrumb-item>
            <a-breadcrumb-item>{{ payload.pageTitle }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <a-dropdown placement="bottomRight" class="app-header__user">
          <div class="app-header__trigger">
            <a-avatar :size="30" :src="displayAvatar || undefined">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <span class="app-header__trigger-name">{{ displayName }}</span>
          </div>
          <template #overlay>
            <a-menu @click="payload.onUserMenuClick">
              <a-menu-item key="profile">
                <template #icon><UserOutlined /></template>
                个人资料
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout">
                <template #icon><LogoutOutlined /></template>
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>

      <a-layout-content class="app-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
