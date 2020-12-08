import moment from 'moment'

export const valideChangeDateTime = (scheduled, index) => {
  // eslint-disable-next-line no-unused-vars
  let message = ''
  const dt = scheduled[index].start_time
    ? moment(scheduled[index].start_time).valueOf()
    : null
  for (let i = 0; i < scheduled.length; i++) {
    if (index === 0) {
      if (scheduled[i].start_time) {
        if (i !== index) {
          if (moment(scheduled[i].start_time).valueOf() <= dt) {
            message = 'Thời gian không được lớn hơn lịch học tiêp theo'
          }
        }
      }
    } else if (index === scheduled.length - 1) {
      if (scheduled[i].start_time) {
        if (i !== index) {
          if (dt <= moment(scheduled[i].start_time).valueOf()) {
            message = 'Thời gian không được nhỏ hơn lịch học trước'
          }
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (i < index) {
        if (scheduled[i].start_time) {
          if (i !== index) {
            if (dt <= moment(scheduled[i].start_time).valueOf()) {
              message = 'Thời gian không được nhỏ hơn lịch học trước'
            }
          }
        }
      } else if (i > index) {
        if (scheduled[i].start_time) {
          if (i !== index) {
            if (dt >= moment(scheduled[i].start_time).valueOf()) {
              message = 'Thời gian không được lớn hơn lịch học tiêp theo'
            }
          }
        }
      }
    }
  }
  return message
}
