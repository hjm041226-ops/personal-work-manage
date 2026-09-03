// ============================================================
// ProfileEdit - 状态（变量）
// ============================================================

export default function createState() {
  return {
    name: '',
    bio: '',
    email: '',
    website: '',
    avatar: '',
    bioCount: 0,
    submitting: false,
    _avatarObjectUrl: '',
  }
}
