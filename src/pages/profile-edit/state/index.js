// ============================================================
// ProfileEdit - 状态（变量）
// ============================================================

export default function createState() {
  return {
    name: '',
    title: '',
    bio: '',
    email: '',
    website: '',
    avatar: '',
    bioCount: 0,
    submitting: false,
    uploadingAvatar: false,
    pendingFile: null, // 等待「保存更改」时上传的头像文件（D3）
    _originalAvatar: '', // 进入页面的原头像（取消时还原）
    _avatarObjectUrl: '', // 本地预览
  }
}
