<template>
  <div class="kt-grid kt-grid--ver kt-grid--root">
    <div
      :style="
        `background-image:url(${require('~/assets/media/error/bg6.jpg')})`
      "
      class="kt-grid__item kt-grid__item--fluid kt-grid  kt-error-v6"
    >
      <div class="kt-error_container">
        <div class="kt-error_subtitle kt-font-light">
          <h1>Thông báo!</h1>
        </div>
        <p class="kt-error_description kt-font-light">
          Có lỗi xảy ra.<br />
          Xin vui lòng thử lại sau.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error500',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    return {
      title: 'Lỗi 500'
    }
  }
}
</script>
