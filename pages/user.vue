<template>
  <the-portlet :title="$t('user.list')">
    <template v-slot:tool>
      <button @click="showModal" type="button" class="btn btn-primary">
        <i class="la la-plus"></i> {{ $t('button.add') }}
      </button>
    </template>

    <data-table
      ref="table"
      :columns="columns"
      :order-column-index="2"
      :server-side="true"
      :actions="actions"
      url="/user/list-for-datatable"
      order-type="desc"
    />

    <user-modal ref="modal" :on-action-success="updateItemSuccess" />
    <renew-password
      ref="renewPasswordModal"
      :on-action-success="updateItemSuccess"
    />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import UserModal from '~/features/user/UserModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import RenewPassword from '~/features/user/RenewPassword'

export default {
  name: 'User',
  components: { UserModal, DataTable, ThePortlet, RenewPassword },
  head() {
    return {
      title: this.$t('menu.user_management')
    }
  },
  meta: {
    pageTitle: 'menu.user_management'
  },
  data() {
    return {
      columns: [
        {
          data: 'fullname',
          title: this.$t('user.display_name')
        },
        {
          data: 'email',
          title: this.$t('user.email')
        },
        {
          data: 'role',
          title: this.$t('user.role'),
          render(data) {
            if (data) {
              return htmlEscapeEntities(data.display_name)
            } else {
              return ''
            }
          }
        },
        // {
        //   data: 'is_vip',
        //   title: 'Người dùng VIP',
        //   className: 'text-center',
        //   render(data) {
        //     if (data) {
        //       return '<span class="text-success"><i class="fa fa-check"></i></span>'
        //     }
        //     return '<span class="text-danger"><i class="fa fa-close"></i></span>'
        //   }
        // },
        // {
        //   data: 'status',
        //   title: 'Trạng thái',
        //   render(data) {
        //     if (data) {
        //       return '<span class="text-success">Đang hoạt động</span>'
        //     }
        //     return '<span class="text-danger">Đã khóa</span>'
        //   }
        // },
        {
          data: null,
          title: this.$t('datatable.action_col'),
          responsivePriority: 1,
          orderable: false,
          className: 'text-center tb-actions',
          render() {
            return (
              generateTableAction('edit', 'showDetail') +
              generateTableAction(
                'renewpassword',
                'showRenewPasswordModal',
                'primary',
                'la-lock',
                'Đổi mật khẩu'
              ) +
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
          name: 'showRenewPasswordModal',
          action: this.showRenewPasswordModal
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
    showRenewPasswordModal(table, rowData) {
      this.$refs.renewPasswordModal.show(rowData)
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
          this.$t('user.delete_confirm', [htmlEscapeEntities(rowData.name)]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/user/' + rowData._id)
            console.log(rowData._id)
            notifyDeleteSuccess(this.$t('user.user'))

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
