// ============================================================
// 统一反馈封装：模块/组件内直接调用，不重复 import antd message
// 注意：antd v4 静态 message 调用建议在组件挂载后使用
// ============================================================
import { message, Modal } from 'ant-design-vue'

export function useFeedback() {
  const feedback = {
    success: (content = '操作成功') => message.success(content),
    error: (content = '操作失败') => message.error(content),
    info: (content = '') => message.info(content),
    warning: (content = '') => message.warning(content),
    loading: (content = '处理中...') => message.loading(content),
    confirm: (options = {}) =>
      Modal.confirm({
        okText: '确定',
        cancelText: '取消',
        ...options,
      }),
  }
  return feedback
}

export default useFeedback
