import moment from 'moment'

export const formatTimeNormal = (time) => {
  console.log(
    'moment',
    moment(time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
  )
  return moment(time, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
}

export const formatDateTime = (time) => {
  return moment(time, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
}

export const formatDateTimeNormal = (time) => {
  return moment(time).format('DD/MM/YYYY HH:mm')
}
