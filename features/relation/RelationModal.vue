<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('relation.edit') : $t('relation.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <select2-with-validation
        v-model="form.plot"
        :error="vForm.errors.get('plot')"
        placeholder="Chọn Lô Đất..."
        label="Lô đất"
        data-vv-as="Lô đất"
        id-field="_id"
        text-field="name"
        ajax="/plot/suggest"
        name="Lô đất"
        rules="required"
      />
      <select2-with-validation
        v-model="form.user"
        :error="vForm.errors.get('user')"
        placeholder="Chọn chủ sở hữu..."
        label="Chủ sở hữu"
        data-vv-as="Chủ sở hữu"
        id-field="_id"
        text-field="fullname"
        ajax="/user/suggest"
        name="chủ sở hữu"
        rules="required"
      />
      <b-text-input-with-validation
        v-model="form.price"
        :label="$t('relation.price')"
        :placeholder="$t('house.price')"
        :error="vForm.errors.get('price')"
        name="price"
      />
      <b-text-input-with-validation
        v-model="form.profit"
        :label="$t('relation.profit')"
        :placeholder="$t('relation.profit')"
        :error="vForm.errors.get('profit')"
        name="profit"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import Select2WithValidation from '~/components/base/input/Select2WithValidation'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  plot: '',
  user: '',
  price: '',
  profit: ''
}

export default {
  name: 'RelationModal',
  components: {
    Select2WithValidation,
    // eslint-disable-next-line vue/no-unused-components
    BTextAreaWithValidation,
    BTextInputWithValidation,
    ValidationObserver
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form(),
      selected: null
    }
  },

  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
      }

      this.$nextTick(() => {
        this.$refs.modal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
      this.isEdit = false
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        if (this.isEdit) {
          await this.updateItem()
        } else {
          await this.addItem()
        }
      }
    },
    async addItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/relation')

        notifyAddSuccess(this.$t('relation.relation'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('relation.' + element.param)
              })
              this.vForm.errors.set(element.param, err)
            })
          } else {
            notifyTryAgain()
          }
        }
      }
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/relation/' + this.form_id
        )
        notifyUpdateSuccess(this.$t('relation.relation'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('relation.' + element.param)
              })
              this.vForm.errors.set(element.param, err)
            })
          } else {
            notifyTryAgain()
          }
        }
      }
    }
  }
}
</script>
