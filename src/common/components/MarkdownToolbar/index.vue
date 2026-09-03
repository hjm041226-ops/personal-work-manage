<script setup>
// ============================================================
// MarkdownToolbar —— 描述区格式化工具栏（纯命令发射）
// ============================================================
import {
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  AlignLeftOutlined,
  LinkOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue'
import './css/index.scss'

const emit = defineEmits(['exec'])

const COMMANDS = [
  { key: 'bold', tip: '加粗', icon: BoldOutlined },
  { key: 'italic', tip: '斜体', icon: ItalicOutlined },
  { key: 'insertUnorderedList', tip: '无序列表', icon: UnorderedListOutlined },
  { key: 'insertOrderedList', tip: '有序列表', icon: OrderedListOutlined },
  { key: 'formatBlock', tip: '引用', icon: AlignLeftOutlined },
  { key: 'createLink', tip: '插入链接', icon: LinkOutlined },
  { key: 'code', tip: '代码块', icon: CodeOutlined },
]

function run(cmd) {
  emit('exec', cmd)
}
</script>

<template>
  <div class="md-toolbar">
    <button
      v-for="c in COMMANDS"
      :key="c.key"
      type="button"
      class="md-toolbar__btn"
      :title="c.tip"
      @mousedown.prevent
      @click="run(c.key)"
    >
      <component :is="c.icon" />
    </button>
  </div>
</template>
