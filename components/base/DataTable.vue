<template>
  <table
    class="table table-bordered table-hover table-striped display responsive nowrap"
  ></table>
</template>

<style>
/*table {*/
/*  tr,*/
/*  th,*/
/*  td {*/
/*    &:focus,*/
/*    &:active {*/
/*      outline: none !important;*/
/*    }*/
/*  }*/
/*}*/

@import '../../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css';
@import '../../node_modules/datatables.net-fixedcolumns-bs4/css/fixedColumns.bootstrap4.min.css';

div.dataTables_wrapper div.dataTables_processing {
  z-index: 1000;
}

table.dataTable tbody th,
table.dataTable tbody td {
  white-space: nowrap;
}

.DTFC_ScrollWrapper {
  height: auto !important;
}

div.dataTables_wrapper div.dataTables_filter input {
  width: 300px;
}

.dataTables_scrollHead {
}

.DTFC_LeftBodyLiner {
  top: -13px !important;
  width: unset;
  overflow-y: unset !important;
}

.DTFC_RightBodyLiner {
  top: -13px !important;
  width: unset;
  overflow-y: unset !important;
}

.DTFC_LeftWrapper {
  top: -13px !important;
}

.DTFC_RightWrapper {
  top: -13px !important;
}

.DTFC_RightHeadWrapper {
  /*top: -14px;*/
}

.DTFC_LeftBodyWrapper {
  top: -13px !important;
  border-right: 1px solid #e7ecf1;
}

.DTFC_RightBodyWrapper {
  top: -13px !important;
  /*border-left: 1px solid #e7ecf1;*/
}

div.dataTables_wrapper div.dataTables_processing {
  width: 300px;
  height: 50px;
  z-index: 1000;
}
</style>

<script>
import $ from 'jquery'

if (process.client) {
  require('datatables.net-bs4')
  require('datatables.net-fixedcolumns-bs4')
}

export default {
  name: 'DataTable',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: null
    },
    actions: {
      type: Array,
      default: () => []
    },
    serverSide: {
      type: Boolean,
      default: true
    },
    processing: {
      type: Boolean,
      default: true
    },
    searching: {
      type: Boolean,
      default: true
    },
    lengthChange: {
      type: Boolean,
      default: true
    },
    ordering: {
      type: Boolean,
      default: true
    },
    orderColumnIndex: {
      type: Number,
      default: 1
    },
    orderType: {
      type: String,
      default: 'asc'
    },
    refresh: {
      type: Boolean,
      default: false
    },
    postData: {
      type: Object,
      default: null
    },
    dom: {
      type: String,
      default:
        "<'row'<'col-md-3 col-sm-12'l><'col-md-3 col-sm-12 selected-count'><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>"
    },
    searchPlaceholder: {
      type: String,
      default: 'Nhập từ khóa tìm kiếm...'
    },
    fixedColumnsLeft: {
      type: Number,
      default: 1
    },
    fixedColumnsRight: {
      type: Number,
      default: 1
    },
    responsive: {
      type: Boolean,
      default: true
    },
    pageLength: {
      type: Number,
      default: 10
    },
    hasIndex: {
      type: Boolean,
      default: true
    },
    selectable: {
      type: Boolean,
      default: false
    },
    rowsSelectedDataProp: {
      type: Array,
      default: () => []
    },
    rowsSelectedProp: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      table: null,
      firstRow: null,
      api: null,
      rowsSelected: [],
      rowsSelectedData: []
    }
  },
  computed: {
    // rowsSelectedData() {
    //   return this.rowsSelectedDataProp
    // },
    tableColumns() {
      const columns = [...this.columns]
      if (this.hasIndex) {
        columns.unshift({
          data: null,
          title: '#',
          orderable: false,
          responsivePriority: 1,
          className: 'tb-number'
        })
      }
      if (this.selectable) {
        columns.unshift({
          orderable: false,
          render(data, type, row) {
            return (
              '<label class="kt-checkbox kt-checkbox--bold kt-checkbox--success">\n' +
              '<input type="checkbox" class="dt-checkboxes">' +
              '<span></span>\n' +
              '</label>'
            )
          },
          className: 'dt-body-center'
        })
      }

      columns.forEach((column) => {
        if (column.render === undefined) {
          column.render = $.fn.dataTable.render.text()
        }
      })

      return columns
    }
  },
  watch: {
    rowsSelected(value) {
      if (this.selectable) {
        const table = this.table.table().container()
        $(table)
          .find('div.selected-count')
          .html(`Đã chọn ${value.length} bản ghi`)
      }
    },
    columns: {
      handler() {
        this.reinit()
      },
      deep: true
    },
    rowsSelectedProp(value) {
      this.rowsSelected = value
      // this.reinit()
    },
    rowsSelectedDataProp(value) {
      this.rowsSelectedData = value
      this.initTable()
    }
  },
  created() {
    // Mutating the prop
    if (this.rowsSelectedProp) {
      this.rowsSelected = [...this.rowsSelectedProp]
    }
    if (this.rowsSelectedDataProp) {
      this.rowsSelectedData = this.rowsSelectedDataProp
    }
  },
  mounted() {
    this.initTable()
  },
  destroyed() {
    $(this.$el)
      .DataTable()
      .destroy()
    $(this.$el).empty()
  },
  methods: {
    initTable(reInit = false) {
      this.firstRow = null
      const $this = this
      $.fn.dataTable.ext.errMode = 'none'
      $.extend($.fn.dataTableExt.oStdClasses, {
        sWrapper: 'dataTables_wrapper',
        sFilterInput: 'form-control',
        sLengthSelect: 'custom-select form-control'
      })

      const defaultConfigs = {
        dom: this.dom,
        processing: this.processing,
        ordering: this.ordering,
        searching: this.searching,
        autoFill: false,
        initComplete() {
          $(
            this.api()
              .table()
              .container()
          )
            .find('input')
            .parent()
            .wrap('<form>')
            .parent()
            .attr('autocomplete', 'off')
        },
        select: true,
        lengthChange: this.lengthChange,
        serverSide: this.serverSide,
        responsive: this.responsive,
        scrollX: true,
        scrollCollapse: true,
        scroller: true,
        pageLength: this.pageLength,
        lengthMenu: [5, 10, 25, 50, 75, 100],
        fixedColumns: {
          leftColumns: this.fixedColumnsLeft,
          rightColumns: this.fixedColumnsRight
        },

        language: {
          aria: {
            sortAscending: 'Sắp xếp tăng dần',
            sortDescending: 'Sắp xếp giảm dần'
          },
          processing:
            '<div><span role="status" class="spinner-border text-primary mb-2"><span class="sr-only">Spinning</span></span></div><span>&nbsp;&nbsp;&nbsp; ' +
            'Đang tải' +
            '...</span></div>',
          emptyTable: 'Không có bản ghi',
          info: '_START_ - _END_ của _TOTAL_ bản ghi',
          infoEmpty: '',
          infoFiltered: '',
          lengthMenu: '_MENU_ bản ghi',
          search: '',
          zeroRecords: 'Không có bản ghi',
          paginate: {
            previous: '<i class="la la-angle-left" aria-hidden="true"></i>',
            next: '<i class="la la-angle-right" aria-hidden="true"></i>',
            last: 'Cuối',
            first: 'Đầu'
          },
          searchPlaceholder: this.searchPlaceholder,
          select: {
            rows: {
              _: '  %d rows selected',
              '0': '',
              '1': '  %d row selected'
            }
          }
        },
        columns: this.tableColumns,
        order: [this.orderColumnIndex, this.orderType],
        drawCallback(settings) {
          const pagination = $(this)
            .closest('.dataTables_wrapper')
            .find('.dataTables_paginate')
          pagination.toggle(this.api().page.info().pages > 0)

          setTimeout(() => {
            $this.relayout()
            $this.updateDataTableSelectAllCtrl()
          }, 200)
        }
      }

      if (this.serverSide) {
        $.extend(defaultConfigs, {
          ajax: {
            url: $this.$axios.defaults.baseURL + this.url,
            headers: {
              Authorization: `${this.$auth.strategy.token.get()}`
            },
            type: 'post',
            dataType: 'json',
            data: function(d) {
              return $.extend({}, d, this.postData)
            }.bind(this)
          }
        })
      }

      if (this.selectable) {
        const $this = this
        $.extend(defaultConfigs, {
          rowCallback(row, data, dataIndex) {
            // Get row ID
            const rowId = data._id
            // If row ID is in the list of selected row IDs
            const index = $.inArray(rowId, $this.rowsSelected)
            if (index !== -1) {
              $(row)
                .find('input[type="checkbox"]')
                .prop('checked', true)
              $(row).addClass('selected')
            }
          }
        })
      } else {
        $.extend(defaultConfigs, {
          select: false
        })
      }

      this.table = $(this.$el).DataTable(defaultConfigs)
      this.api = $(this.$el)
        .dataTable()
        .api()
      this.initIndexColumn()

      // if (!reInit) {
      this.registerActions()
      // }

      this.table.on('draw.dt', () => {
        this.$emit('initial', this.table)
        // $(this.$el).tooltip({ selector: '.table-action' })
      })

      if (this.selectable) {
        this.createCheckboxHeader()
        this.handleClick()
      }
    },
    initIndexColumn() {
      if (this.hasIndex) {
        let iColumn = 0
        if (this.selectable) iColumn = 1
        if (this.serverSide) {
          this.table.on(
            'order.dt search.dt draw.dt',
            function() {
              const info = this.table.page.info()
              const start = info.start

              this.table
                .column(iColumn, {
                  search: 'applied',
                  order: 'applied'
                })
                .nodes()
                .each(function(cell, i) {
                  cell.innerHTML = i + 1 + start
                })
            }.bind(this)
          )
        } else {
          this.table.on(
            'order.dt search.dt draw.dt',
            function() {
              this.table
                .column(iColumn, {
                  search: 'applied',
                  order: 'applied'
                })
                .nodes()
                .each(function(cell, i) {
                  cell.innerHTML = i + 1
                })
            }.bind(this)
          )

          this.table.draw()
        }
      }
    },
    registerActions() {
      const vm = this

      if (this.actions.length > 0) {
        this.actions.forEach((action) => {
          $(this.$el).on(
            action.type,
            '[data-action="' + action.name + '"]',
            function() {
              // $('.table-action').tooltip('hide')
              const td = $(this).closest('td')
              const tr = $(this).closest('tr')
              const row = $(vm.$el)
                .DataTable()
                .row(tr)

              const data = $(vm.$el)
                .DataTable()
                .row(tr)
                .data()
              const cell = $(vm.$el)
                .DataTable()
                .cell(td)

              action.action(vm.table, data, row, td, cell)
            }
          )
        })
      }
    },

    async reinit() {
      $(this.$el)
        .DataTable()
        .destroy()

      $(this.$el).empty()
      await this.$nextTick()
      this.initTable(true)
    },
    reload(keepCurrentPage = true) {
      if (this.table != null) {
        if (this.getAllData().length === 1) {
          this.nextPrePage()
        } else {
          this.table.ajax.reload(null, false)
          this.rowsSelected = []
          this.rowsSelectedData = []
        }
      }
    },
    nextRow(rowIndex) {
      if (this.table != null) {
        if (this.table.row(rowIndex + 1).data()) {
          return this.table.row(rowIndex + 1)
        } else {
          const info = this.table.page.info()
          const currentPage = info.page
          if (currentPage === info.pages - 1) {
            return this.table.row(rowIndex)
          }
          this.table.page('next').draw('page')

          const interval = setInterval(() => {
            const page = this.table.page.info().page
            if (page !== currentPage) {
              clearInterval(interval)
              this.$emit('firstRow', this.table.row(0))
            }
          }, 1000)
        }
      }
    },
    prevRow(rowIndex) {
      if (this.table != null) {
        if (this.table.row(rowIndex - 1).data()) {
          return this.table.row(rowIndex - 1)
        } else {
          const info = this.table.page.info()
          const end = info.length - 1
          const currentPage = info.page
          if (currentPage === 0) {
            return this.table.row(0)
          }
          this.table.page('previous').draw('page')

          const interval = setInterval(() => {
            const page = this.table.page.info().page

            if (page !== currentPage) {
              clearInterval(interval)
              this.$emit('lastRow', this.table.row(end))
            }
          }, 1000)
        }
      }
    },
    getSelectedRows() {
      return this.rowsSelectedData
    },
    getSelectedRowsIds() {
      return this.rowsSelected
    },
    setPage(index) {
      return this.table.page(index)
    },
    getAllData() {
      return this.table.rows().data()
    },
    nextPrePage() {
      this.table.page('previous').draw('page')
    },
    relayout() {
      this.table.columns.adjust()
      /* this.table.columns
        .adjust()
        .fixedColumns()
        .relayout() */
      setTimeout(() => {
        this.handleSelectAllClick()
      }, 10)
    },
    createCheckboxHeader() {
      if (this.selectable) {
        const $colHeader = $(this.api.column(0).header())
        $colHeader.html(
          '<label class="kt-checkbox kt-checkbox--bold kt-checkbox--success">\n' +
            '<input type="checkbox" name="select_all" class="dt-checkboxes-select-all" data-col="0">' +
            '<span></span>\n' +
            '</label>'
        )
      }
    },
    handleClick() {
      if (this.selectable) {
        const $this = this
        const table = this.table.table().container()
        $(table)
          .unbind('click')
          .on('click', 'td:not(.tb-actions)', function(e) {
            e.preventDefault()
            if ($this.fixedColumnsLeft === 0) {
              const $row = $(this).closest('tr')
              const $checkbox = $row.find('input[type="checkbox"]')
              // Get row data
              const data = $this.table.row($row).data()
              // Get row ID
              const rowId = data._id
              // Determine whether row ID is in the list of selected row IDs
              const index = $.inArray(rowId, $this.rowsSelected)
              const rowIndex = $this.table.row($row).index()

              const $fixedRow = $(table)
                .find('.DTFC_LeftBodyLiner, .DTFC_RightBodyLiner')
                .find(`tr[data-dt-row=${rowIndex}]`)
              // If checkbox is checked and row ID is not in list of selected row IDs
              if (index === -1) {
                $this.rowsSelected.push(rowId)
                $this.rowsSelectedData.push(data)
                $row.addClass('selected')
                $fixedRow.addClass('selected')
                $checkbox.prop('checked', true)
                // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
              } else {
                $this.rowsSelected.splice(index, 1)
                $this.rowsSelectedData.splice(index, 1)
                $row.removeClass('selected')
                $fixedRow.removeClass('selected')
                $checkbox.prop('checked', false)
              }

              // Update state of "Select all" control
            } else {
              const $row = $(this).closest('tr')
              // Get row data
              const data = $this.table.row($row).data()

              const rowIndex = $this.table.row($row).index()

              const $fixedRow = $(
                '.DTFC_LeftBodyLiner, .DTFC_RightBodyLiner'
              ).find(`tr[data-dt-row=${rowIndex}]`)
              const $checkbox = $fixedRow.find('input[type="checkbox"]')
              // Get row ID
              const rowId = data._id
              // Determine whether row ID is in the list of selected row IDs
              const index = $.inArray(rowId, $this.rowsSelected)
              // If checkbox is checked and row ID is not in list of selected row IDs
              if (index === -1) {
                $this.rowsSelected.push(rowId)
                $this.rowsSelectedData.push(data)
                $fixedRow.addClass('selected')
                $($this.table.row($row).node()).addClass('selected')
                $checkbox.prop('checked', true)
                // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
              } else {
                $this.rowsSelected.splice(index, 1)
                $this.rowsSelectedData.splice(index, 1)
                $fixedRow.removeClass('selected')
                $($this.table.row($row).node()).removeClass('selected')
                $checkbox.prop('checked', false)
              }

              // Update state of "Select all" control
            }
            $this.updateDataTableSelectAllCtrl()
            // Prevent click event from propagating to parent
            e.stopPropagation()
          })
      }
    },
    handleSelectAllClick() {
      if (this.selectable) {
        const table = this.table.table().container()
        if (this.fixedColumnsLeft === 0) {
          $(table)
            .find('thead input[name="select_all"]')
            .unbind('click')
            .on('click', function(e) {
              if (this.checked) {
                $(table)
                  .find('tbody input[type="checkbox"]:not(:checked)')
                  .trigger('click')
              } else {
                $(table)
                  .find('tbody input[type="checkbox"]:checked')
                  .trigger('click')
              }

              // Prevent click event from propagating to parent
              e.stopPropagation()
            })
        } else {
          $(table)
            .find('.DTFC_LeftHeadWrapper .dt-checkboxes-select-all')
            .unbind('click')
            .on('click', function(e) {
              if (this.checked) {
                $(table)
                  .find('.DTFC_LeftBodyWrapper')
                  .find('tbody input[type="checkbox"]:not(:checked)')
                  .trigger('click')
              } else {
                $(table)
                  .find('.DTFC_LeftBodyWrapper')
                  .find('tbody input[type="checkbox"]:checked')
                  .trigger('click')
              }

              // Prevent click event from propagating to parent
              e.stopPropagation()
            })
        }
      }
    },
    updateDataTableSelectAllCtrl() {
      if (this.selectable) {
        let table
        let $chkboxAll
        let $chkboxChecked
        let chkboxSelectAll
        if (this.fixedColumnsLeft === 0) {
          table = this.table.table().node()
          $chkboxAll = $('tbody input[type="checkbox"]', table)
          $chkboxChecked = $('tbody input[type="checkbox"]:checked', table)
          chkboxSelectAll = $(
            'thead input[name="select_all"]',
            $('.dataTables_scrollHeadInner')
          ).get(0)
        } else {
          table = this.table.table().container()
          $chkboxAll = $(table)
            .find('.DTFC_LeftBodyWrapper')
            .find('tbody input[type="checkbox"]')
          $chkboxChecked = $(table)
            .find('.DTFC_LeftBodyWrapper')
            .find('tbody input[type="checkbox"]:checked')
          chkboxSelectAll = $(table)
            .find('.DTFC_LeftHeadWrapper .dt-checkboxes-select-all')
            .get(0)
        }
        if (chkboxSelectAll) {
          // If none of the checkboxes are checked
          if ($chkboxChecked.length === 0) {
            chkboxSelectAll.checked = false
            if ('indeterminate' in chkboxSelectAll) {
              chkboxSelectAll.indeterminate = false
            }

            // If all of the checkboxes are checked
          } else if ($chkboxChecked.length === $chkboxAll.length) {
            chkboxSelectAll.checked = true
            if ('indeterminate' in chkboxSelectAll) {
              chkboxSelectAll.indeterminate = false
            }

            // If some of the checkboxes are checked
          } else {
            chkboxSelectAll.checked = true
            if ('indeterminate' in chkboxSelectAll) {
              chkboxSelectAll.indeterminate = true
            }
          }
        }
      }
    }
  }
}
</script>
