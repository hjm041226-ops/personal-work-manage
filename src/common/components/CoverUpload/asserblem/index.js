// ============================================================
// CoverUpload - 装配：聚合 state/module 到 payload
// ============================================================
import usePayload from '@/common/composables/usePayload'
import createState from '../state'
import module from '../module'
import api from '../api-request'

export default function assemble({ emit } = {}) {
  return usePayload({
    state: createState,
    module,
    api,
    context: { emit },
  })
}
