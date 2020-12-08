<template>
  <validation-provider
    v-slot="{ errors }"
    :rules="rules"
    :name="dataVvAs"
    :vid="vid"
  >
    <div :class="{ 'has-danger': error }" class="form-group">
      <label v-if="label && type !== 'checkbox'"
        >{{ label }} <span v-if="required" class="text-danger">(*)</span></label
      >
      <template v-if="type == 'text' || type == 'password' || type == 'number'">
        <div v-if="isGroup" class="input-group-group">
          <div v-if="prepend" class="input-group-prepend">
            <slot name="input-group-prepend"></slot>
          </div>
          <input
            ref="input"
            :value="value"
            :name="name"
            :type="type"
            :data-vv-as="dataVvAs"
            :class="[error || errors.length > 0 ? 'is-invalid' : null]"
            :placeholder="placeholder ? placeholder : label ? label : ''"
            :disabled="isDisabled"
            :readonly="readonly"
            @input="$emit('input', $event.target.value)"
            autocomplete="off"
            class="form-control"
          />
          <div v-if="!prepend" class="input-group-append">
            <slot name="input-group-append"></slot>
          </div>
        </div>

        <input
          ref="input"
          v-else
          :value="value"
          :name="name"
          :type="type"
          :data-vv-as="dataVvAs"
          :class="[error || errors.length > 0 ? 'is-invalid' : null]"
          :placeholder="placeholder ? placeholder : label ? label : ''"
          :disabled="isDisabled"
          @input="$emit('input', $event.target.value)"
          autocomplete="off"
          class="form-control"
        />
      </template>

      <template v-else-if="type == 'checkbox'">
        <label class="m-checkbox m-checkbox--state-primary">
          <input
            ref="input"
            :name="name"
            :checked="value == trueValue"
            @change="
              $emit('input', $event.target.checked ? trueValue : falseValue)
            "
            type="checkbox"
          />
          {{ label }}
          <span></span>
        </label>
      </template>

      <template v-else-if="type == 'select'">
        <the-select2
          ref="input"
          v-model="selectVal"
          :class="[error || errors.length > 0 ? 'is-invalid' : null]"
          :options="selectOptions.options ? selectOptions.options : null"
          :placeholder="
            selectOptions.placeholder ? selectOptions.placeholder : ''
          "
          :multiple="selectOptions.multiple ? selectOptions.multiple : false"
          :searchable="
            selectOptions.searchable ? selectOptions.searchable : false
          "
          :allow-clear="
            selectOptions.allowClear ? selectOptions.allowClear : false
          "
          :text-field="
            selectOptions.textField ? selectOptions.textField : 'text'
          "
          :id-field="selectOptions.idField ? selectOptions.idField : 'id'"
          :ajax="selectOptions.ajax ? selectOptions.ajax : ''"
          :post-data="selectOptions.postData ? selectOptions.postData : {}"
          :has-all-option="
            selectOptions.hasAllOption ? selectOptions.hasAllOption : false
          "
          :text-format="
            selectOptions.textFormat ? selectOptions.textFormat : null
          "
          :disabled="isDisabled"
          class="form-control"
        ></the-select2>
      </template>

      <template v-else>
        <textarea
          ref="input"
          :value="value"
          :type="type"
          :class="[error || errors.length > 0 ? 'is-invalid' : null]"
          :placeholder="placeholder ? placeholder : label ? label : ''"
          :disabled="isDisabled"
          @input="$emit('input', $event.target.value)"
          autocomplete="off"
          class="form-control"
          rows="5"
        ></textarea>
      </template>

      <div v-if="error || errors.length > 0" class="invalid-feedback">
        {{ errors[0] || error }}
      </div>
    </div>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import TheSelect2 from '~/components/base/TheSelect2'
export default {
  name: 'FormControl',
  components: { TheSelect2, ValidationProvider },
  props: {
    value: {
      type: [Array, Object, String, Boolean],
      default: () => null
    },
    label: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    selectOptions: {
      type: Object,
      default: () => {}
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    trueValue: {
      type: Boolean,
      default: true
    },
    falseValue: {
      type: Boolean,
      default: false
    },
    prepend: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Array, String, Object],
      default: () => null
    },
    dataVvAs: {
      type: String,
      default: null
    },
    vid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectVal: null
    }
  },
  watch: {
    value(val) {
      this.selectVal = val
    },
    selectVal(val) {
      this.$emit('input', val)
    }
  },
  created() {
    if (this.value) {
      this.selectVal = this.value
    }
  }
}
</script>
