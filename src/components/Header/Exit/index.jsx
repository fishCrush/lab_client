import React, { Component } from 'react';
import { Button, Avatar, Dropdown, Menu } from 'antd';
import { withRouter } from "react-router-dom";

import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  outClick = () => {
    console.log('退出登录');
    const { history } = this.props;
    history.replace({
      pathname: '/index',
      search: history.location.search
    });
  }

  render() {
    return (

      <span className={styles.userInfoWrap}>
        {/* <MyIcon type="icon-icon-test" style={{ fontSize: 36, borderRadius: '72', marginRight: "12px" }} /> */}
        <Dropdown
          overlay={
            <Menu onClick={this.outClick}>
              <Menu.Item >
                <span style={{ color: "#8a8a8a" }} className={styles.outTextWrap}>
                  <span>退出登录</span>
                  <MyIcon type="icon-tuichu2" style={{ fontSize: 15, marginLeft: 6, color: "#8a8a8a" }} />
                </span>
              </Menu.Item>
            </Menu>
            // <span>退出</span>
          }
        >

          <span >
            <MyIcon type="icon-xialajiantou" style={{ fontSize: "15px", marginLeft: "12px" }} />
          </span>
        </Dropdown>

      </span>

    );
  }

}

export default withRouter(index);
