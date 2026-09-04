<script setup>
// ============================================================
// WorksManage —— 作品管理（检索 + 列表 + 分页 + 快捷操作）
// 生命周期与业务方法均在 module/，本文件仅装配 payload + 视图
// ============================================================
import { computed } from 'vue'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import WorkStatusTag from '@/common/components/WorkStatusTag/index.vue'
import CategoryPills from '@/common/components/CategoryPills/index.vue'
import { formatViews, formatDate } from '@/common/utils/format'
import { IMG_FALLBACK } from '@/common/api/assets'
import assemble from './asserblem'
import './css/index.scss'

const payload = assemble()

const columns = [
  { title: '封面', key: 'cover', width: 100, align: 'center' },
  {title: '类别', key: 'category', width: 60, align: 'center'},
  { title: '作品标题', key: 'title', minWidth: 200 },
  { title: '发布时间', key: 'date', width: 120, align: 'center' },
  { title: '展示状态', key: 'status', width: 100, align: 'center' },
  { title: '浏览量', key: 'views', width: 110, align: 'center' },
  { title: '操作', key: 'action', width: 170, align: 'center' },
]

const paginationProps = computed(() => ({
  current: payload.pagination.current,
  pageSize: payload.pagination.pageSize,
  total: payload.pagination.total,
  showSizeChanger: false,
  showQuickJumper: false,
  showTotal: (total, range) => `显示 ${range[0]} - ${range[1]} 条，共 ${total} 项作品`,
}))

function onTableChange(pg) {
  payload.onPageChange(pg.current, pg.pageSize)
}
</script>

<template>
  <div class="wm page-content">
    <!-- 页头 -->
    <div class="wm__head">
      <div class="wm__heading">
        <h1 class="wm__title">作品管理</h1>
        <p class="wm__subtitle">集中策划与管理个人精选创意作品库</p>
      </div>
    </div>

    <!-- 搜索 + 新增 -->
    <div class="wm__toolbar">
      <a-input
        v-model:value="payload.keyword"
        class="wm__search"
        allow-clear
        placeholder="搜索作品名称、分类标签、所属客户..."
        @input="payload.onSearchInput"
      >
        <template #prefix><SearchOutlined class="wm__search-icon" /></template>
      </a-input>
      <a-button type="primary" class="wm__add" @click="payload.goUpload()">
        <template #icon><PlusOutlined /></template>
        新增作品
      </a-button>
    </div>

    <!-- 分类胶囊（数据来自 B1 响应，label 中文 + 计数） -->
    <CategoryPills
      :categories="payload.pills"
      :counts="payload.counts"
      :active-key="payload.category"
      class="wm__pills"
      @change="payload.onCategory"
    />

    <!-- 作品表格 -->
    <div class="wm__table">
      <a-table
        :columns="columns"
        :data-source="payload.items"
        :loading="payload.loading"
        :pagination="paginationProps"
        row-key="id"
        :scroll="{ x: 820 }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 封面 -->
          <template v-if="column.key === 'cover'">
            <div class="wm-thumb">
              <img
                class="wm-thumb__img"
                :src="record.cover"
                :alt="record.title"
                loading="lazy"
                @error="$event.target.src = IMG_FALLBACK"
              />
            </div>
          </template>

          <!-- 类别 -->
           <template v-else-if="column.key === 'category'">
              <span>{{ record.category }}</span>
           </template>

          <!-- 标题（sub 可空/缺键：契约 2.9 omitempty） -->
          <template v-else-if="column.key === 'title'">
            <div class="wm-cell-title">
              <span class="wm-cell-title__name">{{ record.title }}</span>
              <span v-if="record.sub" class="wm-cell-title__sub">{{ record.sub }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'date'">
            <span class="u-mono-num wm-cell-date">{{ formatDate(record.date) }}</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <WorkStatusTag :status="record.status" />
          </template>

          <template v-else-if="column.key === 'views'">
            <span class="wm-cell-views">
              <EyeOutlined class="wm-cell-views__icon" />
              <span class="u-mono-num">{{ formatViews(record.views) }}</span>
            </span>
          </template>

          <!-- 操作 -->
          <template v-else-if="column.key === 'action'">
            <div class="wm-actions">
              <a-button type="text" size="small" title="编辑作品" @click="payload.goEdit(record)">
                <template #icon><EditOutlined /></template>
              </a-button>
              <a-button type="text" size="small" title="查看作品" @click="payload.onView(record)">
                <template #icon><EyeOutlined /></template>
              </a-button>
              <a-button
                type="text"
                size="small"
                danger
                title="归档删除"
                @click="payload.onDelete(record)"
              >
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
