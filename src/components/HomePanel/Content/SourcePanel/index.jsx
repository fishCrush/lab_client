import React, { Component } from 'react';
import { Button, Menu, Avatar, Tag, Tooltip, Statistic } from 'antd';
import axios from 'axios';

import { inject, observer } from 'mobx-react';

import styles from './index.less';
import MyIcon from '../../../../components/MyIcon';
// import AddModal from '../AddModal';
import List from './List'

@inject('ChooseStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

 
  render() {
    // const { labName, labPosition, admin, host, allNum, visible } = this.state
    return (

      <div className={styles.sourcePanelWrap}>
        <List />
      </div>

    );
  }

}

export default index;
