import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { withRouter } from "react-router-dom";

import { Button, Avatar, Dropdown, Menu } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
// export default IconFont;
@inject('UserLabInfoStore','ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  setClick = () => {
    // console.log('点击设置了');
    const { history } = this.props;
    history.replace({
      pathname: '/setting',
      search: history.location.search
    });
  }

  render() {
    let name='';
    const{UserLabInfoStore}=this.props;
    if(UserLabInfoStore){
      name=UserLabInfoStore.uname
    }
    return (

      <span className={styles.userInfoWrap}>
        <MyIcon type="icon-icon-test" style={{ fontSize: 36, borderRadius: '72' }} />
        <span style={{ display: "flex", alignItems: "center", marginLeft: "6px" }}>
      <span>{name}</span>
          <span onClick={this.setClick} style={{ display: "flex", alignItems: "center"}}>
            <MyIcon type="icon-shezhi" style={{ fontSize: "22px", marginLeft: "18px", cursor: 'pointer' }}
            />
          </span>
        </span>
      </span>

    );
  }

}

export default withRouter(index);

