/*
 * @Author: your name
 * @Date: 2020-04-15 00:11:24
 * @LastEditTime: 2020-05-16 12:11:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/subStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';
export class HistoryStore {
    @observable historyList=[];
    
    @action.bound
    setHistoryList(list) {
      this.historyList = list;
      // console.log('historyList的值已存入', this.historyList);
    }
}

export default new HistoryStore();
