/*
 * @Author: your name
 * @Date: 2020-04-15 00:11:24
 * @LastEditTime: 2020-04-24 21:31:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/subStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';

export class HistoryStore{
    @observable mapLoading=true;


    @action.bound
    mapLoaded() {
        console.log('mapLoader执行');
        this.mapLoading = false;
        // console.log("已经点击，navSelectedKey值为",this.navSelectedKey);
    }

   
}

export default new HistoryStore();
