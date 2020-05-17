import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { withRouter } from "react-router-dom";
import CountDownCom from '../../../components/CountDownCom';

@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInputValue: "",
      isNameInputFocus: false,
      codeInputValue: "",
      isCodeInputFocus: false,
      isMobileLogin: false,
      phoneInputValue: "",
      isPhoneInputFocus: false,
      smsInputValue: "",
      isSmsInputFocus: false,
      leftTime: 0,
      isRetry: false
    };
  }

  loginBtnClick = () => {
    let { nameInputValue, codeInputValue, isMobileLogin, phoneInputValue, smsInputValue } = this.state;
    if (!isMobileLogin) {  //用户密码登录
      if (!nameInputValue || !codeInputValue) {
        message.warning('用户名和密码均不能为空');
        return false;
      }
      nameInputValue = nameInputValue.trim();
      codeInputValue = codeInputValue.trim();
      // 请求接口
      axios.post('/api/user/login', {
        name: String(nameInputValue),
        password: String(codeInputValue),

      }).then(res => {
        const { data } = res
        if (data.status_code) {
          // 登录成功
          const { history, UserLabInfoStore } = this.props;
          UserLabInfoStore.setUser(String(nameInputValue));
          history.replace({
            pathname: '/home',
            search: history.location.search
          });
        } else {
          message.warning(data.msg)
        }
      }
      ).catch(error => {
        console.log(error);
      });

    } else {  //手机验证码登录
      if (!phoneInputValue || !smsInputValue) {
        message.warning('手机和短信验证码均不能为空');
        return false;
      }
      phoneInputValue = phoneInputValue.trim();
      smsInputValue = smsInputValue.trim();

      // 请求接口
      axios.post('/api/user/login_by_phone', {
        phone: String(phoneInputValue),
        sms: String(smsInputValue),

      }).then(res => {
        const { data } = res
        if (data.status_code) {
          // 登录成功
          const { history, UserLabInfoStore } = this.props;
          UserLabInfoStore.setUser(String(nameInputValue));
          history.replace({
            pathname: '/home',
            search: history.location.search
          });
        } else {
          message.warning(data.msg)
        }
      }
      ).catch(error => {
        console.log(error);
      });
    }

  }

  //用户密码登录
  nameInputChange = (event) => {
    // console.log('event.target.value', event.target.value);
    this.setState({
      nameInputValue: event.target.value,
    })
  }

  nameInputFocus = () => {
    // console.log('focus')
    this.setState({
      isNameInputFocus: true,
    })
  }

  nameInputBlur = () => {
    // console.log('focus')
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
  //手机号码相关
  phoneInputChange = (event) => {
    this.setState({
      phoneInputValue: event.target.value,
    })
  }

  phoneInputFocus = () => {
    this.setState({
      isPhoneInputFocus: true,
    })
  }

  phoneInputBlur = () => {
    this.setState({
      isPhoneInputFocus: false,
    })
  }

  //验证码相关
  smsInputChange = (event) => {
    this.setState({
      smsInputValue: event.target.value,
    })
  }

  smsInputFocus = () => {
    this.setState({
      isSmsInputFocus: true,
    })
  }

  smsInputBlur = () => {
    this.setState({
      isSmsInputFocus: false,
    })
  }

  isSending = false
  sendCode = () => {
    const { isRetry, phoneInputValue } = this.state;
    const _that = this;
    if (_that.isSending) {
      return;
    }
    _that.isSending = true;
    // 点了 重发之后才是retry
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!phoneInputValue || (!myreg.test(phoneInputValue))) {
      message.warning("请输入正确的手机号码");
      return false;
    }
    axios.post('/api/user/send_sms', {
      phone: phoneInputValue
    }).then(res => {
      // console.log('res',res)
      const { data } = res
      if (data.status_code) {
        _that.setState({ leftTime: 60 });
      }
      _that.isSending = false;
    })
  }



  //点击手机验证码登录
  mobileLoginClick = (e) => {

    this.setState({
      isMobileLogin: true
    })
  }
  //点击用户名登录
  unameLoginClick = () => {
    this.setState({
      isMobileLogin: false
    })
  }
  registerBtnClick = () => {
    // 显示注册模块
    this.props.clickRegister();
  }



  render() {
    const { isNameInputFocus, isCodeInputFocus, isMobileLogin, isPhoneInputFocus, isSmsInputFocus } = this.state;
    return (

      <div className={styles.loginWrap}>
        <div className={styles.loginLeft}>
          <div className={styles.textWrap}>
            <div className={styles.title}>实验室资源管理系统</div>
            <div className={styles.description}>edit:潘伟旋</div>
          </div>
        </div>

        <div className={`${styles.loginRight} indexLoginRightWrap`}>
          <div className="indexLoginRightContent">
            {/*  输入框区域 */}
            {!isMobileLogin ? (
              <>
                {/* 用户密码登录 */}
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
              </>
            ) : (
                <>
                  {/* 手机，短信验证码登录 */}
                  <div className="inputPhoneWrap">
                    <div className={`label ${isPhoneInputFocus ? 'labelFocus' : ""}`}>手机号码</div>
                    <input type="text"
                      value={this.state.phoneInputValue}
                      onChange={this.phoneInputChange}
                      onFocus={this.phoneInputFocus}
                      onBlur={this.phoneInputBlur}
                    />
                    <span></span>
                  </div>

                  <div className="smsWrap">
                    <div className={`label ${isSmsInputFocus ? 'labelFocus' : ""}`}>验证码</div>
                    <div className="smslineTwo">
                      {/* 左侧验证码输入框 */}
                      <span className="inputSmsWrap">
                        <input type="text"
                          value={this.state.smsInputValue}
                          onChange={this.smsInputChange}
                          onFocus={this.smsInputFocus}
                          onBlur={this.smsInputBlur}
                        />
                        <span></span>
                      </span>

                      {/* 右侧 发送验证码区域 */}
                      <span className="sendSmsRightWrap">
                        {this.state.leftTime > 0 ? (
                          <CountDownCom
                            leftTime={this.state.leftTime}
                            endFunc={() => {
                              this.setState({
                                leftTime: 0,
                                isRetry: true
                              });
                            }}
                          />
                        ) : (
                            <div className={styles.descWrap}>
                              <p className="linkText" onClick={this.sendCode}>
                                发送验证码
                           </p>
                            </div>
                          )
                        }
                      </span>
                    </div>
                  </div>
                </>
              )}


            {/* 按钮区域 */}
            <div className="btnWrap">
              <Button type="primary" size="large" onClick={this.loginBtnClick}>
                登录
              </Button>
              <span className="otherTip">
                或
                {!isMobileLogin ? (
                  <a href="javascript:void(0);" className="keyText" onClick={this.mobileLoginClick}>通过手机验证码</a>
                ) : (
                    <a href="javascript:void(0);" className="keyText" onClick={this.unameLoginClick}>通过用户名</a>
                  )}

              登录
              </span>
            </div>

            {/* 辅助提示区域 */}
            <div className="tipWrap">
              <span>还没有账户？</span>
              <span className="register" onClick={this.registerBtnClick}>注册</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(index);

