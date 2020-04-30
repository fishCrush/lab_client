import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Menu } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { formatDate } from '../../../common/utils/index.js';
// import {ChooseStore} from '../../../store/chooseStore';


@inject('ChooseStore', 'HistoryStore', 'UserLabInfoStore','ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOpenKeys: ['subMain'],
      defaultSelectedKeys: ['mainList'],
    };
  }
  menuItemClick = e => {
    const { ChooseStore,UserLabInfoStore,ThingStore } = this.props;
    const lid = UserLabInfoStore.selectedLabInfo?UserLabInfoStore.selectedLabInfo.name:''; // 当前被选中的实验室名
    ChooseStore.changeNavSelected(e.key);
    // console.log('e.key', e.key);

    // 若选择了资源列表面板
    if (e.key === 'mainList') {
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
          // console.log('thingList', thingList);

          // 转成Table组件需要的数据格式
          const lastThingList = thingList.map(thingItem => {
            const { thingid, name, num, tags, rate, remark, imgs, created_at } = thingItem;
            return Object.assign({}, { action: { thingid, name }, name, num, tags, rate, remark, imgs, time: created_at }); // 将thingid传给action,用于修改和删除某条记录时标识用
          });
          // console.log('处理后的thingList', lastThingList);
          ThingStore.setThingList(lastThingList); // 存到store里
          ThingStore.setShowingThingList(lastThingList); // 存到store里
        } else {
          console.log('资源列表 失败');
        }
      }
      ).catch(error => {
        console.log(error);
      });
    }

    // 如果选择了历史面板
    if (e.key === 'history') {
      const { UserLabInfoStore, HistoryStore } = this.props;
      const { lid } = UserLabInfoStore;
      axios.post('/api/history/list', {
        lid
      }).then(res => {
        const { data } = res;
        if (data.status_code) {
          const { historys, changes, bulks } = data.data;
          // console.log('historys,changes', historys, changes, bulks);

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
          // console.log('newHistorys', newHistorys);

          // 处理历史批量增加 东西名
          const lastHistorys = newHistorys.map(historyItem => {
            const bulkList = bulks.filter(bulkItem => bulkItem.hid === historyItem.hid);
            const bulkNames = bulkList.map(item => item.thing);
            return Object.assign(historyItem, { bulk: bulkNames });
          });
          // console.log('lastHistorys', lastHistorys);

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

  }

  render() {

    const { ChooseStore } = this.props;
    const { navSelectedKey } = ChooseStore;
    // console.log("store key",ChooseStore.navSelectedKey);
    const { defaultOpenKeys, defaultSelectedKeys } = this.state;
    return (

      <>
        <div className={`${styles.navWrap} homePanelNavWrap`}>
          <Menu
            onClick={this.menuItemClick}
            selectedKeys={[navSelectedKey]}
            // mode="vertical"
            mode="inline"
            theme="dark"
            style={{ height: '1000px', backgroundColor: '#303641',width:250 }}
            defaultOpenKeys={defaultOpenKeys} // 初始展开的栏目
            defaultSelectedKeys={defaultSelectedKeys} // 导航默认选中的
          >
            <Menu.SubMenu
              key="subMain"
              popupClassName={`${styles.subMenuWrap} subMenu`}
              //
              title={(
                <span className={styles.navItem} style={{ height: '60px' }}>
                  <MyIcon
                    type="icon-wupin1" style={{ fontSize: 18 }}
                    className={styles.itemIcon}
                  />
                  资源面板
                </span>
              )}
            >
              <Menu.Item key="mainList" className={styles.subMainItem}>
                <span style={{ marginLeft: 50, fontSize: 16 }}>资源列表</span>
              </Menu.Item>
              <Menu.Item key="mainAdd" className={styles.subMainItem}>
                <span style={{ marginLeft: 50, fontSize: 16 }}>添加资源</span>
              </Menu.Item>
            </Menu.SubMenu>


            <Menu.Item key="history" className={`${styles.navItem} historyNav`} >
              <MyIcon type="icon-lishijilu1" className={styles.itemIcon} 
              style={{
                //  fontSize: 18
                // paddingLeft:0
                  }} />
              资源操作记录
            </Menu.Item>


            <Menu.Item key="env" className={`${styles.navItem} envNav`}>
              <MyIcon type="icon-riji2" className={styles.itemIcon} />
              实验室环境数据
            </Menu.Item>

            {/* <Menu.Item key="record" className={`${styles.navItem} recordNav`}>
              <MyIcon type="icon-riji2" className={styles.itemIcon} />
              实验日记
            </Menu.Item> */}

          </Menu>
        </div>
      </>

    );
  }

}

export default index;
