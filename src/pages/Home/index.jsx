import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import { Button } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Header from '../../components/Header';
import LabChoose from '../../components/LabChoose';
import HomePanel from '../../components/HomePanel'
// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <>
        <Header />
        <div className={styles.homeContentWrap}>


          <LabChoose />
          <HomePanel />

        </div>
      </>

    );
  }

}

export default withRouter(index);
