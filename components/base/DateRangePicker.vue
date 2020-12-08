<template>
  <el-date-picker
    v-model="selected"
    :picker-options="pickerOptions"
    :default-time="['00:00:00', '23:59:59']"
    format="dd/MM/yyyy HH:mm"
    value-format="timestamp"
    type="datetimerange"
    align="right"
    unlink-panels
    range-separator="đến"
    start-placeholder="Ngày bắt đầu"
    end-placeholder="Ngày kết thúc"
  >
  </el-date-picker>
</template>

<script>
import moment from 'moment'

export default {
  name: 'DateRangePicker',
  props: {
    value: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      selected: [null, null],
      pickerOptions: {
        shortcuts: [
          {
            text: 'Hôm nay',
            onClick(picker) {
              picker.$emit('pick', [
                moment().startOf('day'),
                moment().endOf('day')
              ])
            }
          },
          {
            text: '7 ngày tới',
            onClick(picker) {
              picker.$emit('pick', [
                moment().startOf('day'),
                moment()
                  .endOf('day')
                  .add(6, 'day')
              ])
            }
          },
          {
            text: '30 ngày tới',
            onClick(picker) {
              picker.$emit('pick', [
                moment().startOf('day'),
                moment()
                  .endOf('day')
                  .add(29, 'day')
              ])
            }
          },
          {
            text: 'Tuần này',
            onClick(picker) {
              picker.$emit('pick', [
                moment().startOf('week'),
                moment().endOf('week')
              ])
            }
          },
          {
            text: 'Tuần tới',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .add(1, 'week')
                  .startOf('week'),
                moment()
                  .add(1, 'week')
                  .endOf('week')
              ])
            }
          },
          {
            text: 'Tháng tới',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .add(1, 'month')
                  .startOf('month'),
                moment()
                  .add(1, 'month')
                  .endOf('month')
              ])
            }
          }
        ]
      }
    }
  },
  watch: {
    selected(val) {
      if (val) {
        this.$emit('input', [
          moment(val[0]).toISOString(),
          moment(val[1]).toISOString()
        ])
      } else {
        this.$emit('input', [null, null])
      }
    }
  },
  created() {
    if (this.value) {
      this.selected = [
        moment(this.value[0]).valueOf(),
        moment(this.value[1]).valueOf()
      ]
    }
  }
}
</script>
