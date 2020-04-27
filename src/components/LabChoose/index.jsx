import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Breadcrumb, Tabs } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import UserInfo from '../Header/UserInfo';

@inject('UserLabInfoStore', 'ChooseStore')
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
    const { UserLabInfoStore, ChooseStore } = this.props;
    const { navSelectedKey } = ChooseStore;
    // const lid =UserLabInfoStore.selectedLabInfo.name
    if (index !== selectedIndex) {
      UserLabInfoStore.setSelectedLabIndex(index); // 改变store里选中的实验室的序号
      this.setState({
        selectedIndex: index
      }, () => {
        const { UserLabInfoStore } = this.props;
        const lid = UserLabInfoStore.selectedLabInfo.name; // 切换后的实验室名

        // 请求重新种新lid的cookie
        axios.post('/api/lab/setCookie_lid', {
          lid,
        }).then(res => {
          const { data } = res;
          if (data.status_code) {
          } else {
            console.log('请求服务端实验室种cookie 失败');
          }
        }
        ).catch(error => {
          console.log(error);
        });



          // 重新请求面板数据, 因为实验室已经有所改变

        if (navSelectedKey === 'mainList') { // 如果切换实验室时此时的左侧导航选择的是mainList 资源面板
          axios.post('/api/thing/query_by_lid', {
            lid,
          }).then(res => {
            const { data } = res;
            if (data.status_code) {
              const { things, imgs } = data.data;

            } else {
              console.log('重新请求资源数据 失败');
            }
          }
          ).catch(error => {
            console.log(error);
          });
        }


        if (navSelectedKey === 'history') { // 如果切换实验室时此时的左侧导航选择的是history 历史面板
          axios.post('/api/history/list', {
            lid,
          }).then(res => {
            const { data } = res;
            if (data.status_code) {
              // const { things, imgs } = data.data;

            } else {
              console.log('重新请求历史数据 失败');
            }
          }
          ).catch(error => {
            console.log(error);
          });
        }




      });
    }
  }

  render() {
    let textList = [];
    const { selectedIndex } = this.state;
    const { UserLabInfoStore } = this.props;
    if (UserLabInfoStore) {
      textList = UserLabInfoStore.labHostNames;
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
