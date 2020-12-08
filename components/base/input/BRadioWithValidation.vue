<template>
  <ValidationProvider
    :vid="vid"
    :name="$attrs.name"
    :rules="rules"
    v-slot="{ errors }"
  >
    <b-form-group
      v-bind="$attrs"
      :label-class="
        $attrs['label-class'] + ' ' + (required ? 'required' : null)
      "
      :class="formClass"
    >
      <template v-slot:label>
        <slot name="label"></slot>
      </template>
      <b-form-radio-group
        v-bind="$attrs"
        :label-class="required ? 'required' : null"
        :state="errors[0] || error !== null ? false : null"
        v-model="innerValue"
      >
        <slot />
      </b-form-radio-group>
      <b-form-invalid-feedback id="inputLiveFeedback">{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
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
      type: null,
      default: ''
    },
    error: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    formClass: {
      type: String,
      default: ''
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
      this.innerValue = newVal
    }
  },
  created() {
    this.innerValue = this.value
  }
}
</script>
