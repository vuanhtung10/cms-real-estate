import { PERMISSION_VIEW, ROLE_VIEW } from '~/constants/permissions'
export default [
  {
    title: 'menu.dashboard',
    icon: 'flaticon2-architecture-and-city',
    page: '/',
    bullet: 'dot'
  },
  {
    title: 'Quản lý thông tin',
    icon: 'flaticon-interface-5',
    bullet: 'dot',
    submenu: [
      {
        title: 'Hãng',
        page: '/brand'
      },
      {
        title: 'Bộ sưu tập',
        page: '/collection'
      },
      {
        title: 'Màu',
        page: '/color'
      },
      {
        title: 'Feature',
        page: '/feature'
      },
      {
        title: 'Nhóm',
        page: '/group'
      },
      {
        title: 'Nguồn',
        page: '/origin'
      },
      {
        title: 'Size',
        page: '/size'
      },
      {
        title: 'Style',
        page: '/style'
      },
      {
        title: 'Thể loại',
        page: '/type'
      }
    ]
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
      }
    ]
  }
]
