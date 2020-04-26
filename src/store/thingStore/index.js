/*
 * @Author: your name
 * @Date: 2020-04-15 00:11:24
 * @LastEditTime: 2020-04-26 18:37:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/subStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';

export class ThingStore{
    @observable mapLoading=true;

    @observable thingList=[];

    


    @action.bound
    setThingList(thingList) {
        this.thingList = thingList
        console.log("thingList已存入",this.thingList);
    }

   
}

export default new ThingStore();
