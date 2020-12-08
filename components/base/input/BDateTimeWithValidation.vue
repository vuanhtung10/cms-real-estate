<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ valid, errors }"
  >
    <div class="date-time-picker">
      <b-form-group v-bind="$attrs" :label-class="required ? 'required' : null">
        <date-time-picker
          v-model="innerValue"
          v-bind="$attrs"
          :class="[error || errors.length > 0 ? 'is-invalid' : null]"
          :picker-options="pickerOptions"
          class="form-control"
        >
        </date-time-picker>
        <b-form-invalid-feedback>{{
          errors[0] || error
        }}</b-form-invalid-feedback>
      </b-form-group>
    </div>
  </validation-provider>
</template>

<script>
import moment from 'moment'
import { ValidationProvider } from 'vee-validate'
import DateTimePicker from '~/components/base/DateTimePicker'

export default {
  name: 'BDateTimeWithValidation',
  components: {
    ValidationProvider,
    DateTimePicker
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
    pickerOptions: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    innerValue: null
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', moment(newVal).format('DD/MM/YYYY hh:mm'))
    }
  },
  created() {
    this.innerValue = moment(this.value).valueOf()
  }
}
</script>
