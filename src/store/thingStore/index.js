/*
 * @Author: your name
 * @Date: 2020-04-15 00:11:24
 * @LastEditTime: 2020-04-27 16:42:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/subStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';

export class ThingStore{
    @observable mapLoading=true;

    @observable thingList=[]; //当前实验室的所有物品信息(供筛选时提供原所有列表)
    @observable showingThingList=[]; //当前正在展示的实验室的所有物品信息
    
    @observable modifyThingid="";  //当前正在修改的物品的thingid
    @observable modifyThingObj={};  //当前正在修改的物品的信息
    @observable modifyTags=[];
    // @action.bound
    // setActionObj(actionObj) {
    //     this.actionObj = actionObj
    //     console.log("actionObj已存入",this.thingList);
    // }
    @action.bound
    setShowingThingList(thingList) {  //今天条件筛选时调用
        this.showingThingList = thingList
        console.log("showingThingList已存入",this.showingThingList);
    }

    @action.bound
    resetThingList() {  //今天条件筛选时调用
        this.showingThingList = this.thingList
       console.log("thiinglist已重置")
    }

    @action.bound
    setModifyThingid(thingid) {
        this.modifyThingid = thingid
        console.log("modifyThingid已存入",this.modifyThingid);
    }

    @action.bound
    setModifyTags(tags) {
        this.modifyTags = tags
        console.log("modifyTags已存入",this.modifyTags);
    }

    @action.bound
    setModifyThingObj(thingid) { // 当前选中的物品
        this.modifyThingid = thingid;
        const thingArr=this.thingList.filter(thingItem=>thingItem.action.thingid===thingid) //记得filter返回的是数组
        this.modifyThingObj=thingArr[0];
        this.modifyTags=thingArr[0].tags;
      }
    // @computed get modifyThingObj() { // 当前选中的物品
    //     let thingObj={}
    //     thingObj=this.thingList.filter(thingItem=>thingItem.action.thingid===this.modifyThingid)
    //     return thingObj
    //   }
    @action.bound
    setThingList(thingList) {  //处理化全部时使用
        this.thingList = thingList
        console.log("thingList已存入",this.thingList);
    }

   
}

export default new ThingStore();
