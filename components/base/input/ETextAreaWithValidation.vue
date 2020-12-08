<template>
  <validation-provider
    :vid="vid"
    :name="label"
    :rules="rules"
    v-slot="{ valid, errors }"
  >
    <template>
      <div
        :class="{ 'has-danger': error, 'has-danger': errors }"
        class="form-group kt-form__group "
      >
        <label
          >{{ label }}
          <span v-if="required" class="text-danger">(*)</span></label
        >
        <el-input
          ref="input"
          v-model="innerValue"
          v-bind="$attrs"
          :maxlength="maxLength"
          :show-word-limit="showWordLimit"
          :name="name"
          :class="{ 'error-text-area-class': errors[0] || error }"
          class=" kt-form__control m-input"
          type="textarea"
        >
        </el-input>
        <div
          v-if="errors[0] || error"
          class="form-control-feedback text-danger"
        >
          {{ errors[0] || error }}
        </div>
      </div>
    </template>
  </validation-provider>
</template>

<style>
.error-text-area-class .el-textarea__inner {
  border-color: red !important;
}
</style>

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
    maxLength: {
      type: Number,
      default: 255
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
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
  }
}
</script>
