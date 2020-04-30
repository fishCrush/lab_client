/*
 * @Author: your name
 * @Date: 2020-04-12 13:28:49
 * @LastEditTime: 2020-04-30 10:40:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/index.js
 */

 // 用户个人的通知消息
export { default as NotificationStore } from './notificationStore';

// 左侧边导航栏选择和实验室选择
export { default as ChooseStore } from './chooseStore'; 

// 实验室环境资源面板
export { default as SubStore } from './subStore'; 

// 实验室环境资源面板
export { default as EnvStore } from './envStore'; 
// 当前用户信息和当前实验室信息（超管实验室+有权利实验室）
export { default as UserLabInfoStore } from './userLabInfoStore'; 

// 当前实验室资源
export { default as ThingStore } from './thingStore'; 


// 当前实验室操作历史
export { default as HistoryStore } from './historyStore'; 





