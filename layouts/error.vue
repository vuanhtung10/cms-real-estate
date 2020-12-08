<template>
  <component :is="errorPage" :error="error" />
</template>

<script>
import error403 from '~/components/error/Error403'
import error404 from '~/components/error/Error404'
import error500 from '~/components/error/Error500'

export default {
  name: 'Error',
  layout: 'error-layout',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      bodyAttrs: {
        spellcheck: 'false',
        class:
          'kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-header-base-light kt-header-menu-light kt-brand-dark kt-aside-dark'
      }
    }
  },
  computed: {
    errorPage() {
      if (this.error.statusCode === 403) {
        return error403
      }

      if (this.error.statusCode === 404) {
        return error404
      }
      // catch everything else
      if (this.error.statusCode === 500) {
        return error500
      }
      return null
    }
  }
}
</script>
