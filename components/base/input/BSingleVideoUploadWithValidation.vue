<template>
  <div>
    <validation-provider :rules="rules" v-slot="{ errors }" name="Video ID">
      <b-form-group
        v-bind="$attrs"
        :label-class="required ? 'required' : null"
        label="Video ID"
      >
        <b-form-input
          v-model="innerValue.id"
          v-bind="$attrs"
          :state="errors[0] || error !== null ? false : null"
          placeholder="Video ID"
        ></b-form-input>
        <b-form-invalid-feedback>{{
          errors[0] || error
        }}</b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>
    <b-row v-if="showTime">
      <b-col>
        <b-time-input-with-validation
          v-model="innerValue.start"
          label="Thời gian bắt đầu"
          placeholder="mm:ss"
        />
      </b-col>
      <b-col>
        <b-time-input-with-validation
          v-model="innerValue.end"
          label="Thời gian kết thúc"
          placeholder="mm:ss"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { ValidationProvider } from 'vee-validate'
import BTimeInputWithValidation from '~/components/base/input/BTimeInputWithValidation'

export default {
  components: {
    ValidationProvider,
    BTimeInputWithValidation
  },
  props: {
    rules: {
      type: [Object, String],
      default: ''
    },
    value: {
      type: Object,
      default: () => {}
    },
    error: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    showTime: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    innerValue: {}
  }),
  watch: {
    innerValue: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  created() {
    if (this.value) {
      this.initValue()
    }
  },
  methods: {
    initValue() {
      this.innerValue = cloneDeep(this.value)
    }
  }
}
</script>
