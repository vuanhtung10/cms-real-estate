<template>
  <div></div>
</template>

<script>
import $ from 'jquery'
import 'bootstrap'
require('summernote/dist/summernote.min.css')
require('summernote')
export default {
  name: 'VueSummernote',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 500
    },
    minHeight: {
      type: Number,
      default: 200
    },
    maxHeight: {
      type: Number,
      default: 700
    },
    focus: {
      type: Boolean,
      default: true
    },
    defaultFontSize: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Array,
      default: () => [
        // [groupName, [list of button]]
        [
          'style',
          ['style', 'bold', 'italic', 'underline', 'strikethrough', 'clear']
        ],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']]
      ]
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      if (this.innerValue !== newVal) {
        $(this.$el).summernote('code', newVal)
        this.innerValue = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
  mounted() {
    const self = this
    const initOptions = {
      placeholder: self.placeholder,
      height: self.height,
      minHeight: self.minHeight,
      maxHeight: self.maxHeight,
      focus: self.focus,
      fontSizes: ['8', '9', '10', '11', '12', '14', '17', '18', '24', '36'],
      toolbar: self.toolbar,
      callbacks: {
        onInit() {
          self.$emit('onInit')
        },
        onEnter() {
          self.$emit('onEnter')
        },
        onFocus() {
          self.$emit('onFocus')
        },
        onBlur() {
          self.$emit('onBlur')
        },
        onKeyup(e) {
          self.$emit('onKeyup', e)
        },
        onKeydown(e) {
          self.$emit('onKeydown', e)
        },
        onPaste(e) {
          self.$emit('onPaste', e)
        },
        onImageUpload(files) {
          self.$emit('onImageUpload', files)
        },
        onChange(contents) {
          self.innerValue = contents
        }
      }
    }
    const params = Object.assign({}, initOptions)

    $(this.$el).summernote(params)
    $(this.$el).summernote('code', this.value)
    $(this.$el).summernote('lineHeight', 1.4)
    if (this.defaultFontSize) {
      $(this.$el).summernote('fontSize', 17)
    }
  },
  beforeDestroy() {
    $(this.$el).summernote('destroy')
  }
}
</script>
