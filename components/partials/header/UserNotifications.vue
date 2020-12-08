<template>
  <b-dropdown
    class="kt-header__topbar-item"
    no-caret
    right
    menu-class="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-lg"
  >
    <template v-slot:button-content>
      <div
        class="kt-header__topbar-wrapper"
        data-toggle="dropdown"
        data-offset="30px,0px"
        aria-expanded="true"
      >
        <span class="kt-header__topbar-icon kt-pulse kt-pulse--brand">
          <i class="flaticon-alert text-primary"></i>
          <span class="kt-pulse__ring"></span>
        </span>
      </div>
    </template>

    <template v-slot:default>
      <div
        :style="{ backgroundImage: `url(${backgroundUrl})` }"
        class="kt-head kt-head--skin-dark kt-head--fit-x"
      >
        <h3 class="kt-head__title">
          User Notifications &nbsp;
          <span class="btn btn-success btn-sm btn-bold btn-font-md"
            >23 new</span
          >
        </h3>
      </div>

      <client-only>
        <perfect-scrollbar
          :options="scrollOptions"
          class="kt-notification kt-margin-t-10 kt-margin-b-10 kt-scroll"
          style="max-height: 40vh; position: relative;"
        >
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-line-chart kt-font-success"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New order has been received
              </div>
              <div class="kt-notification__item-time">
                2 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-box-1 kt-font-brand"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New customer is registered
              </div>
              <div class="kt-notification__item-time">
                3 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-chart2 kt-font-danger"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                Application has been approved
              </div>
              <div class="kt-notification__item-time">
                3 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-image-file kt-font-warning"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New file has been uploaded
              </div>
              <div class="kt-notification__item-time">
                5 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-drop kt-font-info"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New user feedback received
              </div>
              <div class="kt-notification__item-time">
                8 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-pie-chart-2 kt-font-success"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                System reboot has been successfully completed
              </div>
              <div class="kt-notification__item-time">
                12 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-favourite kt-font-danger"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New order has been placed
              </div>
              <div class="kt-notification__item-time">
                15 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item kt-notification__item--read">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-safe kt-font-primary"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                Company meeting canceled
              </div>
              <div class="kt-notification__item-time">
                19 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-psd kt-font-success"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New report has been received
              </div>
              <div class="kt-notification__item-time">
                23 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon-download-1 kt-font-danger"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                Finance report has been generated
              </div>
              <div class="kt-notification__item-time">
                25 hrs ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon-security kt-font-warning"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New customer comment recieved
              </div>
              <div class="kt-notification__item-time">
                2 days ago
              </div>
            </div>
          </a>
          <a href="#" class="kt-notification__item">
            <div class="kt-notification__item-icon">
              <i class="flaticon2-pie-chart kt-font-success"></i>
            </div>
            <div class="kt-notification__item-details">
              <div class="kt-notification__item-title">
                New customer is registered
              </div>
              <div class="kt-notification__item-time">
                3 days ago
              </div>
            </div>
          </a>
        </perfect-scrollbar>
      </client-only>
    </template>
  </b-dropdown>
</template>

<script>
import backgroundUrl from '~/assets/media/misc/bg-1.jpg'

export default {
  name: 'UserNotifications',
  data() {
    return {
      backgroundUrl,
      scrollOptions: { wheelSpeed: 2, wheelPropagation: false }
    }
  }
}
</script>
