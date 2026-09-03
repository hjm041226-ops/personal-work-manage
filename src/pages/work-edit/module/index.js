// ============================================================
// WorkEdit - 方法
// ============================================================

/** 返回作品管理 */
export function goBack(payload) {
  payload.$router.push('/works')
}

/** 取消修改（返回列表） */
export function cancelEdit(payload) {
  payload.goBack()
}

/** 保存修改：先校验 WorkForm，成功则模拟提交 */
export async function saveEdit(payload) {
  if (!payload.$formRef) return
  const { ok, values } = await payload.$formRef.validate()
  if (!ok) {
    payload.$msg.warning('请检查表单必填项')
    return
  }
  payload.saving = true
  try {
    // TODO: 接入真实更新接口（api-request 预留）
    await new Promise((resolve) => setTimeout(resolve, 400))
    payload.$msg.success(`作品「${values.title}」修改已保存（静态演示）`)
    payload.goBack()
  } finally {
    payload.saving = false
  }
}

export default { goBack, cancelEdit, saveEdit }
