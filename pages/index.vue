<template>
  <div class="row"></div>
</template>
<script>
export default {
  name: 'Index',
  head() {
    return {
      title: this.$t('menu.dashboard')
    }
  },
  meta: {
    pageTitle: 'menu.dashboard'
  },
  data() {
    return {
      image: null
    }
  }
}
</script>
