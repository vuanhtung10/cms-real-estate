<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors }"
  >
    <b-form-group v-bind="$attrs" :label-class="required ? 'required' : null">
      <audio-upload
        v-model="innerValue"
        v-bind="$attrs"
        @getDuration="getDuration"
      />
      <b-form-invalid-feedback :class="{ 'd-block': errors[0] || error }">{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import AudioUpload from '~/components/base/input/AudioUpload'

export default {
  components: {
    AudioUpload,
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
    if (this.value) {
      this.innerValue = this.value
    }
  },
  methods: {
    getDuration(duration) {
      this.$emit('getDuration', duration)
    }
  }
}
</script>
