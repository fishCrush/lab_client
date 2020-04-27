import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Menu, Avatar, Tag, Tooltip, Statistic } from 'antd';
import styles from './index.less';
import MyIcon from '../../../../../components/MyIcon';

@inject('UserLabInfoStore', 'ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }

  render() {
    let allNum = 278;
    let labName = ''; let labPosition = ''; let admin = ''; let host = '';
    const { UserLabInfoStore } = this.props;
    if (UserLabInfoStore && UserLabInfoStore.selectedLabInfo) {
      const { selectedLabInfo, labAdminName, labHostName } = UserLabInfoStore;
      console.log('selectedLabInfo', selectedLabInfo);
      labName = selectedLabInfo.name;
      labPosition = selectedLabInfo.position;
      admin = labAdminName;
      host = labHostName;
      console.log('labHostName', labHostName);
    }

    return (

      <div className={styles.labInfoWrap}>
        <div className={styles.headerWrap}>
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
                  <Tooltip placement="bottom" title="超级管理员">
                    <MyIcon type="icon-admin" />
                    <span style={{ marginLeft: 4 }}> 超级管理员</span>
                  </Tooltip>
                 <span style={{color:"rgb(179, 127, 235)" }}>：{admin}</span> 
                </span>

                <span className={styles.host}>
                  <Tooltip placement="bottom" title="管理员">
                    <MyIcon type="icon-guanliyuan2" />
                    <span style={{ marginLeft: 4 }}> 管理员</span>
                  </Tooltip>
                  {host.length > 0 ? (
                    <>  ：{host.map(item=><span style={{marginRight:10,color:"rgb(179, 127, 235)"}}>{item}</span>)}</>
                  ) : (<span style={{ color: '#8080809c', marginLeft: 6 }}>暂无</span>)}
                </span>

              </div>
            </section>

          </div>
          <div
            className={`${styles.headerRight} SourcePanelAddBtnWrap`}
          >
            <span>
              <Statistic title="总数" value={allNum} />
            </span>
          </div>
        </div>


      </div>

    );
  }

}

export default index;
