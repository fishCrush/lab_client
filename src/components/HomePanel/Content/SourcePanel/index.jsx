import React, { Component } from 'react';
import { Button, Menu, Avatar, Tag, Tooltip, Statistic } from 'antd';
import axios from 'axios';

import { inject, observer } from 'mobx-react';

import styles from './index.less';
import MyIcon from '../../../../components/MyIcon';
// import AddModal from '../AddModal';
import List from './List'

@inject('ChooseStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labName: "信息科学与研究实验室",
      labPosition: "电子楼413",
      admin: "小明鸭鸭",
      host: "小鱼子",
      allNum: 278,
     

    };
  }

  addBtnClick=()=>{
    console.log('点击了添加');
    //改变store里存取的被选中的nav项的值
    // 因此nav里被选中的项 和 后面面板展示的 控制变量都应是nav项的值且存在store里【因为需要控制两种】
    const{ChooseStore}=this.props;
    ChooseStore.changeNavSelected("mainAdd");
  }

  


  render() {
    const { labName, labPosition, admin, host, allNum, visible } = this.state
    return (

      <div className={styles.sourcePanelWrap}>
        {/* <div className={styles.headerWrap}>
          <div className={styles.headerLeft}>
            <section>
              <Avatar
                className={styles.ava}
                icon={<MyIcon type="icon-tiantiwangyuanjingSVG" style={{ width: 70, height: 70, fontSize: 70 }} />}
              />
            </section>

            <section className={styles.labInfo}>
              <div className={styles.infoLineOne}>
                <span className={styles.labName}>{labName}</span>
                <span className={styles.labPosition}>
                  <Tag color="#d9d9d9" style={{ fontSize: 16 }}>{labPosition}</Tag>
                </span>
              </div>
              <div className={styles.infoLineTwo}>
                <span className={styles.admin}>
                  <Tooltip placement="bottom" title="超级管理员" >
                    <MyIcon type="icon-admin" />
                  </Tooltip>
                  ：{admin}
                </span>

                <span className={styles.host}>
                  <Tooltip placement="bottom" title="管理员" >

                    <MyIcon type="icon-guanliyuan2" />
                  </Tooltip>

                   ：{host}
                </span>

              </div>
            </section>

          </div>
          <div 
          className={`${styles.headerRight} SourcePanelAddBtnWrap`}
          >
            <span >
              <Statistic title="总数" value={allNum} />
            </span>
            <Button
              type="primary"
              className={`${styles.addBtn} `}
              style={{ borderRadius: "4px", }}
              onClick={this.addBtnClick}
            >
              添加资源
              </Button>
          </div>
        </div>
        */}
       
        <List />
      </div>

    );
  }

}

export default index;
