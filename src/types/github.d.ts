type NotificationType = {
  id: string
  reason: string
  updated_at: number
  subject: {
    title: string
  }
  repository: {
    owner: {
      login: string
    }
  }
}
