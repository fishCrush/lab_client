/*
 * @Author: your name
 * @Date: 2020-04-04 16:37:07
 * @LastEditTime: 2020-05-16 12:10:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /client/src/router/index.js
 */
import React, { lazy, Suspense } from 'react';

function loadableComp(LazyComponent) {
    return () => (
      <Suspense fallback={''}>
        <LazyComponent />
      </Suspense>
    );
  }

const Index = loadableComp(lazy(() => import(/* webpackChunkName: "index" */'../pages/Index/index.jsx')));
const Login = loadableComp(lazy(() => import(/* webpackChunkName: "login" */'../pages/Login/index.jsx')));
const Setting = loadableComp(lazy(() => import(/* webpackChunkName: "setting" */'../pages/Setting/index.jsx')));
const Home = loadableComp(lazy(() => import(/* webpackChunkName: "home" */'../pages/Home/index.jsx')));
const Sub = loadableComp(lazy(() => import(/* webpackChunkName: "sub" */'../pages/Sub/index.jsx')));

const routes = [
    {
        path: '',
        component: Index
    },
    {
      path: '/index',
      component: Index
    },
    {
        path: '/login',
        component: Login
    },
    {
      path: '/setting',
      component: Setting
     },
     {
      path: '/home',
      component: Home
     },
     {
      path: '/sub',
      component: Sub
     },
  ];
  
  export default routes;
