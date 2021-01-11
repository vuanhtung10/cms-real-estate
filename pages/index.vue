<template>
  <div class="row"></div>
</template>
<script>
export default {
  name: 'Index',
  auth: false,
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
  },
  mounted() {
    console.log(this.$auth.strategy.token.get())
  }
}
</script>
