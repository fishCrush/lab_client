import React, { Component } from 'react';
import { Button, Drawer, List, Avatar, Badge } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      unReadNum:1,
      newsList: [

        {
          title: 'Ant Design Title 1',
          email: 'hhhh',
          readed: false
        },
        {
          title: 'Ant Design Title 2',
          email: 'hhhh',
          readed: true


        },
        {
          title: 'Ant Design Title 3',
          email: 'hhhh',
          readed: true

        }


      ],
     
    };
  }

  showDrawer = () => {
    const oldVisible = this.state.visible
    this.setState({
      visible: !oldVisible,
      numNew: 0
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  render() {
    const readed = (<Avatar size={35} style={{ backgroundColor: "#69c0ff" }}><MyIcon type="icon-yiduxiaoxi1" style={{ fontSize: 22, color: "#fff", backgroundColor: "#69c0ff" }} /></Avatar>)
    const unRead = (<Avatar size={35} style={{ backgroundColor: "#ff7875" }}><MyIcon type="icon-weiduxiaoxi1" style={{ fontSize: 22, color: "#fff", backgroundColor: "#ff7875" }} /></Avatar>)
    const { visible,unReadNum } = this.state;
    return (
      <>
        <span className={`${styles.notiWrap} `} onClick={this.showDrawer} >
          <span className={`${styles.notiIconWrap} ${visible ? styles.notiChecking : ""}`}>
            <Badge dot count={unReadNum} >
              <MyIcon type="icon-Ioniconsmdnotifications" style={{fontSize:30,height:"30px",width:"30px"}}/>
            </Badge>
          </span>
        </span>

        <Drawer
          title={`你有 ${this.state.numNew} 条未读消息`}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          style={{ borderRadius: "15px" }}
          className="notiDrawer"
          width="350"
          headerStyle={{ height: 58, padding: '18px 30px' }}
        >
          <List
            itemLayout="horizontal"
            dataSource={this.state.newsList}
            renderItem={(item, key) => (
              <List.Item key={key}>
                <List.Item.Meta
                  avatar={item.readed ? readed : unRead}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </Drawer>
      </>

    );
  }

}

export default index;
