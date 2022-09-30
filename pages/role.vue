<template>
  <the-portlet :title="$t('role.list')">
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
      url="/role/list-for-datatable"
      order-type="asc"
    />

    <role-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import RoleModal from '~/features/role/RoleModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
// import { ROLE_VIEW } from '~/constants/permissions'

export default {
  name: 'Role',
  // permission: ROLE_VIEW,
  components: { RoleModal, DataTable, ThePortlet },
  head() {
    return {
      title: this.$t('menu.role_management')
    }
  },
  meta: {
    // permission: `role.view`,
    pageTitle: 'menu.role_management'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: this.$t('role.name')
        },
        {
          data: 'display_name',
          title: this.$t('role.display_name')
        },
        {
          data: 'description',
          title: this.$t('role.description')
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
          this.$t('role.delete_confirm', [htmlEscapeEntities(rowData.name)]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/role/' + rowData._id)
            notifyDeleteSuccess(this.$t('role.role'))
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
