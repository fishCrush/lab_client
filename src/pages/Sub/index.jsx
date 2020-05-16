import React, { Component } from 'react';
import { Button ,Spin} from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import { inject, observer } from 'mobx-react';
import Header from '../../components/Header';
import BaiduMap from '../../components/BaiduMap/index';
@inject('SubStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {SubStore}=this.props;
    return (
      <>
        <Header />
        <div className={styles.envPanel}>
          sub
          <Spin spinning={SubStore.mapLoading} size="large">
          {/* <BaiduMap/> */}
          </Spin>
      </div>
      </>
    );
  }
}

export default index;
