<template>
  <select :disabled="isDisabled" class="form-control kt-select2"> </select>
</template>

<script>
import 'select2'
import isEqual from 'lodash/isEqual'
import unionBy from 'lodash/unionBy'
import $ from 'jquery'

export default {
  name: 'TheSelect2',
  props: {
    value: {
      type: [Object, Array],
      default: () => null
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Vui lòng chọn một lựa chọn...'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: true
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    idField: {
      type: String,
      default: '_id'
    },
    textField: {
      type: String,
      default: 'text'
    },
    ajax: {
      type: String,
      default: ''
    },
    postData: {
      type: Object,
      default: () => {}
    },
    hasAllOption: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    textFormat: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      ajaxResult: []
    }
  },
  computed: {
    mapOptions() {
      return this.options.map((item) => {
        const obj = Object.assign({}, item)

        obj.id = item.id || item[this.idField]
        obj.text = item.text || item[this.textField]

        return obj
      })
    },
    initPlaceholder() {
      if (this.placeholder !== 'Vui lòng chọn một lựa chọn...')
        return this.placeholder
      return this.$t('select2.placeholder')
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (!isEqual(newVal, oldVal)) {
        if (this.ajax === '') {
          const selectedValue = this.getOriginSelectedValue(newVal)
          $(this.$el)
            .val(selectedValue)
            .trigger('change')
        } else if (newVal) {
          if (!this.multiple) {
            if (
              !oldVal ||
              (oldVal && newVal[this.idField] !== oldVal[this.idField])
            ) {
              const option = new Option(
                newVal[this.textField],
                newVal[this.idField],
                true,
                true
              )

              $(this.$el)
                .empty()
                .append(option)
                .trigger('change', [true])
              $(this.$el).trigger({
                type: 'select2:select',
                params: {
                  data: newVal
                }
              })
            }
          } else {
            if (this.hasAllOption) {
              if (this.checkHasOptionAll(newVal)) {
                newVal = this.ajaxResult.filter((e) => {
                  return e.id !== -1
                })
                this.$emit('input', this.getOriginSelected(newVal))
              }
            }

            this.ajaxResult = unionBy(this.ajaxResult, newVal, this.idField)

            $(this.$el).empty()

            $(this.$el).val(null)

            newVal.forEach((item) => {
              const option = new Option(
                item[this.textField],
                item[this.idField],
                true,
                true
              )
              $(this.$el).append(option)
            })

            $(this.$el).trigger('change', [true])

            $(this.$el).trigger({
              type: 'select2:select',
              params: {
                data: newVal
              }
            })
          }
        } else if (newVal !== undefined) {
          $(this.$el)
            .val(null)
            .trigger('change')
        }
      }
    },
    options(options) {
      $(this.$el)
        .empty()
        .select2({ data: this.mapOptions })
    },
    ajax() {
      $(this.$el)
        .empty()
        .select2('destroy')
      this.initControl()
    },
    destroyed() {
      $(this.$el)
        .off()
        .select2('destroy')
    },
    postData: {
      handler(newVal, oldVal) {
        if (Object.keys(oldVal).length > 0 && Object.keys(newVal).length > 0) {
          const [first] = Object.keys(oldVal)
          if (oldVal[first] != null && oldVal !== newVal) {
            $(this.$el)
              .empty()
              .select2('destroy')
            this.initControl()
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initControl()
  },
  methods: {
    initControl() {
      const vm = this

      const configs = {
        width: '100%',
        placeholder: this.initPlaceholder,
        multiple: this.multiple,
        allowClear: this.allowClear
      }

      if (this.$i18n.locale === 'vi') {
        configs.language = {
          errorLoading() {
            return 'Có lỗi khi tìm kiếm'
          },
          inputTooLong(args) {
            const overChars = args.input.length - args.maximum
            return 'Bạn đã nhập quá ' + overChars + ' ký tự.'
          },
          inputTooShort(args) {
            const remainingChars = args.minimum - args.input.length
            return 'Bạn cần nhập thêm ' + remainingChars + ' ký tự.'
          },
          loadingMore() {
            return 'Tải thêm dữ liệu...'
          },
          maximumSelected(args) {
            return 'Không thể chọn quá ' + args.maximum + ' lựa chọn'
          },
          noResults() {
            return 'Không tìm thấy kết quả.'
          },
          searching() {
            return 'Đang tìm kiếm...'
          }
        }
      }

      if (this.ajax !== '') {
        const $this = this
        configs.ajax = {
          url: $this.$axios.defaults.baseURL + this.ajax,
          headers: {
            Authorization: this.$auth.strategy.token.get()
          },
          type: 'POST',
          dataType: 'json',
          cache: true,
          data(params) {
            const query = {
              keyword: params.term,
              page: params.page || 0
            }
            Object.assign(query, $this.postData)
            return query
          },
          processResults: (data, params) => {
            params.page = params.page || 0

            const results = data.data.map((o) => {
              if (this.textFormat) {
                o.text = this.textFormat(o)
              } else {
                o.text = o[this.textField]
                o.id = o[this.idField]
              }
              return o
            })

            if (this.hasAllOption) {
              const all = { id: -1, text: this.$t('select.all') }
              all[this.textField] = this.$t('select.all')

              if (params.page === 0 && results.length > 0) {
                results.unshift(all)
              }
            }

            this.ajaxResult = unionBy(this.ajaxResult, results, this.idField)
            return {
              results,
              pagination: {
                more: (params.page + 1) * 10 < data.count
              }
            }
          }
        }

        if (this.value) {
          if (this.multiple) {
            configs.data = this.value.map((item) => ({
              id: item[this.idField],
              text: item[this.textField],
              selected: true
            }))
            this.ajaxResult = this.value.map((item) => ({
              _id: item[this.idField],
              id: item[this.idField],
              name: item[this.textField],
              text: item[this.textField]
            }))
          } else {
            configs.data = [
              {
                id: this.value[this.idField],
                text: this.value[this.textField],
                selected: true
              }
            ]
          }
        }

        $(this.$el)
          .select2(configs)
          .on('change', function(e, state) {
            if (typeof state !== 'undefined' && state) {
              return false
            }

            const data = $(vm.$el).select2('data')

            const selectedValue = vm.getOriginSelected(data)

            vm.$emit('input', selectedValue)
          })
      } else {
        configs.data = this.mapOptions
        configs.minimumResultsForSearch = this.searchable ? 0 : -1

        const selectedValue = this.getOriginSelectedValue(this.value)

        $(this.$el)
          .select2(configs)
          .val(selectedValue)
          .trigger('change')
          .on('change', function() {
            const data = $(vm.$el).select2('data')
            vm.$emit('input', vm.getOriginSelected(data))
          })
      }
    },
    getOriginSelected(currentItem) {
      let selected = null

      if (currentItem != null) {
        if (!this.multiple) {
          if (currentItem.length !== 0) {
            if (this.ajax !== '') {
              selected = this.ajaxResult.find(
                (item) =>
                  // eslint-disable-next-line eqeqeq
                  item[this.idField] ==
                  (Array.isArray(currentItem)
                    ? currentItem[0][this.idField]
                    : currentItem[this.idField])
              )
            } else {
              selected = this.options.find(
                (item) =>
                  // eslint-disable-next-line eqeqeq
                  item[this.idField] ==
                  (Array.isArray(currentItem)
                    ? currentItem[0][this.idField]
                    : currentItem[this.idField])
              )
            }
          }
        } else if (currentItem.length !== 0) {
          if (this.ajax !== '') {
            selected = this.ajaxResult.filter(
              (item) =>
                currentItem.findIndex(
                  // eslint-disable-next-line eqeqeq
                  (o) => o.id == item[this.idField]
                ) > -1
            )
          } else {
            selected = this.options.filter(
              (item) =>
                currentItem.findIndex(
                  // eslint-disable-next-line eqeqeq
                  (o) => o[this.idField] == item[this.idField]
                ) > -1
            )
          }
        }
      }

      return selected
    },
    getOriginSelectedValue(currentItem) {
      const selected = this.getOriginSelected(currentItem)

      if (!this.multiple) {
        return selected ? selected[this.idField] : null
      } else {
        return selected.map((item) => item[this.idField])
      }
    },
    checkHasOptionAll(newVal) {
      let hasOptionAll = false
      newVal.forEach((e) => {
        if (e.id === -1) {
          hasOptionAll = true
        }
      })
      return hasOptionAll
    },
    focus() {
      $(this.$el).select2('focus')
    }
  }
}
</script>
