import { PERMISSION_VIEW, HOUSE_VIEW, ROLE_VIEW } from '~/constants/permissions'
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
        page: '/role',
        permission: ROLE_VIEW
      },
      {
        title: 'Quản lý quyền truy cập',
        page: '/permission',
        permission: PERMISSION_VIEW
      },
      {
        title: 'Quản lý bất động sản',
        page: '/house',
        permission: HOUSE_VIEW
      }
    ]
  }
]
