<template>
  <div
    class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile"
  >
    <!--begin::Aside-->
    <div
      :style="
        `background-image:url(${require('~/assets/media/auth/bg-4.jpg')})`
      "
      class="kt-grid__item kt-grid__item--order-tablet-and-mobile-2 kt-grid kt-grid--hor kt-login__aside"
    >
      <div class="kt-grid__item">
        <a href="javascript:;" class="kt-login__logo">
          <img src="~assets/media/logos/logo-light.png" />
        </a>
      </div>
      <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver">
        <div class="kt-grid__item kt-grid__item--middle">
          <h3 class="kt-login__title">
            Chào mừng đến với hệ thống quản trị CMS
          </h3>
          <h4 class="kt-login__subtitle">
            Công cụ quản trị CMS
          </h4>
        </div>
      </div>
      <div class="kt-grid__item">
        <div class="kt-login__info">
          <div class="kt-login__copyright">
            © 2020 CMS
          </div>
        </div>
      </div>
    </div>

    <!--begin::Aside-->

    <!--begin::Content-->
    <div
      class="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper"
    >
      <!--begin::Body-->
      <div class="kt-login__body">
        <!--begin::Signin-->
        <div class="kt-login__form">
          <div class="kt-login__title">
            <h3>Đăng nhập</h3>
          </div>
          <validation-observer ref="form" v-slot="{ passes }">
            <!--begin::Form-->
            <form
              @submit.prevent="passes(validateBeforeSubmit)"
              class="kt-form"
              method="post"
            >
              <validation-provider
                v-slot="{ errors }"
                name="Tên đăng nhập"
                rules="required"
              >
                <div class="form-group">
                  <input
                    v-model="username"
                    class="form-control"
                    type="text"
                    placeholder="Tên đăng nhập"
                    autocomplete="off"
                  />
                  <div class="validated">
                    <p class="invalid-feedback">{{ errors[0] }}</p>
                  </div>
                </div>
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="Mật khẩu"
              >
                <div class="form-group">
                  <input
                    v-model="password"
                    class="form-control"
                    type="password"
                    placeholder="Mật khẩu"
                    name="Mậu khẩu"
                  />
                  <div class="validated">
                    <p class="invalid-feedback">{{ errors[0] }}</p>
                  </div>
                </div>
              </validation-provider>
              <div class="kt-login__actions">
                <a href="#" class="kt-link kt-login__link-forgot">
                  Quên mật khẩu ?
                </a>
                <button
                  id="kt_login_signin_submit"
                  class="btn btn-primary btn-elevate kt-login__btn-primary"
                >
                  Đăng nhập
                </button>
              </div>
              <div v-if="error" class="form-group validated">
                <p class="invalid-feedback">Thông tin đăng nhập không đúng!</p>
              </div>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: 'Login',
  components: { ValidationProvider, ValidationObserver },
  layout: 'auth',
  middleware: 'guest',
  head() {
    return {
      title: 'Đăng nhập'
    }
  },
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      error: null
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.login()
    },
    async login() {
      try {
        this.isLoading = true

        await this.$auth.login({
          data: {
            email: this.username,
            password: this.password
          }
        })

        this.isLoading = false

        this.$router.push('/')
      } catch (e) {
        this.error = e
        this.isLoading = false
      }
    }
  }
}
</script>
