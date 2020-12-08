<template>
  <div class="kt-header__topbar">
    <user-notifications />
    <!--    <language-bar />-->
    <user-bar />
  </div>
</template>

<script>
import UserNotifications from '~/components/partials/header/UserNotifications'
// import LanguageBar from '~/components/partials/header/LanguageBar'
import UserBar from '~/components/partials/header/UserBar'
export default {
  name: 'TopBar',
  components: { UserBar, UserNotifications }
}
</script>
