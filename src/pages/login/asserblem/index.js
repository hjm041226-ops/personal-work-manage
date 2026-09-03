// ============================================================
// Login - 装配
// ============================================================
import usePayload from '@/common/composables/usePayload'
import createState from '../state'
import module from '../module'
import api from '../api-request'

export default function assemble() {
  return usePayload({ state: createState, module, api })
}
