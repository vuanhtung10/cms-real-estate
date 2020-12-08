<template>
  <li class="kt-menu__section">
    <h4 class="kt-menu__section-text">{{ $t(item.section) }}</h4>
    <i class="kt-menu__section-icon flaticon-more-v2"></i>
  </li>
</template>

<script>
export default {
  name: 'MenuSection',
  props: {
    item: {
      type: Object,
      default: () => null
    }
  }
}
</script>
