// ============================================================
// CoverUpload - 装配：聚合 state/module 到 payload
// ============================================================
import usePayload from '@/common/composables/usePayload'
import createState from '../state'
import methods from '../module'
import lifecycle from '../module/lifecycle'
import api from '../api-request'

export default function assemble({ emit } = {}) {
  return usePayload({
    state: createState,
    module: { index: methods, lifecycle },
    api,
    context: { emit },
  })
}
