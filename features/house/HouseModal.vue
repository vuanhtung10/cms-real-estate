<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('house.edit') : $t('house.add')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
    no-enforce-focus
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="$t('house.name')"
        :placeholder="$t('house.name')"
        :error="vForm.errors.get('name')"
        name="name"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('house.description')"
        :placeholder="$t('house.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        rows="5"
        name="description"
      />

      <b-text-input-with-validation
        v-model="form.area"
        :label="$t('house.area')"
        :placeholder="$t('house.area')"
        :error="vForm.errors.get('area')"
        rules="max:255"
        name="area"
      />

      <b-text-input-with-validation
        v-model="form.price"
        :label="$t('house.price')"
        :placeholder="$t('house.price')"
        :error="vForm.errors.get('price')"
        name="area"
      />

      <select2-with-validation
        v-model="form.direction"
        :error="vForm.errors.get('direction')"
        :options="optionDirections"
        :searchable="false"
        placeholder="Hướng nhà..."
        label="Hướng nhà"
        data-vv-as="Hướng nhà"
        id-field="key"
        text-field="text"
        name="Hướng nhà"
      />

      <select2-with-validation
        v-model="form.city"
        :error="vForm.errors.get('city')"
        :options="optionCities"
        :searchable="false"
        label="Thành phố"
        data-vv-as="Thành phố"
        id-field="key"
        text-field="text"
        name="Thành Phố"
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
        name="Hướng nhà "
      />
      <b-text-input-with-validation
        v-model="form.district"
        :label="$t('house.district')"
        :placeholder="$t('house.district')"
        :error="vForm.errors.get('district')"
        name="direction"
      />
      <b-text-input-with-validation
        v-model="form.ward"
        :label="$t('house.ward')"
        :placeholder="$t('house.ward')"
        :error="vForm.errors.get('ward')"
        name="direction"
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
import { directions, cities, listStatus } from '~/constants/data'
const defaultForm = {
  name: '',
  description: '',
  area: '',
  price: '',
  direction: '',
  city: '',
  district: '',
  ward: '',
  user: '',
  status: true,
  type: ''
  // plot: ''
}

export default {
  name: 'HouseModal',
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
      optionDirections: directions,
      optionCities: cities,
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
        if (item?.direction) {
          const direction = this.optionDirections.find(
            (element) => element.key === item.direction
          )
          console.log('direction', direction)
          this.form.direction = direction
        }
        if (item?.city) {
          const city = this.optionCities.find(
            (element) => element.key === item.city
          )
          this.form.city = city
        }
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
        this.vForm.direction = this.vForm.direction.key
        this.vForm.status = this.vForm.status.key
        this.vForm.city = this.vForm.city.key
        await this.vForm.post(this.$axios.defaults.baseURL + '/house')

        notifyAddSuccess(this.$t('house.house'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('house.' + element.param)
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
        this.vForm.direction = this.vForm.direction.key
        this.vForm.status = this.vForm.status.key
        this.vForm.city = this.vForm.city.key
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/house/' + this.form_id
        )
        notifyUpdateSuccess(this.$t('house.house'))
        this.$refs.modal.hide()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (e.response.status === 422) {
            e.response.data.errors.forEach((element) => {
              const err = this.$t('validate.' + element.msg, {
                field: this.$t('house.' + element.param)
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
