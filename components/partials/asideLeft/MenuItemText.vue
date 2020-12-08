<template>
  <fragment>
    <i v-if="item.icon" :class="['kt-menu__link-icon', item.icon]" />

    <i
      v-if="parentItem && parentItem.bullet === 'dot'"
      class="kt-menu__link-bullet kt-menu__link-bullet--dot"
    >
      <span />
    </i>

    <i
      v-if="parentItem && parentItem.bullet === 'line'"
      class="kt-menu__link-bullet kt-menu__link-bullet--line"
    >
      <span />
    </i>

    <span class="kt-menu__link-text" style="white-space: nowrap">
      {{ $t(item.title) }}
    </span>

    <span v-if="item.badge" class="kt-menu__link-badge">
      <span :class="['kt-badge', item.badge.type]">
        {{ item.badge.value }}
      </span>
    </span>

    <i v-if="item.submenu" class="kt-menu__ver-arrow la la-angle-right"></i>
  </fragment>
</template>

<script>
export default {
  name: 'MenuItemText',
  props: {
    item: {
      type: Object,
      default: () => null
    },
    parentItem: {
      type: Object,
      default: () => null
    }
  }
}
</script>
