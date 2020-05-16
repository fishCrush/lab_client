import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Drawer, List, Avatar, Badge, Result } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { formatDate } from '../../../common/utils/index.js';
import { identityMapChinese } from '../../../common/constants/index.js';

@inject('NotificationStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      moreVisible: false,
      detailObj: {}
    };
  }

  showDrawer = () => {
    const oldVisible = this.state.visible;
    this.setState({
      visible: !oldVisible,
    },()=>{
      if(!this.state.visible){
        this.setState({
          moreVisible:false
        })
      }
    });
  };


  onClose = () => {
    this.setState({
      visible: false,
      moreVisible:false
    });
  };

  moreClick=obj => {
    this.setState({
      detailObj: obj,
      moreVisible: true
    });

    const { nid } = obj;
    axios.post('/api/notification/read_by_nid', {
      nid
    }).then(res => {
      const { data } = res;
      if (data.status_code) {
        // 重新请求通知消息列表  //这里的uid：后端直接从cookie取
        axios.post('/api/notification/querylist_by_uid').then(res => {
          const { data } = res;
          if (data.status_code) {
            const list = data.data;
            // console.log('通知列表的list', list);
            const { NotificationStore } = this.props;
            NotificationStore.setNotiList(list);
          } else {
            console.log('重新请求通知消息列表 失败');
          }
        }
        ).catch(error => {
          console.log(error);
        });
      } else {
        console.log('发送了阅读某条消息的请求 失败');
      }
    }
    ).catch(error => {
      console.log(error);
    });

  }

  backClick=() => {
    this.setState({
      moreVisible: false
    });
    setTimeout(() => {
      // window.location.reload();
    }, 500);
  }



  componentDidMount(){
  }


  render() {
    const { visible, moreVisible, detailObj } = this.state;

    const readed = (<Avatar size={35} style={{ backgroundColor: '#69c0ff' }}><MyIcon type="icon-yiduxiaoxi1" style={{ fontSize: 22, color: '#fff', backgroundColor: '#69c0ff' }} /></Avatar>);
    const unRead = (<Avatar size={35} style={{ backgroundColor: '#ff7875' }}><MyIcon type="icon-weiduxiaoxi1" style={{ fontSize: 22, color: '#fff', backgroundColor: '#ff7875' }} /></Avatar>);

    let newsList = [];
    let unReadNum = 0;
    const { NotificationStore } = this.props;
    if (NotificationStore && NotificationStore.notiList) {
      const { notiList } = NotificationStore;
      // console.log('通知组件渲染里的 NotificationStore的notiList', notiList);

      const unReadList = notiList.filter(noteItem => noteItem.isRead === false);
      unReadNum = unReadList.length;

      newsList = notiList.map(notiItem => {
        const { nid, created_at, originUid, lid, actionType, identityType, isRead } = notiItem;
        let newsObj = {};
        newsObj.nid = nid;
        newsObj.time = formatDate(new Date(created_at));
        newsObj.readed = isRead;
        let title = '';
        title = (actionType === 'add') ? `新增加${identityMapChinese[identityType]}身份` : `被移除${identityMapChinese[identityType]}身份!`;
        newsObj.title = title;
        let detailObj = Object.assign({}, { nid, created_at, originUid, lid, actionType, identityType });
        newsObj.detailObj = detailObj;
        return newsObj;
      });

    }


    return (
      <div className="notiWrap">
        <span className={`${styles.notiWrap} `} onClick={this.showDrawer}>
          <span className={`${styles.notiIconWrap} ${visible ? styles.notiChecking : ''}`}>
            <Badge dot count={unReadNum}>
              <MyIcon type="icon-Ioniconsmdnotifications" style={{ fontSize: 30, height: '30px', width: '30px' }} />
            </Badge>
          </span>
        </span>

        <Drawer
          title={`你有 ${unReadNum} 条未读消息`}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          style={{ borderRadius: '15px' }}
          className="notiDrawer"
          width="350"
          headerStyle={{ height: 58, padding: '18px 30px' }}
        >
          {!moreVisible ? (
            <List
              itemLayout="horizontal"
              dataSource={newsList}
              renderItem={(item, key) => (
                <List.Item key={key}>
                  <List.Item.Meta
                    avatar={item.readed ? readed : unRead}
                    title={(
                      <span className="titleLineWrap" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.title}</span>
                        <span
                          className="more"
                          style={{ cursor: 'pointer', color: '#1890ff', fontSize: 15, fontWeight: 400 }}
                          onClick={() => this.moreClick(item.detailObj)}
                        >
                          详情
                        </span>
                      </span>
                    )}
                    description={item.time}
                  />
                </List.Item>
              )}
            />

          ) : (
            <Result
              status={detailObj.actionType === 'add'?'403':'500'}
              title={(
                <>
                  {detailObj.actionType === 'add' ? (
                    <span>
                      你已被用户
                      <span className="notiHighLight">{detailObj.originUid}</span>
                      添加为实验室
                      <span className="notiHighLight">{detailObj.lid}</span>
                      的
                      <span className="notiHighLight">{identityMapChinese[detailObj.identityType]}</span>
                    </span>
                  ) : (
                    <span>
                      您已被用户
                      <span className="notiHighLight">{detailObj.originUid}</span>
                      移除了实验室
                      <span className="notiHighLight">{detailObj.lid}</span>
                      的
                      <span className="notiHighLight">{identityMapChinese[detailObj.identityType]}</span>
                      身份，失去编辑和查看该实验室的权利！
                    </span>
                  )}

                </>
              )}
              subTitle={formatDate(new Date(detailObj.created_at))}
              extra={
                <Button type="primary" onClick={this.backClick}>返回消息列表</Button>
              }
            />
          )}
        </Drawer>
      </div>

    );
  }

}

export default index;
