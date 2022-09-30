<template>
  <b-modal
    ref="modal"
    :cancel-title="$t('button.cancel')"
    :ok-title="isEdit ? $t('button.update') : $t('button.add')"
    :title="isEdit ? $t('user.edit') : $t('user.add')"
    :no-enforce-focus="true"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <b-text-input-with-validation
        v-model="form.fullname"
        :required="true"
        :label="$t('user.display_name')"
        :placeholder="$t('user.display_name')"
        :error="vForm.errors.get('user.display_name')"
        rules="required|max:255"
        name="fullname"
      />

      <b-text-input-with-validation
        v-model="form.email"
        :required="true"
        :label="$t('user.email')"
        :placeholder="$t('user.email')"
        :error="vForm.errors.get('email')"
        rules="required|max:255|email"
        name="email"
      />

      <b-text-input-with-validation
        v-show="!isEdit"
        v-model="form.password"
        :label="$t('user.password')"
        :placeholder="$t('user.password')"
        :data-vv-as="$t('user.password')"
        :error="vForm.errors.get('password')"
        :required="true"
        :rules="!isEdit ? 'required|max:128|isPassword' : ''"
        :vid="$t('user.password')"
        type="password"
        name="password"
      />

      <b-text-input-with-validation
        v-show="!isEdit"
        v-model="form.repassword"
        :label="$t('user.repassword')"
        :data-vv-as="$t('user.repassword')"
        :placeholder="$t('user.repassword')"
        :error="vForm.errors.get('repassword')"
        :required="true"
        :rules="
          !isEdit
            ? `required|max:128|confirmedTarget:${$t('user.password')}`
            : ''
        "
        type="password"
        name="repassword"
      />

      <role-chosen
        v-model="form.role"
        :error="vForm.errors.get('role')"
        rules="required"
        name="role"
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
import RoleChosen from '~/components/elements/role/RoleChosen'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  full_name: '',
  email: '',
  password: '',
  repassword: '',
  status: true
}

export default {
  name: 'UserModal',
  components: {
    ValidationObserver,
    RoleChosen,
    BTextInputWithValidation
  },
  props: {
    onActionSuccess: {
      type: Function,
      default: () => {}
    },
    isReviewer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: false,
      form: cloneDeep(defaultForm),
      vForm: new Form()
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
      this.vForm = new Form(this.form)
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
        const formData = cloneDeep(this.form)
        this.vForm = new Form(formData)
        // await this.vForm.post(this.$axios.defaults.baseURL + '/user/')
        let url = this.$axios.defaults.baseURL
        url += '/user/'
        await this.vForm.post(url)

        notifyAddSuccess(this.$t('user.user'))
        this.$refs.modal.hide()
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
        // const formData = cloneDeep(this.form)
        this.vForm = new Form(this.form)
        await this.vForm.put(
          this.$axios.defaults.baseURL + '/user/' + this.form_id
        )
        // this.vForm = new Form(formData)
        // let url = this.$axios.defaults.baseURL
        // url += '/user/`{}`'
        // console.log(url)
        // await this.vForm.put(url)

        notifyUpdateSuccess(this.$t('user.user'))
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
    }
  }
}
</script>
