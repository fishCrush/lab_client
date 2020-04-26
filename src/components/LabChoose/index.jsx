import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Breadcrumb, Tabs } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import UserInfo from '../Header/UserInfo';

@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // textList: ['实验室1', '实验室2', '实验室3'],
      selectedIndex: 0
    };
  }

  itemClick=index => {
    const { selectedIndex } = this.state;
    console.log('index', index);
    const{ UserLabInfoStore }=this.props;
    // const lid =UserLabInfoStore.selectedLabInfo.name
    if (index !== selectedIndex) {
      UserLabInfoStore.setSelectedLabIndex(index) //改变store里选中的实验室的序号
      this.setState({
        selectedIndex: index
      },()=>{
        const{ UserLabInfoStore }=this.props;
        const lid =UserLabInfoStore.selectedLabInfo.name
        
        axios.post('/api/lab/setCookie_lid',{  // 请求重新种新lid的cookie
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
      });
    }
  }

  render() {
    let textList=[]
    const { selectedIndex } = this.state;
    const { UserLabInfoStore } = this.props;
    if(UserLabInfoStore){
      textList = UserLabInfoStore.labHostNames
    }

    return (
      <div className={styles.labChooseWrap}>
        <span className={styles.chooseWrap}>
          <MyIcon type="icon-shiyanshi" style={{ marginRight: '20px', color: '#91d5ff' }} />
          <span className={styles.itemWrap}>
            {
              textList.map((item, index) => (
                // <span key={index}>{item.lab}</span>
                <span
                  key={index}
                  className={`${styles.labItem} ${selectedIndex === index ? styles.activeItem : ''}`}
                  onClick={() => this.itemClick(index)}
                >
                  {item}
                </span>
              ))
            }
          </span>
        </span>

        <span className={styles.rightWrap}>
          <UserInfo />
        </span>
      </div>

    );
  }

}

export default index;
