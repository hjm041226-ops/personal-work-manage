// ============================================================
// ProfileEdit - 装配
// ============================================================
import usePayload from '@/common/composables/usePayload'
import createState from '../state'
import methods from '../module'
import lifecycle from '../module/lifecycle'
import api from '../api-request'

export default function assemble() {
  return usePayload({ state: createState, module: { index: methods, lifecycle }, api })
}
