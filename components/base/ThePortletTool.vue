<template>
  <div id="kt_portlet_tools_2" class="kt-portlet" data-ktportlet="true">
    <div class="kt-portlet__head">
      <div v-if="title != null" class="kt-portlet__head-label">
        <h3 class="kt-portlet__head-title">
          {{ title }}
        </h3>
      </div>
      <div class="kt-portlet__head-toolbar">
        <div class="kt-portlet__head-group">
          <a
            v-show="showToggleIcon"
            href="#"
            data-ktportlet-tool="toggle"
            class="btn btn-sm btn-icon btn-default btn-icon-md"
            aria-describedby="tooltip_1uj8v86z6l"
            ><i class="la la-angle-down"></i
          ></a>
          <slot name="tool"></slot>
        </div>
      </div>
    </div>
    <div class="kt-portlet__body" kt-hidden-height="222" style="">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThePortletTool',
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
    },
    showToggleIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      toggle: true
    }
  },
  methods: {
    toggleAction() {
      this.toggle = !this.toggle
    }
  }
}
</script>
