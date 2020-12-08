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
      <the-mask
        v-model="innerValue"
        @change="emitValue"
        v-bind="$attrs"
        :autocomplete="'disabled'"
        :state="errors[0] || error !== null ? false : null"
        :disabled="disabled"
        :class="errors[0] || error !== null ? 'is-invalid' : ''"
        class="form-control"
      >
      </the-mask>
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { TheMask } from 'vue-the-mask'
export default {
  components: {
    ValidationProvider,
    TheMask
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
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    innerValue(newVal) {
      if (!this.lazy) {
        this.$emit('input', newVal)
      }
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
    emitValue() {
      if (this.lazy) {
        this.$emit('input', this.innerValue)
      }
    }
  }
}
</script>
