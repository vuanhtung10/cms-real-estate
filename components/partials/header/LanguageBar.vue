<template>
  <b-dropdown
    ref="dropdown"
    class="kt-header__topbar-item kt-header__topbar-item--langs"
    no-caret
    right
    menu-class="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround"
  >
    <template v-slot:button-content>
      <div
        class="kt-header__topbar-wrapper"
        data-toggle="dropdown"
        data-offset="10px,0px"
      >
        <span class="kt-header__topbar-icon">
          <img :src="languageImg" class="" alt="" />
        </span>
      </div>
    </template>

    <template v-slot:default>
      <div class="kt-nav">
        <li
          :class="{ 'kt-nav__item--active': $i18n.locale === 'vi' }"
          class="kt-nav__item"
        >
          <nuxt-link
            :to="switchLocalePath('vi')"
            @click.native="$refs.dropdown.hide()"
            class="kt-nav__link"
          >
            <span class="kt-nav__link-icon"
              ><img src="~/assets/media/flags/vi.svg" alt=""
            /></span>
            <span class="kt-nav__link-text">Tiếng Việt</span>
          </nuxt-link>
        </li>
        <li
          :class="{ 'kt-nav__item--active': $i18n.locale === 'en' }"
          class="kt-nav__item"
        >
          <nuxt-link
            :to="switchLocalePath('en')"
            @click.native="$refs.dropdown.hide()"
            class="kt-nav__link"
          >
            <span class="kt-nav__link-icon"
              ><img src="~/assets/media/flags/en.svg" alt=""
            /></span>
            <span class="kt-nav__link-text">English</span>
          </nuxt-link>
        </li>
      </div>
    </template>
  </b-dropdown>
</template>

<script>
const viFlag = require('~/assets/media/flags/vi.svg')
const enFlag = require('~/assets/media/flags/en.svg')
export default {
  name: 'LanguageBar',
  data() {
    return {
      scrollOptions: { wheelSpeed: 2, wheelPropagation: false },
      viFlag,
      enFlag
    }
  },
  computed: {
    languageImg() {
      if (this.$i18n.locale === 'vi') {
        return viFlag
      }

      return enFlag
    }
  }
}
</script>
