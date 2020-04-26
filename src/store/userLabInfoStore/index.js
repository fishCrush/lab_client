/*
 * @Author: your name
 * @Date: 2020-04-24 21:27:04
 * @LastEditTime: 2020-04-26 17:22:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/userLabInfoStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';

export class UserLabInfoStore{
    @observable uid="";  //当前登录用户的uid
    @observable userInfo={};  //当前登录用户的信息
    @observable  labAdmin=[]  //当前用户超管的所有实验室的信息
    @observable  labHost=[]
    @observable  selectedLabIndex=0; //home页被选中的普管实验室的index
    @observable  cardLabIndex=0; //超管里被点击的实验卡片的index
    @observable  usersName=[]; //所有用户名
    @observable  labsName=[]; //所有实验室名
    // @observable  labsName=[]; //所有实验室名

    @computed get selectedLabInfo() {  //home页当前被选中的实验室的信息
        const index=this.selectedLabIndex
        const selectedLab=this.labHost[index]
        return selectedLab
    }

    @computed get labHostNames() {   //当前用户普管实验室的名称
        return this.labHost.map(item=>item.name)
    }

    @action.bound
    setSelectedLabIndex(index) { 
        this.selectedLabIndex=index
        console.log("当前实验室序号已存入",this.selectedLabIndex)
    }

    @action.bound
    setUserInfo(userInfo){
        this.userInfo=userInfo
        console.log("当前用户信息已存入",this.userInfo)
    }

    @action.bound
    setUsersLabsName(usersName,labsName){
        this.usersName=usersName
        this.labsName=labsName
        console.log("全部用户实验名已存入",this.usersName,this.labsName)
    }

    @action.bound
    setUser(user){
        this.uid=user
        console.log("用户名已存入",this.uid)
    }

    @action.bound
    setLabAdmin(list){
        this.labAdmin=list
        console.log("超管的实验室已存入",this.labAdmin)
    }

    @action.bound
    setLabHost(list){
        this.labHost=list
        console.log("普管的实验室已存入",this.labHost)
    }

    @action.bound
    setCardLabIndex(index){
        this.cardLabIndex=index
        console.log("存入的index",this.cardLabIndex)
    }

    @computed get choosedCardLabInfo() { //当前被选中的实验室卡片的实验室信息
        const index=this.cardLabIndex
        const choosedCardLabInfo=this.labAdmin[index]
        return choosedCardLabInfo
    }

   

}

export default new UserLabInfoStore();