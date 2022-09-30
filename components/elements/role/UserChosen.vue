<template>
  <select2-with-validation
    :required="required"
    v-model="user"
    :error="error"
    :multiple="multiple"
    v-bind="$attrs"
    placeholder="Chọn chủ sở hữu..."
    label="Chủ sở hữu"
    data-vv-as="Chủ sở hữu"
    id-field="_id"
    text-field="display_name"
    ajax="/user/suggest"
    name="user"
  />
</template>

<script>
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
export default {
  name: 'UserChosen',
  components: { Select2WithValidation },
  props: {
    error: {
      type: String,
      default: ''
    },
    value: {
      type: [Object, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      user: null
    }
  },
  watch: {
    user(val) {
      this.$emit('input', val)
    },
    value(newVal, oldVal) {
      if (newVal) {
        if (!oldVal || (oldVal && newVal.id !== oldVal.id)) {
          this.user = newVal
        }
      } else {
        this.user = newVal
      }
    }
  },
  created() {
    if (this.value) {
      this.$nextTick(() => (this.user = this.value))
    }
  }
}
</script>
