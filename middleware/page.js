export default ({ route, store, redirect }) => {
  // add page title
  const pageTitle = route.meta.reduce(
    (pageTitle, meta) => meta.pageTitle || pageTitle,
    ''
  )
  store.commit('page/SET_PAGE_TITLE', pageTitle)
}
