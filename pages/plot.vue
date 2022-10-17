<template>
  <the-portlet :title="$t('plot.list')">
    <template v-slot:tool>
      <button @click="showModal" type="button" class="btn btn-primary">
        <i class="la la-plus"></i> {{ $t('button.add') }}
      </button>
    </template>

    <data-table
      ref="table"
      :columns="columns"
      :order-column-index="1"
      :server-side="true"
      :actions="actions"
      url="/plot/list-for-datatable"
      order-type="desc"
    />

    <plot-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import PlotModal from '~/features/plot/PlotModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { PLOT_VIEW } from '~/constants/permissions'
import { listStatus } from '~/constants/data'

export default {
  name: 'PLOT',
  permission: PLOT_VIEW,
  // eslint-disable-next-line vue/no-unused-components
  components: { PlotModal, DataTable, ThePortlet },
  head() {
    return {
      title: this.$t('menu.permission_management')
    }
  },
  meta: {
    pageTitle: 'menu.permission_management'
    // permission: PERMISSION_MANAGEMENT
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: this.$t('plot.name')
        },
        {
          data: 'description',
          title: this.$t('plot.description')
        },
        {
          data: 'status',
          title: this.$t('plot.status'),
          render(data) {
            const status = listStatus.find((element) => element.key === data)
            if (data) {
              switch (data) {
                case 'REJECT':
                  return `<p style = "background: red; color:white; padding:5px; border-radius: 5px; text-align: center;">${status.text}</p>`
                case 'PENDING':
                  return `<p style = "background: yellow; color:red; padding:5px; border-radius: 5px; text-align: center;">${status.text}</p>`
                case 'APPROVE':
                  return `<p style = "background: green; color:white; padding:5px; border-radius: 5px; text-align: center;">${status.text}</p>`
              }
            }
          }
        },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          className: 'text-center tb-actions',
          render() {
            return (
              generateTableAction('edit', 'showDetail') +
              generateTableAction('delete', 'deleteItem')
            )
          }
        }
      ]
    }
  },
  computed: {
    actions() {
      return [
        {
          type: 'click',
          name: 'showDetail',
          action: this.showDetail
        },
        {
          type: 'click',
          name: 'deleteItem',
          action: this.deleteItem
        }
      ]
    }
  },
  methods: {
    showDetail(table, rowData) {
      this.$refs.modal.show(rowData)
    },
    showModal() {
      this.$refs.modal.show()
    },
    updateItemSuccess() {
      this.$refs.table.reload()
    },
    deleteItem(table, rowData) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('plot.delete_confirm', [htmlEscapeEntities(rowData.name)]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          console.log(value)
          if (value) {
            await this.$axios.delete('/plot/' + rowData._id)
            notifyDeleteSuccess(this.$t('plot.plot'))
            this.$refs.table.reload()
            await this.$auth.fetchUser()
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    }
  }
}
</script>
