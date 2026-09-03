// ============================================================
// WorkUpload - 方法
// ============================================================

export function goBack(payload) {
  payload.$router.push('/works')
}

/** 保存草稿（静态演示：不校验直接提示） */
export function saveDraft(payload) {
  payload.$msg.success('已保存为草稿（静态演示）')
}

/** 发布作品：先校验 WorkForm，成功后模拟提交并返回列表 */
export async function publish(payload) {
  if (!payload.$formRef) return
  const { ok, values } = await payload.$formRef.validate()
  if (!ok) {
    payload.$msg.warning('请检查表单必填项')
    return
  }
  payload.saving = true
  try {
    // TODO: 通过 api-request/createWork 提交真实接口
    const res = await payload.api.createWork({ ...values, workId: payload.$route.query.id || 'PRJ-8822' })
    if (res && res.ok) {
      payload.$msg.success(`作品「${values.title}」已发布（静态演示）`)
      payload.goBack()
    }
  } finally {
    payload.saving = false
  }
}

export default { goBack, saveDraft, publish }
