/* eslint-disable no-lonely-if */
export const formatDuration = (duration) => {
  let result = ''
  const hh = Math.floor(duration / 3600)
  const mm = Math.round((duration - hh * 3600) / 60)
  if (duration !== undefined && duration !== '') {
    if (hh < 10) {
      if (mm < 10) {
        result = '0' + hh + ':' + '0' + mm
      } else {
        result = '0' + hh + ':' + mm
      }
    } else {
      if (mm < 10) {
        result = hh + ':' + '0' + mm
      } else {
        result = hh + ':' + mm
      }
    }
  }
  return result
}
