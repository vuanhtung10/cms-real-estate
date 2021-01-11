<template>
  <b-dropdown
    class="kt-header__topbar-item kt-header__topbar-item--user"
    no-caret
    right
    menu-class="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl"
  >
    <template v-slot:button-content>
      <div class="kt-header__topbar-user">
        <span class="kt-header__topbar-welcome kt-hidden-mobile">Hi,</span>
        <span class="kt-header__topbar-username kt-hidden-mobile">{{
          $auth.user ? $auth.user.email : ''
        }}</span>
        <img
          class="kt-hidden"
          alt="Pic"
          src="~/assets/media/users/300_25.jpg"
        />

        <!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
        <span
          class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold"
          >{{ $auth.user ? $auth.user.email[0] : '' }}</span
        >
      </div>
    </template>

    <template v-slot:default>
      <!--begin: Head -->
      <div
        :style="{ backgroundImage: `url(${backgroundUrl})` }"
        class="kt-user-card kt-user-card--skin-dark kt-notification-item-padding-x"
      >
        <div class="kt-user-card__avatar">
          <img
            class="kt-hidden"
            alt="Pic"
            src="~/assets/media/users/300_25.jpg"
          />

          <!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
          <span
            class="kt-badge kt-badge--lg kt-badge--rounded kt-badge--bold kt-font-success"
            >{{ $auth.user ? $auth.user.email[0] : '' }}</span
          >
        </div>
        <div class="kt-user-card__name">
          {{ $auth.user ? $auth.user.display_name : '' }}
        </div>
        <div class="kt-user-card__badge">
          <span class="btn btn-success btn-sm btn-bold btn-font-md"
            >23 messages</span
          >
        </div>
      </div>

      <!--end: Head -->

      <!--begin: Navigation -->
      <div class="kt-notification">
        <a href="#" class="kt-notification__item">
          <div class="kt-notification__item-icon">
            <i class="flaticon2-calendar-3 kt-font-success"></i>
          </div>
          <div class="kt-notification__item-details">
            <div class="kt-notification__item-title kt-font-bold">
              My Profile
            </div>
            <div class="kt-notification__item-time">
              Account settings and more
            </div>
          </div>
        </a>
        <div class="kt-notification__custom kt-space-between">
          <a
            @click="logout"
            href="javascript:;"
            class="btn btn-label btn-label-brand btn-sm btn-bold"
            >Đăng xuất</a
          >
        </div>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
import backgroundUrl from '~/assets/media/misc/bg-1.jpg'
export default {
  name: 'UserBar',
  data() {
    return {
      backgroundUrl
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      // this.$router.push('/auth/login')
    }
  }
}
</script>
