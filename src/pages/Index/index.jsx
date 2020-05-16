import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Login from './Login';
import Register from './Register';

@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRegister: false,
    };
  }

  btnClick = () => {
    this.props.history.push('/login');
    // console.log("hhh")
  }
  clickRegister=()=>{
    this.setState({
      showRegister:true
    })
  }

  goBackClick=()=>{
    this.setState({
      showRegister:false
    })
  }
  componentDidMount(){
    // console.log('index页  componentDidMount')
     //请求所有用户名和实验室名
     axios.post('/api/user/user_lab_all_name').then(res => {
      const {data}=res
      if(data.status_code){
        const { usersName,labsName}=data.data
        const {UserLabInfoStore } = this.props;
        UserLabInfoStore.setUsersLabsName(usersName,labsName);
       
       } else {
         console.log("请求所有用户名和实验室名 失败")
       }
      }
    ).catch(error => {
      console.log(error);
    });

  }

  render() {
    const { showRegister } = this.state;
    return (
      <div className={`${styles.indexWrap} `}>
        {!showRegister ? (
          <Login clickRegister={this.clickRegister}/>
        ) : (
            <Register goBack={this.goBackClick}/>
          )}
      </div>
    );
  }
}

export default index;
