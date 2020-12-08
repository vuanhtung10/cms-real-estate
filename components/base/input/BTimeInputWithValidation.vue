<template>
  <validation-provider
    :vid="vid"
    :name="$attrs.label ? $attrs.label : $attrs['label-name']"
    :rules="rules"
    v-slot="{ errors }"
  >
    <b-form-group v-bind="$attrs" :label-class="required ? 'required' : null">
      <b-form-input
        v-model="innerValue"
        v-bind="$attrs"
        :autocomplete="'disabled'"
        :state="errors[0] || error !== null ? false : null"
        :disabled="disabled"
        v-mask="'##:##'"
      ></b-form-input>
      <b-form-invalid-feedback>{{
        errors[0] || error
      }}</b-form-invalid-feedback>
    </b-form-group>
  </validation-provider>
</template>

<script>
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import VueMask from 'v-mask'
Vue.use(VueMask)

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
    }
  },
  data: () => ({
    innerValue: ''
  }),
  watch: {
    innerValue(newVal) {
      this.$emit('input', this.convertTimeToSecond(newVal))
    }
  },
  created() {
    if (this.value) {
      this.initValue()
    }
  },
  methods: {
    initValue() {
      this.innerValue = this.convertSecontToTime(this.value)
    },
    convertSecontToTime(second) {
      if (!second) {
        return ''
      }
      const minutes = Math.floor(second / 60)
      const seconds = second % 60
      return [minutes, seconds].map((v) => (v < 10 ? '0' + v : v)).join(':')
    },
    convertTimeToSecond(time) {
      if (!time) {
        return ''
      }
      const timeArr = time.split(':')
      if (typeof timeArr[1] !== 'undefined' && timeArr[1]) {
        return parseInt(timeArr[0]) * 60 + parseInt(timeArr[1])
      } else {
        return parseInt(timeArr[0]) * 60
      }
    }
  }
}
</script>
