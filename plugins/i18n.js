import { localize } from 'vee-validate'

// eslint-disable-next-line import/no-mutable-exports
let i18n = null
export default function({ app }) {
  i18n = app.i18n
  localize(app.i18n.locale || 'vi')
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    localize(newLocale)
  }
}

export { i18n }
