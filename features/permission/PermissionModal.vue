<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('permission.edit') : $t('permission.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
    no-enforce-focus
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="$t('permission.name')"
        :placeholder="$t('permission.name')"
        :error="vForm.errors.get('name')"
        rules="required|max:100|isPermissionName"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.display_name"
        :required="true"
        :label="$t('permission.display_name')"
        :placeholder="$t('permission.display_name')"
        :error="vForm.errors.get('display_name')"
        rules="required|max:255"
        name="display_name"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('permission.description')"
        :placeholder="$t('permission.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        rows="5"
        name="description"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import {
  notifyAddSuccess,
  notifyTryAgain,
  notifyUpdateSuccess
} from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  name: '',
  display_name: '',
  description: ''
}

export default {
  name: 'PermissionModal',
  components: {
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
  mounted() {},
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/permission/add')

        notifyAddSuccess(this.$t('permission.permission'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('permission.' + element.param)
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/permission/edit')

        notifyUpdateSuccess(this.$t('permission.permission'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('permission.' + element.param)
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
