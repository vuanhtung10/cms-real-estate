<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors }"
  >
    <b-form-group v-bind="$attrs" :label-class="required ? 'required' : null">
      <the-select2
        ref="input"
        v-model="innerValue"
        :has-all-option="hasAllOption"
        v-bind="$attrs"
        :class="[error || errors.length > 0 ? 'is-invalid' : null]"
        class="form-control"
      />
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import TheSelect2 from '~/components/base/TheSelect2'

export default {
  components: {
    TheSelect2,
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
    hasAllOption: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerValue: null
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
