// ============================================================
// usePayload —— 公共方法：集成变量与方法到 payload，并自动装配
//
// 约定（页面与组件通用）：
//  1. state                : fn() => 组件私有变量（响应式）
//  2. module.index         : { 方法名(payload, ...args) } —— 自动挂到 payload.方法名
//  3. module.lifecycle     : { onMounted(payload), onBeforeUnmount(payload) ... }
//                            生命周期函数统一放 组件/module/lifecycle.js，在此自动注册
//  4. api.index            : { 请求名(payload, ...args) } —— 自动挂到 payload.api.请求名
//  5. computedMap(可选)    : { 名(payload) => value } —— 自动挂为 payload.名
//  6. context(可选)        : { props, emit } —— 挂到 payload.$props / payload.$emit
//
// 即：api-request 与 module 中的函数“默认自动装配”，统一以 payload 为首参被注入，
// 组件内不需要手动 import / 手动传参，只拿到一个 payload。
// ============================================================
import {
  reactive,
  computed,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useFeedback from './useFeedback'

const LIFECYCLE_REGISTRARS = {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
}

/** 把 { fn(payload, ...args) } 绑定为可直接调用的闭包 */
function bindWithPayload(payload, def) {
  if (!def || typeof def !== 'object') return {}
  return Object.keys(def).reduce((acc, key) => {
    const fn = def[key]
    acc[key] = typeof fn === 'function' ? (...args) => fn(payload, ...args) : fn
    return acc
  }, {})
}

export function usePayload({ state, module = {}, api = {}, computedMap = {}, context = {} } = {}) {
  // 1. 变量：payload 本身就是响应式变量集合
  const payload = reactive(typeof state === 'function' ? state() : state || {})

  // 2. 公共能力注入（$msg / $router / $route / $props / $emit）
  payload.$msg = useFeedback()
  try {
    payload.$router = useRouter()
    payload.$route = useRoute()
  } catch (e) {
    // 非路由上下文（极少见）下忽略
  }
  if (context && context.props) payload.$props = context.props
  if (context && context.emit) payload.$emit = context.emit

  // 3. api-request 自动装配到 payload.api
  const apiDef = (api && api.index) || api
  payload.api = bindWithPayload(payload, apiDef)

  // 4. module 方法自动装配到 payload（方法名直接作为 payload 属性）
  const moduleIndex = (module && module.index) || module || {}
  const bound = bindWithPayload(payload, moduleIndex)
  Object.keys(bound).forEach((key) => {
    payload[key] = bound[key]
  })

  // 5. 生命周期自动注册（module/lifecycle.js 中的钩子）
  const lifecycle = (module && module.lifecycle) || {}
  Object.keys(lifecycle).forEach((hookName) => {
    const registrar = LIFECYCLE_REGISTRARS[hookName]
    if (registrar && typeof lifecycle[hookName] === 'function') {
      registrar(() => lifecycle[hookName](payload))
    }
  })

  // 6. 计算属性（可选）
  Object.keys(computedMap || {}).forEach((key) => {
    const getter = computedMap[key]
    if (typeof getter === 'function') {
      payload[key] = computed(() => getter(payload))
    }
  })

  return payload
}

export default usePayload
