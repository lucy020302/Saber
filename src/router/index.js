import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode:'hash',
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
      children: [
        {
          path: 'password',
          name: 'login',
          component: () => import('@/pages/login/passwordPage.vue')
        },
        {
          path: 'VerifiCode',
          component: () => import('@/pages/login/VerificationCode.vue')
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'homeIndex',
          component: () => import('@/pages/home/HomeIndex.vue')
        },
        {
          path: 'Info',
          name: 'Info',
          component: () => import('@/pages/home/InfoIndex.vue')
        },
        {
          path: 'sys/AdminPage',
          name: 'user',//用户管理
          component: () => import('@/pages/home/sys/AdminPage.vue')
        },
        {
          path: 'sys/InstitutionPage',
          name: 'dept',//机构管理
          component: () => import('@/pages/home/sys/InstitutionPage.vue')
        },
        {
          path: 'sys/post',
          name: 'post',//岗位管理
          component: () => import('@/pages/home/sys/PostManagement.vue')
        },
        {
          path: 'sys/AnnexPage',
          name: 'attach',//附件管理
          component: () => import('@/pages/home/sys/AnnexPage.vue')
        },
        {
          path: 'sys/sysDict',
          name: 'dict',//系统字典
          component: () => import('@/pages/home/sys/sysDict.vue')
        },
        {
          path: 'sys/businessDict',
          name: 'dictbiz',//业务字典
          component: () => import('@/pages/home/sys/businessDict.vue')
        },
        {
          path: 'sys/menu',
          name: 'menu',//菜单管理
          component: () => import('@/pages/home/sys/MenuPage.vue')
        },
        {
          path: 'sys/para',
          name: 'param',//系统参数
          component: () => import('@/pages/home/sys/ParaPage.vue')
        },
        {
          path: 'sys/log/CommonLog',
          name: 'usual',//通用日志
          component: () => import('@/pages/home/sys/log/CommonLog.vue')
        },
        {
          path: 'sys/log/InterLog',
          name: 'api',//接口日志
          component: () => import('@/pages/home/sys/log/InterLog.vue')
        },
        {
          path: 'sys/log/ErrorLog',
          name: 'error',//错误日志
          component: () => import('@/pages/home/sys/log/ErrorLog.vue')
        },
        {
          path: 'sys/message/SMSconfig',
          name: 'sms_log',//短信日志
          component: () => import('@/pages/home/sys/message/SMSconfig.vue')
        },
        {
          path: 'sys/permission/interface',
          name: 'api_scope',//接口权限
          component: () => import('@/pages/home/sys/permission/InterPermission.vue')
        },
        {
          path: 'sys/permission/role',
          name: 'role',//角色管理
          component: () => import('@/pages/home/sys/permission/RoleManagement.vue')
        },
        {
          path: 'sys/permission/DataPermission',
          name: 'datascope',//数据权限
          component: () => import('@/pages/home/sys/permission/DataPermission.vue')
        },
        {
          path: 'sys/region',
          name: 'region',//行政区划
          component: () => import('@/pages/home/sys/RegionManagement.vue')
        }
      ]
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  const isNavigatingByClick = sessionStorage.getItem('isNavigatingByClick');

  if (to.name == 'login') {
    next()
  } else {
    if (!token) {
      next({ name: 'login' });
    } else {
      if (to.name == from.name) {
        next(false);
      } else if (isNavigatingByClick) {
        sessionStorage.removeItem('isNavigatingByClick');
        next();
      }else if(sessionStorage.getItem('isRefreshing')) {
        next()
      }
      else {
        next(false);
      }
    }
  }
});


export default router;

