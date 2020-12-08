<template>
  <div
    id="kt_aside_menu"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    class="kt-aside-menu"
    data-ktmenu-vertical="1"
    data-ktmenu-scroll="1"
    data-ktmenu-dropdown-timeout="100"
    style="maxHeight: 90vh; position: relative"
  >
    <menu-list v-if="$auth.loggedIn" />
  </div>
</template>

<script>
import objectPath from 'object-path'
import MenuList from '~/components/partials/asideLeft/MenuList'
import KTMenu from '~/utils/menu'
import KTUtil from '~/utils/util'
import { removeCSSClass } from '~/utils/utils'

export default {
  name: 'MainMenu',
  components: { MenuList },
  data() {
    return {
      insideTm: null,
      outsideTm: null
    }
  },
  mounted() {
    const options = this.setupMenuOptions()
    // eslint-disable-next-line no-unused-vars
    const ktMenu = new KTMenu(this.$el, options)
  },
  methods: {
    setupMenuOptions() {
      const menuOptions = {
        // vertical scroll
        scroll: null,
        // submenu setup
        submenu: {
          desktop: {
            // by default the menu mode set to accordion in desktop mode
            default: 'dropdown'
          },
          tablet: 'accordion', // menu set to accordion in tablet mode
          mobile: 'accordion' // menu set to accordion in mobile mode
        },
        // accordion setup
        accordion: {
          expandAll: false // allow having multiple expanded accordions in the menu
        }
      }

      // init aside menu
      const menuDesktopMode = 'accordion'

      if (typeof objectPath.get(menuOptions, 'submenu.desktop') === 'object') {
        menuOptions.submenu.desktop.default = menuDesktopMode
      }

      return menuOptions
    },
    mouseEnter(e) {
      // check if the left aside menu is fixed
      if (document.body.classList.contains('kt-aside--fixed')) {
        if (this.outsideTm) {
          clearTimeout(this.outsideTm)
          this.outsideTm = null
        }

        this.insideTm = setTimeout(() => {
          // if the left aside menu is minimized
          if (
            document.body.classList.contains('kt-aside--minimize') &&
            // eslint-disable-next-line no-undef
            KTUtil.isInResponsiveRange('desktop')
          ) {
            removeCSSClass(document.body, 'kt-aside--minimize')
            document.body.classList.add('kt-aside--minimize-hover')
          }
        }, 50)
      }
    },
    mouseLeave(e) {
      if (document.body.classList.contains('kt-aside--fixed')) {
        if (this.insideTm) {
          clearTimeout(this.insideTm)
          this.insideTm = null
        }

        this.outsideTm = setTimeout(() => {
          // if the left aside menu is expand
          /* eslint-disable-next-line  */
          const kUtilIsResponsiveRange = KTUtil.isInResponsiveRange('desktop')
          const hasMinimizeHover = document.body.classList.contains(
            'kt-aside--minimize-hover'
          )
          if (
            hasMinimizeHover &&
            // eslint-disable-next-line no-undef
            kUtilIsResponsiveRange
          ) {
            // hide back the left aside menu
            removeCSSClass(document.body, 'kt-aside--minimize-hover')
            document.body.classList.add('kt-aside--minimize')
          }
        }, 100)
      }
    }
  }
}
</script>
