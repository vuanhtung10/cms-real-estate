<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ valid, errors }"
  >
    <b-form-group v-bind="$attrs" :label-class="required ? 'required' : null">
      <date-range-picker
        v-model="innerValue"
        v-bind="$attrs"
        :class="[error || errors.length > 0 ? 'is-invalid' : null]"
        class="form-control"
      >
      </date-range-picker>
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import DateRangePicker from '~/components/base/DateRangePicker'

export default {
  name: 'BDateRangeWithValidation',
  components: {
    ValidationProvider,
    DateRangePicker
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
    }
  },
  data: () => ({
    innerValue: [null, null]
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', newVal)
    }
  },
  created() {
    this.innerValue = this.value
  }
}
</script>
