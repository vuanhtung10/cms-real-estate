/* eslint-disable vue/no-unused-components */
<template>
  <the-portlet :title="$t('house.list')">
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
      url="/house/list-for-datatable"
      order-type="desc"
    />

    <house-modal ref="modal" :on-action-success="updateItemSuccess" />
  </the-portlet>
</template>

<script>
import ThePortlet from '~/components/base/ThePortlet'
import DataTable from '~/components/base/DataTable'
import { generateTableAction, htmlEscapeEntities } from '~/utils/tableHelper'
import HouseModal from '~/features/house/HouseModal'
import { notifyDeleteSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import { HOUSE_VIEW } from '~/constants/permissions'
import { cities, directions, listStatus } from '~/constants/data'

export default {
  name: 'House',
  permission: HOUSE_VIEW,
  // eslint-disable-next-line vue/no-unused-components
  components: { HouseModal, DataTable, ThePortlet },
  head() {
    return {
      title: this.$t('menu.house_management')
    }
  },
  meta: {
    pageTitle: 'menu.house_management'
  },
  data() {
    return {
      columns: [
        {
          data: 'name',
          title: this.$t('house.name')
        },
        {
          data: 'description',
          title: this.$t('house.description')
        },
        {
          data: 'area',
          title: this.$t('house.area')
        },
        {
          data: 'price',
          title: this.$t('house.price')
        },
        {
          data: 'direction',
          title: this.$t('house.direction'),
          render(data) {
            if (data) {
              const direction = directions.find(
                (element) => element.key === data
              )
              if (direction) return direction.text
              return ''
            } else {
              return ''
            }
          }
        },
        {
          data: 'city',
          title: this.$t('house.city'),
          render(data) {
            if (data) {
              const city = cities.find((element) => element.key === data)
              if (city) return city.text
              return ''
            } else {
              return ''
            }
          }
        },
        {
          data: 'district',
          title: this.$t('house.district')
        },
        {
          data: 'ward',
          title: this.$t('house.ward')
        },
        {
          data: 'status',
          title: this.$t('house.status'),
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
          data: 'type',
          title: this.$t('house.type')
        },
        {
          data: 'user.fullname',
          title: this.$t('house.user')
        },
        {
          data: 'plot.name',
          title: this.$t('house.plot')
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
    quynh() {
      return this.tunggg
        .split('')
        .reverse()
        .join('')
    },

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
          this.$t('house.delete_confirm', [htmlEscapeEntities(rowData.name)]),
          {
            title: this.$t('alert.notice'),
            okVariant: 'danger',
            okTitle: this.$t('button.ok'),
            cancelTitle: this.$t('button.cancel')
          }
        )
        .then(async (value) => {
          if (value) {
            await this.$axios.delete('/house/' + rowData._id)
            notifyDeleteSuccess(this.$t('house.house'))
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
