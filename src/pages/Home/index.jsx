import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Header from '../../components/Header';
import LabChoose from '../../components/LabChoose';
import HomePanel from '../../components/HomePanel'

@inject('UserLabInfoStore','ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  setLidCookie=()=>{
    // console.log("种实验室的cookie")
    const {UserLabInfoStore } = this.props;
    const lid=UserLabInfoStore.selectedLabInfo.name;

      axios.post('/api/lab/setCookie_lid',{
      lid,
      }).then(res => {
      const {data}=res
      if(data.status_code){
      } else {
        console.log("请求服务端实验室种cookie 失败")
      }
      }
      ).catch(error => {
        console.log(error);
      });
  }

  initLabInfo=(lid)=>{
    // 请求初始化时的资源列表：//当前用户的第一间实验室下的资源
    const { ThingStore,UserLabInfoStore } = this.props;

    axios.post('/api/thing/query_by_lid',{
      lid
    }).then(res => {
      const {data}=res
      if(data.status_code){
        const{things,imgs}=data.data
        // console.log("初始化的things,imgs",things,imgs)
        //处理图片（对应到各自的thingid中）
        const thingList = things.map(thingItem=>{
          const imgList=imgs.filter(imgItem=>imgItem.thingid===thingItem.thingid)
          const urls=imgList.map(item=>item.url)
          return Object.assign(thingItem,{imgs:urls})
        })

        // 修改标签labels，字符串转数组
        thingList.map(thingItem=>{
          const labels=thingItem.labels ? thingItem.labels.split("&"):[]
          return Object.assign(thingItem,{tags:labels})
        })
        // console.log("thingList",thingList)

        //转成Table组件需要的数据格式
        const lastThingList=thingList.map(thingItem=>{
          const {thingid,name,  num, tags,rate, remark, imgs,created_at}=thingItem
          return Object.assign({},{action:{thingid,name},name,  num, tags,rate, remark, imgs,time:created_at}) //将thingid传给action,用于修改和删除某条记录时标识用
        })
        // console.log("处理后的thingList",lastThingList)
        ThingStore.setThingList(lastThingList)  //存到store里
        ThingStore.setShowingThingList(lastThingList)  //存到store里
       } else {
         console.log("请求初始化时的资源列表 失败")
       }
      }
    ).catch(error => {
      console.log(error);
    });

    //请求当前被选实验室的超管和普管
    axios.post('/api/lab/admin_and_host',{
      lid
    }).then(res => {  
      const {data}=res
      if(data.status_code){
        const{admin,host}=data.data
        UserLabInfoStore.setLabAdminAndHost(admin,host);
       } else {
         console.log("请求当前被选实验室的超管和普管 失败")
       }
      }
    ).catch(error => {
      console.log(error);
    });


  }
  
  componentDidMount(){
    console.log('home页  componentDidMount')
    const {UserLabInfoStore } = this.props;
    let _that=this;
    
    axios.post('/api/user/user_now').then(res => {  //请求当前用户信息
      const {data}=res
      if(data.status_code){
        UserLabInfoStore.setUserInfo(data.data);
       } else {
         console.log("请求当前用户信息 失败")
       }
      }
    ).catch(error => {
      console.log(error);
    });

    axios.post('/api/lab/list_host').then(res => {   // 请求用户普管的实验室及其信息
      const {data}=res
      if(data.status_code){
        UserLabInfoStore.setLabHost(data.data)
        const lid=UserLabInfoStore.selectedLabInfo.name
        _that.initLabInfo(lid)    // 请求初始化时的资源列表
       } else {
         console.log("请求用户当前可管理的实验室 失败")
       }

       _that.setLidCookie() //初次请求种cookie
      }
    ).catch(error => {
      console.log(error);
    });

  }

  render() {
    return (
      <>
        <Header />
        <div className={styles.homeContentWrap}>


          <LabChoose />
          <HomePanel />

        </div>
      </>

    );
  }

}

export default withRouter(index);
