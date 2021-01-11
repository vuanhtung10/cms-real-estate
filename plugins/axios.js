import { notifyNoPermission } from '~/utils/bootstrap-notify'

export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    // console.log('Making request to ' + JSON.stringify(config))
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/auth/login')
    }
    if (code === 403) {
      notifyNoPermission()
    }
  })
}
