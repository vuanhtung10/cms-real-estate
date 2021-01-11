import axios from 'axios'

export default function({ $auth, app, $axios }, inject) {
  axios.interceptors.request.use((request) => {
    const token = $auth.strategy.token.get()
    if (token) {
      request.headers.common.Authorization = `${token}`
    }

    const locale = app.i18n.locale
    if (locale) {
      request.headers.common['Accept-Language'] = locale
    }

    return request
  })

  inject('canPermission', (checkPerm) => {
    const permissions = $auth.user.permissions
    if (!checkPerm) {
      return true
    }
    if (Array.isArray(checkPerm)) {
      return checkPerm.some((r) => permissions.includes(r))
    } else {
      return permissions.includes(checkPerm)
    }
  })
}
