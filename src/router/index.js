import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout/Layout'

export default new Router({
  routes: [
    {
      path: '/forgetPassword',
      component: () => import('@/views/set/forgetPassword'),
      name: 'forgetPassword',
      title: '忘记密码'
    },
    {
      path: '/invoice',
      component: () => import('@/views/invoice/invoice'),
      name: 'invoice',
      title: '发票'
    },
    {
      path: '/invoiceResult',
      component: () => import('@/views/invoice/invoiceResult'),
      name: 'invoiceResult',
      title: '结果页：开发票'
    },
    {
      path: '/login',
      component: () => import('@/views/set/login'),
      name: 'login',
      title: '登录'
    },
    {
      path: '/register',
      component: () => import('@/views/set/register'),
      name: 'register',
      title: '注册'
    },
    {
      path: '/creditEnquiry',
      component: () => import('@/views/credit/creditEnquiry'),
      name: 'creditEnquiry',
      title: '信用查询'
    },
    {
      path: '/notice',
      component: () => import('@/views/mine/notice'),
      name: 'notice',
      title: '通知'
    },
    {
      path: '/creditInfo',
      component: () => import('@/views/credit/creditInfo'),
      name: 'creditInfo',
      title: '信用查询'
    },
    {
      path: '/document',
      component: () => import('@/views/document/document'),
      name: 'document',
      title: '帮助文档，错题本'
    },
    {
      path: '/documentInfo',
      component: () => import('@/views/document/documentInfo'),
      name: 'documentInfo',
      title: '帮助文档详情'
    },
    {
      path: '/certification',
      component: () => import('@/views/certification/certification'),
      name: 'certification',
      title: '认证'
    },
    {
      path: '/',
      component: Layout,
      children: [{
        path: '',
        component: () => import('@/views/home/home'),
        name: 'home',
        title: '学习'
      }]
    },
    {
      path: '/exam',
      component: Layout,
      children: [{
        path: 'index',
        component: () => import('@/views/exam/exam'),
        name: 'exam',
        title: '考试'
      }
      ]
    },
    {
      path: '/upload',
      component: () => import('@/views/exam/upload'),
      name: 'upload',
      title: '考试上传证件'
    },
    {
      path: '/mine',
      component: Layout,
      children: [{
        path: 'index',
        component: () => import('@/views/mine/mine'),
        name: 'mine',
        title: '我的'
      }
      ]
    },
    {
      path: '/examResult',
      component: () => import('@/views/examMock/result'),
      name: 'examResult',
      title: '考试结果'
    },
    {
      path: '/examRecords',
      component: () => import('@/views/examMock/record'),
      name: 'examRecords',
      title: '考试记录，模拟记录'
    },
    {
      path: '/examIng',
      component: () => import('@/views/examMock/examIng'),
      name: 'examIng',
      title: '正在考试'
    },
    {
      path: '/mockIng',
      component: () => import('@/views/examMock/mockIng'),
      name: 'mockIng',
      title: '正在模拟考试'
    },
    {
      path: '/quesDetail',
      component: () => import('@/views/examMock/detail'),
      name: 'quesDetail',
      title: '问题详情'
    },
    {
      path: '/feedback',
      component: () => import('@/views/mine/feedback'),
      name: 'feedback',
      title: '意见反馈'
    },
    {
      path: '/updatePhone',
      component: () => import('@/views/set/updatePhone'),
      name: 'updatePhone',
      title: '更新手机号'
    },
    {
      path: '/consume',
      component: () => import('@/views/consume/consume'),
      name: 'consume',
      title: '开发票填写'
    },
    {
      path: '/courseDetail',
      component: () => import('@/views/home/courseDetail'),
      name: 'courseDetail',
      title: '课程详情'
    },
    {
      path: '/supplement',
      component: () => import('@/views/certification/supplement'),
      name: 'supplement',
      title: '认证补签'
    },
    {
      path: '/errorBookDetail',
      component: () => import('@/views/document/errorBookDetail'),
      name: 'errorBookDetail',
      title: '错题详情'
    }
  ]
})
