<template>
  <fragment>
    <nuxt-link
      v-if="item.page"
      :key="$i18n.locale"
      :to="item.page"
      tag="li"
      class="kt-menu__item"
      exact-active-class="kt-menu__item--active kt-menu__item--here"
    >
      <a href="javascript:;" class="kt-menu__link kt-menu__toggle">
        <menu-item-text :item="item" :parent-item="parentItem" />
      </a>
    </nuxt-link>

    <li
      v-if="item.submenu"
      :class="[isActive ? 'kt-menu__item--open kt-menu__item--here' : null]"
      class="kt-menu__item kt-menu__item--submenu"
    >
      <a class="kt-menu__link kt-menu__toggle" href="javascript:;">
        <menu-item-text :item="item" :parent-item="parentItem" />
      </a>

      <div class="kt-menu__submenu">
        <span class="kt-menu__arrow" />
        <ul class="kt-menu__subnav">
          <fragment v-for="(child, index) in item.submenu" :key="index">
            <menu-section v-if="child.section" :item="child" />
            <menu-item-separator v-if="child.separator" />
            <menu-item v-if="child.title" :item="child" :parent-item="item" />
          </fragment>
        </ul>
      </div>
    </li>
  </fragment>
</template>

<script>
import MenuItemText from '~/components/partials/asideLeft/MenuItemText'
import MenuSection from '~/components/partials/asideLeft/MenuSection'
import MenuItemSeparator from '~/components/partials/asideLeft/MenuItemSeparator'
export default {
  name: 'MenuItem',
  components: { MenuItemSeparator, MenuSection, MenuItemText },
  props: {
    item: {
      type: Object,
      default: () => null
    },
    parentItem: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    isActive() {
      return this.isMenuItemActive(this.item)
    }
  },
  methods: {
    isMenuItemActive(item) {
      if (item.submenu) {
        return this.isMenuRootItemIsActive(item)
      }

      if (!item.page) {
        return false
      }

      return item.page === this.$nuxt.$route.path
    },
    isMenuRootItemIsActive(item) {
      let flag = false
      item.submenu.forEach((subItem) => {
        if (this.isMenuItemActive(subItem)) {
          flag = true
        }
      })
      return flag
    }
  }
}
</script>
