import React, { Component } from 'react';
import { Button, Breadcrumb, Tabs } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import UserInfo from '../Header/UserInfo';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textList: ["实验室1", "实验室2", "实验室3"],
      selectedIndex: 0
    };
  }

 

  itemClick=(index)=>{
    const {selectedIndex}=this.state;
    console.log('index',index);
    if(index!==selectedIndex){
      this.setState({
        selectedIndex:index
      })
    }
    // todo改变选择的实验室的信息
  }

  render() {
    const { textList, selectedIndex } = this.state;


    return (

      <div className={styles.labChooseWrap}>

        <span className={styles.chooseWrap}>
          <MyIcon type="icon-shiyanshi" style={{ marginRight: "20px", color: "#91d5ff" }} />
          <span className={styles.itemWrap}>
            {
              textList.map((item, index) => {
                return (
                  // <span key={index}>{item.lab}</span>
                  <span
                    key={index}
                    className={`${styles.labItem} ${selectedIndex === index ? styles.activeItem : ""}`}
                    onClick={()=>this.itemClick(index)}
                  >
                    {item}
                  </span>
                )
              })
            }
          </span>
        </span>

        <span className={styles.rightWrap}>
          <UserInfo />
        </span>
      </div>

    );
  }

}

export default index;
