/*
 * @Author: your name
 * @Date: 2020-04-28 00:10:10
 * @LastEditTime: 2020-05-16 12:11:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/notificationStore/index.js
 */
/*
 * @Author: your name
 * @Date: 2020-04-15 00:11:24
 * @LastEditTime: 2020-04-28 01:13:22
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
