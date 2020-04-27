/*
 * @Author: your name
 * @Date: 2020-04-15 00:11:24
 * @LastEditTime: 2020-04-28 00:19:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/subStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';

export class NotificationStore {
    @observable notiList=[];

    @action.bound
    setNotiList(list) {
      this.notiList = list;
      console.log('notiList的值已存入', this.notiList);
    }


}

export default new NotificationStore();
