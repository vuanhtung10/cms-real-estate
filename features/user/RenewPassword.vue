<template>
  <b-modal
    ref="renewPasswordModal"
    :cancel-title="$t('button.cancel')"
    :ok-title="$t('button.update')"
    :title="$t('user.renew_password')"
    @ok="handleModalOk"
    @hidden="handleModalHide"
    size="lg"
  >
    <validation-observer ref="observer" class="kt-form">
      <form-control
        v-model="form.full_name"
        :label="$t('user.display_name')"
        :data-vv-as="$t('user.display_name')"
        :required="true"
        :error="vForm.errors.get('display_name')"
        :is-disabled="true"
        rules="required|max:255"
        name="display_name"
      />

      <b-text-input-with-validation
        v-model="form.password"
        :label="$t('user.password')"
        :error="vForm.errors.get('password')"
        :required="true"
        :vid="$t('user.password')"
        :rules="'required|max:128|isPassword'"
        :placeholder="$t('user.password')"
        type="password"
        name="password"
      />

      <b-text-input-with-validation
        :placeholder="$t('user.repassword')"
        v-model="form.repassword"
        :label="$t('user.repassword')"
        :data-vv-as="$t('user.repassword')"
        :error="vForm.errors.get('repassword')"
        :required="true"
        :rules="`required|max:128|confirmedTarget:${$t('user.password')}`"
        type="password"
        name="email"
      />
    </validation-observer>
  </b-modal>
</template>

<script>
import Form from 'vform'
import cloneDeep from 'lodash/cloneDeep'
import { ValidationObserver } from 'vee-validate'
import FormControl from '~/components/base/FormControl'
import { notifyTryAgain, notifyUpdateSuccess } from '~/utils/bootstrap-notify'
import BTextInputWithValidation from '~/components/base/input/BTextInputWithValidation'

const defaultForm = {
  full_name: '',
  password: '',
  repassword: ''
}

export default {
  name: 'RenewPasswordModal',
  components: { FormControl, ValidationObserver, BTextInputWithValidation },
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
  mounted() {},
  methods: {
    show(item = null) {
      if (item) {
        this.form = cloneDeep(item)
      }
      this.form.password = null
      this.form.repassword = null

      this.$nextTick(() => {
        this.$refs.renewPasswordModal.show()
      })
    },
    async handleModalOk(bvModalEvt) {
      bvModalEvt.preventDefault()

      await this.validateForm()
    },
    handleModalHide(bvModalEvt) {
      this.form = cloneDeep(defaultForm)
    },
    async validateForm() {
      const isValid = await this.$refs.observer.validate()
      if (isValid) {
        await this.savePassword()
      }
    },
    async savePassword() {
      try {
        this.vForm = new Form(this.form)
        let url = this.$axios.defaults.baseURL
        if (this.isReviewer) {
          url += '/reviewer/update-password'
        } else {
          url += '/user/update-password'
        }
        await this.vForm.post(url)

        notifyUpdateSuccess(this.$t('user.update_password'))
        this.$refs.renewPasswordModal.hide()
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
    }
  }
}
</script>
