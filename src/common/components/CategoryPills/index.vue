<script setup>
// ============================================================
// CategoryPills —— 分类胶囊筛选条（demo 风格）
// v-model:active-key + categories/counts
// ============================================================
import { computed } from 'vue'
import './css/index.scss'

const props = defineProps({
  categories: { type: Array, default: () => [] }, // [{ key, label }]
  counts: { type: Object, default: () => ({}) }, // { key: n }
  activeKey: { type: String, default: 'all' },
})

const emit = defineEmits(['update:activeKey', 'change'])

function choose(key) {
  emit('update:activeKey', key)
  emit('change', key)
}

const list = computed(() => props.categories)
</script>

<template>
  <div class="category-pills">
    <button
      v-for="cat in list"
      :key="cat.key"
      type="button"
      class="category-pills__item"
      :class="{ 'category-pills__item--active': activeKey === cat.key }"
      @click="choose(cat.key)"
    >
      <span>{{ cat.label }}</span>
      <span v-if="counts[cat.key] !== undefined" class="category-pills__badge">
        {{ counts[cat.key] }}
      </span>
    </button>
  </div>
</template>
