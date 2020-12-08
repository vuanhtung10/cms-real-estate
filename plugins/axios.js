import { notifyNoPermission } from '~/utils/bootstrap-notify'

export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    // console.log('Making request to ' + JSON.stringify(config))
  })

  $axios.onError((error) => {
    console.log(error)
    const code = parseInt(error.response && error.response.status)
    console.log(code)
    if (code === 400) {
      redirect('/auth/login')
    }
    if (code === 403) {
      notifyNoPermission()
    }
  })
}
