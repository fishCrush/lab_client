import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Login from './Login';
import Register from './Register';

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

  render() {
    const { showRegister } = this.state;
    return (

      <div className={`${styles.indexWrap} `}>
        {!showRegister ? (
          <Login clickRegister={this.clickRegister}/>
        ) : (
            <Register />
          )}
      </div>

    );
  }

}

export default index;
