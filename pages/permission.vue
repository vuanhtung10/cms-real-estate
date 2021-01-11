<template>
  <the-portlet :title="$t('permission.list')">
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
      url="/permission/list-for-datatable"
      order-type="desc"
    />

    <permission-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import PermissionModal from '~/features/permission/PermissionModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { PERMISSION_VIEW } from '~/constants/permissions'

export default {
  name: 'Permission',
  permission: PERMISSION_VIEW,
  components: { PermissionModal, DataTable, ThePortlet },
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
          title: this.$t('permission.name')
        },
        {
          data: 'display_name',
          title: this.$t('permission.display_name')
        },
        {
          data: 'description',
          title: this.$t('permission.description')
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
          this.$t('permission.delete_confirm', [
            htmlEscapeEntities(rowData.name)
          ]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.post('/permission/delete', {
              _id: rowData._id
            })
            notifyDeleteSuccess(this.$t('permission.permission'))
            this.$refs.table.reload()
          }
        })
        .catch(() => {
          notifyTryAgain()
        })
    }
  }
}
</script>
