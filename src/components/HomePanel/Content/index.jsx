import React, { Component } from 'react';
import { Button, Menu } from 'antd';
import styles from './index.less';
import { inject, observer } from 'mobx-react';
import MyIcon from '../../../components/MyIcon';
import SourcePanel from './SourcePanel';
import AddSource from './AddModal';
import History from './History';
import Dairy from './Dairy';
import Env from '../../../components/Env';

@inject('ChooseStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedPanel:"mainList"  //展示哪块面板(资源main/历史history/日记 record)
    };
  }


  render() {
    // const { selectedPanel } = this.state;
    //selectedPanel 需是从store取的，来自nav中被选择的项的key值。所以有四个值
    const{ChooseStore}=this.props;
    const {navSelectedKey}=ChooseStore;
    return (

      <div className={styles.contentWrap}>

       {/* 资源列表 */}
       { navSelectedKey==='mainList'?(
        <SourcePanel />
       ):('')
      }

      {/* 添加资源 */}
      {
      navSelectedKey === "mainAdd"?(
        <AddSource/>
      ):('')
      }

     {/* 操作历史 */}
     {
      navSelectedKey === "history"?(
        <History/>
      ):('')
      }

     {/* 日记记录 */}
     {
      navSelectedKey === "record"?(
        <Dairy/>
      ):('')
     }

      {/* 环境数据展示 */}
      {
      navSelectedKey === "env"?(
        <Env/>
      ):('')
     }

      </div>

    );
  }

}

export default index;
