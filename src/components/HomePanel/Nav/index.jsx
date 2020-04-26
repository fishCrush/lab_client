import React, { Component } from 'react';
import { Button, Menu } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { inject, observer } from 'mobx-react';
// import {ChooseStore} from '../../../store/chooseStore';


@inject('ChooseStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOpenKeys: ['subMain'],
      defaultSelectedKeys: ['mainAdd'],
    };
  }
  menuItemClick = (e) => {
    // console.log('dididi  e', e)
    const { ChooseStore } = this.props;
    ChooseStore.changeNavSelected(e.key);
    
    // .this.setState({
    //   current: e.key,
    // });
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
            style={{ height: "1000px", backgroundColor: "#303641" }}
            defaultOpenKeys={defaultOpenKeys}  // 初始展开的栏目
            defaultSelectedKeys={defaultSelectedKeys}  //导航默认选中的
          >
            <Menu.SubMenu
              key="subMain"
              popupClassName={`${styles.subMenuWrap} subMenu`}
              // 
              title={
                <span className={styles.navItem} style={{ height: "60px" }}>
                  <MyIcon type="icon-wupin1" style={{ fontSize: 18 }}
                    className={styles.itemIcon}
                  />
                   资源面板
               </span>
              }
            >
              <Menu.Item key="mainList" className={styles.subMainItem}>
                <span style={{ marginLeft: 50, fontSize: 16 }}>资源列表</span>
              </Menu.Item>
              <Menu.Item key="mainAdd" className={styles.subMainItem}>
                <span style={{ marginLeft: 50, fontSize: 16 }}>添加资源</span>
              </Menu.Item>
            </Menu.SubMenu>


            <Menu.Item key="history" className={styles.navItem} >
              <MyIcon type="icon-lishijilu1" className={styles.itemIcon} style={{ fontSize: 18 }} />
             资源操作记录
            </Menu.Item>


            <Menu.Item key="env" className={styles.navItem}>
              <MyIcon type="icon-riji2" className={styles.itemIcon} />
              实验室环境数据
            </Menu.Item>

            <Menu.Item key="record" className={styles.navItem}>
              <MyIcon type="icon-riji2" className={styles.itemIcon} />
            实验日记
            </Menu.Item>

          </Menu>
        </div>
      </>

    );
  }

}

export default index;
