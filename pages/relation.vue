<template>
  <the-portlet :title="$t('relation.list')">
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
      url="/relation/list-for-datatable"
      order-type="desc"
    />

    <relation-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import RelationModal from '~/features/relation/RelationModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { RELATION_VIEW } from '~/constants/permissions'

export default {
  name: 'Relation',
  permission: RELATION_VIEW,
  components: { RelationModal, DataTable, ThePortlet },
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
          data: 'plot.name',
          title: this.$t('relation.plot')
        },
        {
          data: 'user.fullname',
          title: this.$t('relation.user')
        },
        {
          data: 'price',
          title: this.$t('relation.price')
        },
        {
          data: 'profit',
          title: this.$t('relation.profit')
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
          this.$t('relation.delete_confirm', [
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
          console.log(value)
          if (value) {
            await this.$axios.delete('/relation/' + rowData._id)
            notifyDeleteSuccess(this.$t('relation.relation'))
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
