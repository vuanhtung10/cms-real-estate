export const state = () => ({
  pageTitle: ''
})

export const mutations = {
  SET_PAGE_TITLE(state, pageTitle) {
    state.pageTitle = pageTitle
  }
}
