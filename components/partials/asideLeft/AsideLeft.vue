<template>
  <div
    id="kt_aside"
    class="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop"
  >
    <brand-logo />
    <div
      id="kt_aside_menu_wrapper"
      class="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid"
    >
      <client-only>
        <perfect-scrollbar :options="scrollOptions">
          <main-menu />
        </perfect-scrollbar>
      </client-only>
    </div>
  </div>
</template>

<script>
import BrandLogo from '~/components/partials/BrandLogo'
import MainMenu from '~/components/partials/asideLeft/MainMenu'
export default {
  name: 'AsideLeft',
  components: { MainMenu, BrandLogo },
  data() {
    return {
      scrollOptions: { wheelSpeed: 2, wheelPropagation: false }
    }
  }
}
</script>
