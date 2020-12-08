<template>
  <div :class="{ 'kt-portlet--height-fluid': fullHeight }" class="kt-portlet">
    <div v-if="title" class="kt-portlet__head">
      <div v-if="title" class="kt-portlet__head-label">
        <span v-if="iconClass" class="kt-portlet__head-icon">
          <i :class="iconClass"></i>
        </span>
        <h3 class="kt-portlet__head-title">{{ title }}</h3>
      </div>

      <div class="kt-portlet__head-toolbar">
        <div class="kt-portlet__head-wrapper">
          <slot name="tool"></slot>
        </div>
      </div>
    </div>
    <div class="kt-portlet__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThePortlet',
  props: {
    title: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: null
    },
    fullHeight: {
      type: Boolean,
      default: false
    }
  }
}
</script>
