## 我的NestJS项目

```
nest g guard user/verifyCode --no-spec --flat
```

```js
// 权限列表
list: [
  {
    "id": 1,
    "pid": 0,
    "name": "运营",
    "icon": "menu",
    "perms": null,
    "component": "/dashboard",
    "menuType": "M",
    "sort": 1,
    "isShow": true,
    "createTime": "2021-11-16 12:11:17"
  },
  {
    "id": 226,
    "pid": 1,
    "name": "控制台",
    "icon": "",
    "perms": "",
    "component": "/dashboard",
    "menuType": "C",
    "sort": 9,
    "isShow": true,
    "createTime": "2021-11-30 14:13:37"
  },
  {
    "id": 285,
    "pid": 226,
    "name": "首页数据",
    "icon": "",
    "perms": "admin:statistics:home:index",
    "component": "",
    "menuType": "A",
    "sort": 0,
    "isShow": true,
    "createTime": "2021-12-03 16:51:09"
  },
]

// 组装为树形数据
menus: [
  {
    id: 0,
    name: '主目录',
    childList: [
      {
        id: 1,
        pid: 0,
        name: '运营',
        component: '/dashboard',
        icon: 'menu',
        menuType: 'M', // M：目录，C：菜单 F：按钮
        sort: 1,
        perms: null,
        isShow: false, // 是否在菜单中显示
        createTime: '2021-11-16 12:11:17',
        childList: [
          {
            component: '/dashboard',
            icon: '',
            id: 226,
            menuType: 'C',
            name: '控制台',
            perms: '',
            pid: 1,
            sort: 9,
            childList: [
              {
                component: '',
                createTime: '2021-12-03 16:51:09',
                icon: '',
                id: 285,
                isShow: true,
                menuType: 'A',
                name: '首页数据',
                perms: 'admin:statistics:home:index',
                pid: 226,
                sort: 0,
              },
            ],
          },
        ],
      },
    ],
  },
]; 
```