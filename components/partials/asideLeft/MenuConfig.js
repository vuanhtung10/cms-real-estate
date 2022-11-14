import {
  PERMISSION_VIEW,
  HOUSE_VIEW,
  ROLE_VIEW,
  RELATION_VIEW,
  PLOT_VIEW,
  ARTICLE_VIEW
} from '~/constants/permissions'
export default [
  {
    title: 'menu.dashboard',
    icon: 'flaticon2-architecture-and-city',
    page: '/',
    bullet: 'dot'
  },
  {
    title: 'Quản lý Bất Động Sản',
    icon: 'flaticon2-architecture-and-city',
    page: '/house',
    permission: HOUSE_VIEW,
    bullet: 'dot'
  },
  {
    title: 'Quản lý Relation',
    icon: 'flaticon-profile-1',
    page: '/relation',
    permission: RELATION_VIEW
  },
  {
    title: 'Quản lý Plot',
    icon: 'flaticon2-architecture-and-city',
    page: '/plot',
    permission: PLOT_VIEW,
    bullet: 'dot'
  },
  {
    title: 'Quản lý bài viết',
    icon: 'flaticon2-paper',
    page: '/article',
    permission: ARTICLE_VIEW,
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
      }
    ]
  }
]
