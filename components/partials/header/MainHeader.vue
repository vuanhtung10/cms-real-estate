<template>
  <div id="kt_header" class="kt-header kt-grid__item  kt-header--fixed ">
    <!-- begin:: Header Menu -->
    <button
      id="kt_header_menu_mobile_close_btn"
      class="kt-header-menu-wrapper-close"
    >
      <i class="la la-close"></i>
    </button>
    <div class="d-flex align-items-center pl-4">
      <h4 class="text-dark">
        {{ $t($store.state.page.pageTitle) }}
      </h4>
    </div>

    <top-bar />
  </div>
</template>

<script>
import TopBar from '~/components/partials/header/TopBar'
export default {
  name: 'MainHeader',
  components: { TopBar }
}
</script>
