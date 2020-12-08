<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label ? $attrs.label : $attrs['label-name']"
    :rules="rules"
    v-slot="{ errors }"
  >
    <b-form-group
      v-bind="$attrs"
      :label-class="required ? 'required' : null"
      :class="formClass"
    >
      <b-form-tags
        v-model="innerValue"
        v-bind="$attrs"
        :state="errors[0] || error !== null ? false : null"
        :disabled="disabled"
      ></b-form-tags>
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
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
      type: null,
      default: null
    },
    error: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formClass: {
      type: String,
      default: null
    }
  },
  data: () => ({
    innerValue: []
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
      this.innerValue = this.value
    }
  }
}
</script>
