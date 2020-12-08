<template>
  <el-date-picker
    v-model="selected"
    :picker-options="pickerOptions"
    type="datetime"
    placeholder="Chọn thời gian cho buổi học"
    format="dd/MM/yyyy HH:mm"
  >
  </el-date-picker>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DateTimePicker',
  props: {
    value: {
      type: Number,
      require: true,
      default: 0
    },
    pickerOptions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selected: null
    }
  },
  watch: {
    selected(val) {
      if (val) {
        this.$emit('input', moment(val).valueOf())
      } else {
        this.$emit('input', null)
      }
    }
  },
  created() {
    if (this.value) {
      this.selected = moment(this.value).valueOf()
    }
  }
}
</script>
