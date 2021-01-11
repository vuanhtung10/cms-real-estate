export default ({ route, app, error, $auth }) => {
  if (!$auth.loggedIn) {
    return
  }
  let hasPermission = true
  if (route.matched && route.matched.length > 0) {
    hasPermission = route.matched.some((routeRecord) => {
      const options = routeRecord.components.default.options
      const permission = options.permission

      if (permission) {
        return app.$canPermission(permission)
      }
      return true
    })
  }

  if (!hasPermission) {
    error({ statusCode: 403 })
  }
}
