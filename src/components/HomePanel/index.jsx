import React, { Component } from 'react';
import { Button, Menu } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Nav from './Nav'
import Content from './Content'
// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    // const {  } = this.state
    return (

      <div className={styles.homePanelWrap}>
        <Nav />
        <Content />
      </div>

    );
  }

}

export default index;
