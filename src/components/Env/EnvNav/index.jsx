import React, { Component } from 'react';
import { Button,Switch } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { inject, observer } from 'mobx-react';


@inject('ChooseStore',"EnvStore")
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navList: ["该实验室数据", '所有实验室的数据对比'],
      navSelectedIndex: 0,
      switchVal:false
    };
  }

  navItemClick = (index) => {
    const { ChooseStore } = this.props;
    ChooseStore.changeEnvNavSelectedIndex(index);
  }

  
  switchChange=(checked) => {
    // this.setState({
    //     isRendererCanvas: !checked,    
    //     forceUpdate: true
    // });
    console.log("checked",checked);
    this.setState({
      switchVal:checked
    })
    const {EnvStore}=this.props;
    if(!checked){
      EnvStore.changeShowType("temp")
    } else{
      EnvStore.changeShowType("hum")
    }
}

  render() {
    console.log('envmav渲染');
    const { navList,switchVal } = this.state;
    const { ChooseStore} = this.props;
    const { envNavSelectedIndex } = ChooseStore;
    const nowType=switchVal?"湿度":"温度"
    const switcText = switchVal? "温度 Temperature":'湿度 Humidity';
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
        <span style={{fontSize:16,textShadow: "0 0 0.1px rgba(0, 0, 0, 0.07)"}}>当前展示:{nowType}数据</span>
        <span  style={{marginLeft:20}}>
          <Switch onChange={this.switchChange} defaultChecked={false}/>
          <span style={{fontSize:17,marginLeft:5}}>
          切换查看
          <span style={{color:"#6a56a5"}}>{switcText}</span> 
          </span>
        </span>


      </div>

    );
  }

}

export default index;
