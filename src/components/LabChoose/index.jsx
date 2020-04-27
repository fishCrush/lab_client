import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Breadcrumb, Tabs } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import UserInfo from '../Header/UserInfo';
import { formatDate } from '../../common/utils/index.js';

@inject('UserLabInfoStore', 'ChooseStore', 'ThingStore', 'HistoryStore')
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
    const { UserLabInfoStore, ChooseStore, ThingStore } = this.props;
    const { navSelectedKey } = ChooseStore;
    if (index !== selectedIndex) {
      UserLabInfoStore.setSelectedLabIndex(index); // 改变store里选中的实验室的序号
      this.setState({
        selectedIndex: index
      }, () => {
        const { UserLabInfoStore, HistoryStore, ThingStore } = this.props;
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
              // console.log("初始化的things,imgs",things,imgs)
              // 处理图片（对应到各自的thingid中）
              const thingList = things.map(thingItem => {
                const imgList = imgs.filter(imgItem => imgItem.thingid === thingItem.thingid);
                const urls = imgList.map(item => item.url);
                return Object.assign(thingItem, { imgs: urls });
              });

              // 修改标签labels，字符串转数组
              thingList.map(thingItem => {
                const labels = thingItem.labels.split('&');
                return Object.assign(thingItem, { tags: labels });
              });
              console.log('thingList', thingList);

              // 转成Table组件需要的数据格式
              const lastThingList = thingList.map(thingItem => {
                const { thingid, name, num, tags, rate, remark, imgs, created_at } = thingItem;
                return Object.assign({}, { action: { thingid, name }, name, num, tags, rate, remark, imgs, time: created_at }); // 将thingid传给action,用于修改和删除某条记录时标识用
              });
              console.log('处理后的thingList', lastThingList);
              ThingStore.setThingList(lastThingList); // 存到store里
              ThingStore.setShowingThingList(lastThingList); // 存到store里
            } else {
              console.log('请求初始化时的资源列表 失败');
            }
          }
          ).catch(error => {
            console.log(error);
          });
        }


        if (navSelectedKey === 'history') { // 如果切换实验室时此时的左侧导航选择的是history 历史面板
          axios.post('/api/history/list', {
            lid
          }).then(res => {
            const { data } = res;
            if (data.status_code) {
              const { historys, changes, bulks } = data.data;
              console.log('historys,changes', historys, changes, bulks);
              const { HistoryStore } = this.props;

              // 处理 历史修改属性名即值
              const newHistorys = historys.map(historyItem => {
                const changeList = changes.filter(changeItem => changeItem.hid === historyItem.hid);
                // const changes=changeList
                const changesArr = changeList.map(item => {
                  let newChangeObj = {};
                  newChangeObj.attri = item.attri;
                  newChangeObj.old = item.old;
                  newChangeObj.new = item.new;
                  return newChangeObj;
                });
                return Object.assign(historyItem, { change: changesArr });
              });
              console.log('newHistorys', newHistorys);

              // 处理历史批量增加 东西名
              const lastHistorys = newHistorys.map(historyItem => {
                const bulkList = bulks.filter(bulkItem => bulkItem.hid === historyItem.hid);
                const bulkNames = bulkList.map(item => item.thing);
                return Object.assign(historyItem, { bulk: bulkNames });
              });
              console.log('lastHistorys', lastHistorys);

              // 处理成history面板可以直接赋值的格式
              const historyList = lastHistorys.map(historyItem => {
                let newHistoryObj = {};
                newHistoryObj.time = formatDate(new Date(historyItem.created_at));
                newHistoryObj.action = historyItem.type;
                newHistoryObj.host = historyItem.operator;
                newHistoryObj.thing = historyItem.thing;
                newHistoryObj.change = historyItem.change;
                newHistoryObj.bulk = historyItem.bulk;
                return newHistoryObj;
              });
              HistoryStore.setHistoryList(historyList);
            } else {
              console.log('请求历史记录 失败');
            }
          }
          ).catch(error => {
            console.log(error);
          });
        }

        // 重新请求当前实验室的超管名和普管名
        axios.post('/api/lab/admin_and_host', {
          lid
        }).then(res => {
          const { data } = res;
          if (data.status_code) {
            const { admin, host } = data.data;
            UserLabInfoStore.setLabAdminAndHost(admin, host);
          } else {
            console.log('重新当前被选实验室的超管和普管 失败');
          }
        }
        ).catch(error => {
          console.log(error);
        });


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
