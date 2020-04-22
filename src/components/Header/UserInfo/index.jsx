import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import { Button, Avatar, Dropdown, Menu } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  setClick = () => {
    console.log('点击设置了');
    const { history } = this.props;
    history.replace({
      pathname: '/setting',
      search: history.location.search
    });
  }

  render() {
    const name="潘伟旋"
    return (

      <span className={styles.userInfoWrap}>
        <MyIcon type="icon-icon-test" style={{ fontSize: 36, borderRadius: '72' }} />
        {/* <Dropdown
          overlay={
            <Menu onClick={this.outClick}>
              <Menu.Item >
                <span style={{ color: "#8a8a8a" }} className={styles.outTextWrap}>
                  <span>退出登录</span>
                  <MyIcon type="icon-tuichu2" style={{ fontSize: 15, marginLeft: 6, color: "#8a8a8a" }} />
                </span>
              </Menu.Item>
            </Menu>
           
          }
        > */}

        <span style={{ display: "flex", alignItems: "center", marginLeft: "6px" }}>
      <span>{name}</span>
          <span onClick={this.setClick} style={{ display: "flex", alignItems: "center"}}>
            <MyIcon type="icon-shezhi" style={{ fontSize: "22px", marginLeft: "18px", cursor: 'pointer' }}
            />
          </span>
        </span>
        {/* </Dropdown> */}

      </span>

    );
  }

}

export default withRouter(index);

