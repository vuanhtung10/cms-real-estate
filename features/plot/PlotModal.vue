<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('plot.edit') : $t('plot.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
    no-enforce-focus
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="$t('plot.name')"
        :placeholder="$t('plot.name')"
        :error="vForm.errors.get('name')"
        name="name"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('plot.description')"
        :placeholder="$t('plot.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        rows="5"
        name="description"
      />

      <select2-with-validation
        v-model="form.status"
        :error="vForm.errors.get('status')"
        :options="optionStatus"
        :searchable="false"
        placeholder="Chọn tình trạng"
        label="Tình trạng"
        data-vv-as="Tình trạng"
        id-field="key"
        text-field="text"
        name="Tình trạng"
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
import { listStatus } from '~/constants/data'
const defaultForm = {
  name: '',
  description: '',
  status: true
}

export default {
  name: 'PlotModal',
  components: {
    Select2WithValidation,
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
      selected: null,
      optionStatus: listStatus
    }
  },

  computed: {
    // function search permission
    filteredList() {
      return this.houseList.filter((item) => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },

  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.isEdit = true
        console.log(item)
        this.form = cloneDeep(item)
        if (item?.status) {
          const status = this.optionStatus.find(
            (element) => element.key === item.status
          )
          this.form.status = status
        }
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
        // this.vForm.user = this.vForm.user._id
        this.vForm.status = this.vForm.status.key
        await this.vForm.post(this.$axios.defaults.baseURL + '/plot')

        notifyAddSuccess(this.$t('plot.plot'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('plot.' + element.param)
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
        this.vForm.status = this.vForm.status.key
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/plot/' + this.form_id
        )
        notifyUpdateSuccess(this.$t('plot.plot'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('plot.' + element.param)
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
