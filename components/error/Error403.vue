<template>
  <div class="kt-grid kt-grid--ver kt-grid--root">
    <div
      :style="
        `background-image:url(${require('~/assets/media/error/bg2.jpg')})`
      "
      class="kt-grid__item kt-grid__item--fluid kt-grid kt-error-v2"
    >
      <div class="kt-error_container">
        <span class="kt-error_title2 kt-font-light">
          <h1>Thông báo!</h1>
        </span>
        <span class="kt-error_desc kt-font-light">
          Trang bạn tìm kiếm không có quyền truy cập.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error403',
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    return {
      title: 'Lỗi 403'
    }
  }
}
</script>
