import React, { Component } from 'react';
import { Button, message } from 'antd';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { withRouter } from "react-router-dom";

// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInputValue: "",
      isNameInputFocus: false,
      codeInputValue: "",
      isCodeInputFocus: false,
    };
  }
  btnClick = () => {
    this.props.history.push('/login');
    // console.log("hhh")
  }

  nameInputChange = (event) => {
    console.log('event.target.value', event.target.value);
    this.setState({
      nameInputValue: event.target.value,
    })
  }

  nameInputFocus = () => {
    console.log('focus')
    this.setState({
      isNameInputFocus: true,
    })
  }

  nameInputBlur = () => {
    console.log('focus')
    this.setState({
      isNameInputFocus: false,
    })
  }

  codeInputChange = (event) => {
    this.setState({
      codeInputValue: event.target.value,
    })
  }

  codeInputFocus = () => {
    this.setState({
      isCodeInputFocus: true,
    })
  }

  codeInputBlur = () => {
    this.setState({
      isCodeInputFocus: false,
    })
  }

  loginBtnClick = () => {
    console.log("sss");
    //验证输入是否符合要求
    const { nameInputValue, codeInputValue } = this.state;
    if (nameInputValue.length === 0 || codeInputValue.length === 0) {
      message.warning('用户名和密码均不能为空！请正确输入');
      return false;
    }


    // 请求接口后
    // 登录失败  密码错误

    // 登录成功
    const { history } = this.props;
    history.replace({
      pathname: '/home',
      search: history.location.search
    });

  }

  registerBtnClick = () => {
    // 显示注册模块
    this.props.clickRegister();
  }



  render() {
    const { isNameInputFocus, isCodeInputFocus } = this.state;
    return (

      <div className={styles.loginWrap}>
        <div className={styles.loginLeft}>
          <div className={styles.textWrap}>
            <div className={styles.title}>实验室资源管理系统</div>
            <div className={styles.description}>edit:潘伟旋</div>
          </div>
        </div>

        <div className={`${styles.loginRight} indexLoginRightWrap`}>
          {/* <Button type="primary" className={styles.loginBtn} size="large" shape="round" onClick={this.btnClick}>
            <MyIcon type="icon-ren" />
            登录/注册
         </Button> */}


          {/* <span className="input input--haruki">
              <input className="input__field input__field--haruki" type="text" id="input-1" />
              <label className="input__label input__label--haruki" htmlFor="input-1">
                <span className="input__label-content input__label-content--haruki">First Name</span>
              </label>
            </span> */}

          <div className="indexLoginRightContent">

            {/*  输入框区域 */}
            <div className="inputUserWrap">
              <div className={`label ${isNameInputFocus ? 'labelFocus' : ""}`}>用户名称</div>
              <input type="text"
                value={this.state.nameInputValue}
                onChange={this.nameInputChange}
                onFocus={this.nameInputFocus}
                onBlur={this.nameInputBlur}
              />
              <span></span>
            </div>

            <div className="inputPasswordWrap">
              <div className={`label ${isCodeInputFocus ? 'labelFocus' : ""}`}>密码</div>
              <input type="password"
                value={this.state.codeInputValue}
                onChange={this.codeInputChange}
                onFocus={this.codeInputFocus}
                onBlur={this.codeInputBlur}
              />
              <span></span>
            </div>

            {/* 按钮区域 */}
            <div className="btnWrap">
              {/* <DiyThemeBtn text="登录" size="large" onClick={this.loginBtnClick} /> */}
              <Button type="primary" size="large" onClick={this.loginBtnClick}>
                登录
                </Button>
            </div>

            {/* 辅助提示区域 */}
            <div className="tipWrap">
              <span>还没有账户？</span>
              <span className="register" onClick={this.registerBtnClick}>注册</span>
            </div>


          </div>


          {/* <div className="inputPasswordWrap">
              <input type="text" />
              <span></span>
            </div> */}



        </div>


      </div>

    );
  }

}

export default withRouter(index);

