<template>
  <ValidationProvider :name="$attrs.label" :rules="rules">
    <div class="kt-checkbox kt-checkbox--primary kt-padding-l-0">
      <label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand">
        <input v-model="innerValue" type="checkbox" class="form-check-input" />
        {{ $attrs.label }}
        <span></span>
      </label>
    </div>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider
  },
  props: {
    vid: {
      type: String,
      default: null
    },
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: [Boolean, Number],
      default: false
    },
    error: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerValue: false
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    value(newVal) {
      this.innerValue = newVal
    }
  },
  created() {
    if (this.value) {
      if (typeof this.value === 'number') {
        if (this.value) {
          this.innerValue = true
        } else {
          this.innerValue = false
        }
      } else {
        this.innerValue = this.value
      }
    } else {
      this.innerValue = false
      this.$emit('input', this.innerValue)
    }
  }
}
</script>
