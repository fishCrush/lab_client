import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { inject, observer } from 'mobx-react';


@inject('ChooseStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navList: ["该实验室温度数据", '该实验室湿度数据', '所有实验室的数据对比'],
      navSelectedIndex: 0
    };
  }

  navItemClick = (index) => {
    const { ChooseStore } = this.props;
    ChooseStore.changeEnvNavSelectedIndex(index);
  }

  render() {
    const { navList } = this.state;
    const { ChooseStore } = this.props;
    const { envNavSelectedIndex } = ChooseStore;
    return (

      <div className={`${styles.navWrap} selfNavWrap`}>
        {navList.map((navItem, index) => {
          return (
            <span 
            key={index} 
            className={`${styles.navItem} ${envNavSelectedIndex===index? 'navItemSelected':''}`} 
            onClick={() => this.navItemClick(index)}>
              <Button size="large" type="default">{navItem}</Button>
            </span>
          )
        })
        }


      </div>

    );
  }

}

export default index;
