export default [
  {
    title: 'menu.dashboard',
    icon: 'flaticon2-architecture-and-city',
    page: '/',
    bullet: 'dot'
  },
  {
    title: 'Quản lý truy cập',
    icon: 'flaticon-profile-1',
    bullet: 'dot',
    submenu: [
      {
        title: 'Quản lý người dùng',
        page: '/user'
      },
      {
        title: 'Quản lý nhóm người dùng',
        page: '/role'
      },
      {
        title: 'Quản lý quyền truy cập',
        page: '/permission'
      }
    ]
  }
]
