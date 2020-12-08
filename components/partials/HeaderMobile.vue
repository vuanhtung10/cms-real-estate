<template>
  <div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed ">
    <div class="kt-header-mobile__logo">
      <nuxt-link to="/">
        <img alt="Logo" src="~/assets/media/logos/logo-light.png" />
      </nuxt-link>
    </div>
    <div class="kt-header-mobile__toolbar">
      <button
        id="kt_aside_mobile_toggler"
        class="kt-header-mobile__toggler kt-header-mobile__toggler--left"
      >
        <span></span>
      </button>
      <button id="kt_header_mobile_toggler" class="kt-header-mobile__toggler">
        <span></span>
      </button>
      <button
        id="kt_header_mobile_topbar_toggler"
        class="kt-header-mobile__topbar-toggler"
      >
        <i class="flaticon-more"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderMobile'
}
</script>
