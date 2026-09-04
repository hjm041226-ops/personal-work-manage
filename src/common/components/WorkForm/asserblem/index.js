// ============================================================
// WorkForm - 装配：聚合 state/module/api 到 payload
// 通过 context 透传 props / emit / 内部 ref
// ============================================================
import usePayload from '@/common/composables/usePayload'
import createState from '../state'
import methods from '../module'
import lifecycle from '../module/lifecycle'
import api from '../api-request'

export default function assemble({ props, emit, refs = {} } = {}) {
  return usePayload({
    state: () => createState(props),
    module: { index: methods, lifecycle },
    api,
    context: { props, emit },
  })
}
