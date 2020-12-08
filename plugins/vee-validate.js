import { extend, localize } from 'vee-validate'
import {
  required,
  max,
  email,
  confirmed,
  numeric,
  between,
  // eslint-disable-next-line camelcase
  max_value
} from 'vee-validate/dist/rules'
import vi from 'vee-validate/dist/locale/vi.json'
import en from 'vee-validate/dist/locale/en.json'
import {
  PASSWORD_REGEX,
  PERMISSION_REGEX,
  USER_NAME_REGEX
} from '~/constants/regex'

extend('required', required)
extend('max', max)
extend('email', email)
extend('confirmed', confirmed)
extend('numeric', numeric)
extend('max_value', max_value)
extend('between', between)
extend('isPassword', {
  getMessage: '',
  validate(value) {
    return PASSWORD_REGEX.test(value)
  }
})

extend('isUsername', {
  getMessage: '',
  validate(value) {
    return USER_NAME_REGEX.test(value)
  }
})

extend('isPermissionName', {
  getMessage: '',
  validate(value) {
    return PERMISSION_REGEX.test(value)
  }
})

extend('confirmedTarget', {
  getMessage: '',
  validate(value, target) {
    if (
      value !== null &&
      value !== undefined &&
      target !== null &&
      target !== undefined &&
      target.aid !== null &&
      target.aid !== undefined
    ) {
      return value === target.aid
    } else {
      return false
    }
  },
  params: [
    {
      name: 'aid',
      isTarget: true
    }
  ]
})

localize('vi', {
  messages: {
    isPassword:
      'Mật khẩu phải bao gồm chữ hoa, chữ thường, số, kí tự đặc biệt và tối thiểu 8 kí tự',
    isUsername:
      'Tên người dùng chỉ sử dụng chữ cái không dấu hoặc chữ số và không được bắt đầu bằng chữ số',
    isPermissionName: 'Tên quyền không được chứa ký tự & hoặc |',
    confirmedTarget: '{_field_} khác với {aid}'
  }
})
localize('en', {
  messages: {
    isPassword:
      'Passwords must include uppercase, lowercase, numeric, special characters, and a minimum of 8 characters',
    isUsername:
      'User names are only alphanumeric or numeric and may not begin with a digit',
    isPermissionName: "Permission name can't contain character & or |",
    confirmedTarget: '{_field_} confirmation does not match with {aid}'
  }
})
localize({
  en,
  vi
})
