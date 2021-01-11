<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('role.edit') : $t('role.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @show="onShow"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.name"
        :required="true"
        :label="$t('role.name')"
        :placeholder="$t('role.name')"
        :error="vForm.errors.get('name')"
        rules="required|max:100"
        name="name"
      />

      <b-text-input-with-validation
        v-model="form.display_name"
        :required="true"
        :label="$t('role.display_name')"
        :placeholder="$t('role.display_name')"
        :error="vForm.errors.get('display_name')"
        rules="required|max:255"
        name="display_name"
      />

      <b-text-area-with-validation
        v-model="form.description"
        :label="$t('role.description')"
        :placeholder="$t('role.description')"
        :error="vForm.errors.get('description')"
        rules="max:255"
        name="description"
      />
    </validation-observer>

    <div class="form-group m-form__group">
      <div class="row">
        <div class="col-md-12">
          <label>Danh sách quyền người dùng</label>
          <div class="input-group">
            <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm quyền người dùng"
            />
            <div class="input-group-append">
              <span class="input-group-text"><i class="la la-search"></i></span>
            </div>
          </div>
        </div>
      </div>

      <perfect-scrollbar class="inputSearchPermission">
        <div class="container-fluid row">
          <div
            v-for="(item, i) in filteredList"
            :key="i"
            class="col-md-6"
            data-height="150"
          >
            <div class="kt-checkbox kt-checkbox--primary">
              <label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand">
                <input
                  :value="item._id"
                  v-model="form.permissionIdList"
                  type="checkbox"
                  class="form-check-input"
                />
                {{ item.display_name }}
                <span></span>
              </label>
            </div>
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </b-modal>
</template>

<style>
.inputSearchPermission {
  height: 200px;
  margin-top: 20px;
}
</style>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import $ from 'jquery'
import { ValidationObserver } from 'vee-validate'
import { notifyAddSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'
import BTextAreaWithValidation from '~/components/base/input/BTextAreaWithValidation'

const defaultForm = {
  name: '',
  display_name: '',
  description: '',
  permissionIdList: []
}

export default {
  name: 'RoleModal',
  components: {
    ValidationObserver,
    BTextInputWithValidation,
    BTextAreaWithValidation
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
      permissionList: [],
      search: ''
    }
  },
  computed: {
    // function search permission
    filteredList() {
      return this.permissionList.filter((item) => {
        return item.display_name
          .toLowerCase()
          .includes(this.search.toLowerCase())
      })
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const res = await this.$axios.post('permission/select-list')
        const { data } = res
        this.permissionList = data.data
      } catch (e) {}
    },
    show(item = null) {
      if (item) {
        this.isEdit = true
        this.form = cloneDeep(item)
        // cập nhật những permission có sẵn
        this.form.permissionIdList = this.form.permissions.map(function(e) {
          return e
        })
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
        await this.vForm.post(this.$axios.defaults.baseURL + '/role/add')

        notifyAddSuccess('Part activity')
        this.$refs.modal.hide()
        await this.$auth.fetchUser()
        this.onActionSuccess()
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    async updateItem() {
      try {
        this.vForm = new Form(this.form)
        await this.vForm.post(this.$axios.defaults.baseURL + '/role/edit')

        notifyAddSuccess('Part activity')
        this.$refs.modal.hide()
        this.onActionSuccess()
        await this.$auth.fetchUser()
      } catch (e) {
        if (e.response) {
          if (status !== 422) {
            notifyTryAgain()
          }
        } else {
          notifyTryAgain()
        }
      }
    },
    onShow() {
      $('.inputSearchPermission').animate({ scrollTop: 0 }, 'slow')
    }
  }
}
</script>
