import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from 'mobx-react';
import styles from './index.less';
import axios from 'axios';
import MyIcon from '../../../components/MyIcon';
import { withRouter } from 'react-router-dom';
import CountDownCom from '../../../components/CountDownCom'
// export default IconFont;

@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneInputValue: '',
      isPhoneInputFocus: false,
      smsInputValue: '',
      isSmsInputFocus: false,
      nameInputValue: '',
      isNameInputFocus: false,
      codeInputValue: '',
      isCodeInputFocus: false,
      leftTime:0,
      isRetry:false
    };
  }
  btnClick = () => {
    this.props.history.push('/login');
    // console.log("hhh")
  }

  phoneInputChange= event => {
    this.setState({
      phoneInputValue: event.target.value,
    });
  }

  phoneInputFocus = () => {
    this.setState({
      isPhoneInputFocus: true,
    });
  }

  phoneInputBlur = () => {
    this.setState({
      isPhoneInputFocus: false,
    });
  }

  smsInputChange= event => {
    this.setState({
      smsInputValue: event.target.value,
    });
  }

  smsInputFocus= () => {
    this.setState({
      isSmsInputFocus: true,
    });
  }

  smsInputBlur = () => {
    this.setState({
      isSmsInputFocus: false,
    });
  }

  nameInputChange = event => {
    this.setState({
      nameInputValue: event.target.value,
    });
  }

  nameInputFocus = () => {
    this.setState({
      isNameInputFocus: true,
    });
  }

  nameInputBlur = () => {
    this.setState({
      isNameInputFocus: false,
    });
  }

  codeInputChange = event => {
    this.setState({
      codeInputValue: event.target.value,
    });
  }

  codeInputFocus = () => {
    this.setState({
      isCodeInputFocus: true,
    });
  }

  codeInputBlur = () => {
    this.setState({
      isCodeInputFocus: false,
    });
  }

  isSending=false
  sendCode=()=>{
    const { isRetry,phoneInputValue } = this.state;
    const _that = this;
    if (_that.isSending) {
      return;
    }
    _that.isSending = true;
    // 点了 重发之后才是retry
    const myreg=/^[1][3,4,5,7,8][0-9]{9}$/
    if(!phoneInputValue || (!myreg.test(phoneInputValue))){
      message.warning("请输入正确的手机号码");
      return false;
    }
    axios.post('/api/user/send_sms',{
      phone:phoneInputValue
    }).then(res=>{
      // console.log('res',res)
      const {data}=res
      if(data.status_code){
        _that.setState({ leftTime: 60 });
      }
      _that.isSending = false;

    })
  }

  loginBtnClick = () => {
    // 验证输入是否符合要求
    const {UserLabInfoStore}=this.props;
    const {usersName}=UserLabInfoStore;
    let { phoneInputValue,smsInputValue,nameInputValue, codeInputValue } = this.state; // codeInputValue这里输入的是密码
   
    //去除输入值的前后空格
    phoneInputValue=phoneInputValue?phoneInputValue.trim():"";
    smsInputValue=smsInputValue?smsInputValue.trim():'';
    nameInputValue=nameInputValue?nameInputValue.trim():'';
    codeInputValue=codeInputValue?codeInputValue.trim():'';

    if(!phoneInputValue||!smsInputValue||!nameInputValue||!codeInputValue){
      message.warning('四个输入框都是必填项，请确定好');
      return false;
    }

    //验证用户是否符合要求
    if(usersName && usersName.indexOf(nameInputValue)>-1){ //不重复要求
      console.log("进来了");
      message.warning("哎哟~该用户名已经被注册使用过了！请重新换一个");
      return false;
    }

    if(nameInputValue.length<2||nameInputValue.length>10){ //长度范围要求
      message.warning("请输入2~10之间长度的用户名");
      return false;
    }
   

    //验证密码长度是否符合
    if(codeInputValue.length<2||codeInputValue.length>30){
      message.warning("请输入2~30之间长度的密码");
      return false;
    }
    // 请求接口
    axios.post('/api/user/register', {
      phone: String(phoneInputValue),
      code: String(smsInputValue),
      name: String(nameInputValue),
      password: String(codeInputValue),

    }).then(res => {
      const {data}=res
      if(data.status_code){
        // 登录成功
        const { history,UserLabInfoStore } = this.props;
        UserLabInfoStore.setUser(String(nameInputValue));
        history.replace({
          pathname: '/setting',
          search: history.location.search
        });
       } else {
        //  message.warning("注册用户失败")
         message.warning(data.msg)
       }
      }
    ).catch(error => {
      console.log(error);
    });

  }

  onBackClick=()=>{
    this.props.goBack()
  }

  render() {
    const { isRetry } = this.state;
    const { isNameInputFocus, isCodeInputFocus, isPhoneInputFocus, isSmsInputFocus } = this.state;
    return (

      <div className={styles.registerWrap}>
        <div className={styles.loginLeft}>
          <div className={styles.textWrap}>
            <div className={styles.title}>注册个人账号</div>
            <div className={styles.descriptionBack} onClick={this.onBackClick}> 
              《 =     返回登录
            </div>
          </div>
        </div>

        <div className={`${styles.loginRight} indexRegisterRightWrap`}>
          <div className="indexLoginRightContent">
            {/*  输入框区域 */}
            {/* 手机号码输入 */}
            <div className="inputPhoneWrap">
              <div className={`label ${isPhoneInputFocus ? 'labelFocus' : ''}`}>手机号码</div>
              <input
                type="text"
                value={this.state.phoneInputValue}
                onChange={this.phoneInputChange}
                onFocus={this.phoneInputFocus}
                onBlur={this.phoneInputBlur}
              />
              <span />
            </div>

            <div className="smsWrap">
              <div className={`label ${isSmsInputFocus ? 'labelFocus' : ''}`}>
                验证码
              </div>
              <div className="smslineTwo">
                {/* 左侧 输入验证码*/}
                <span className="smsInputWrap"> 
                  <input
                    type="text"
                    value={this.state.smsInputValue}
                    onChange={this.smsInputChange}
                    onFocus={this.smsInputFocus}
                    onBlur={this.smsInputBlur}
                  />
                  <span />
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
                {/* 右侧end */}

              </div>
            </div>

            {/* 用户名输入 */}
            <div className="inputUserWrap">
              <div className={`label ${isNameInputFocus ? 'labelFocus' : ''}`}>用户名称</div>
              <input
                type="text"
                value={this.state.nameInputValue}
                onChange={this.nameInputChange}
                onFocus={this.nameInputFocus}
                onBlur={this.nameInputBlur}
              />
              <span />
            </div>

            <div className="inputPasswordWrap">
              <div className={`label ${isCodeInputFocus ? 'labelFocus' : ''}`}>密码</div>
              <input
                type="password"
                value={this.state.codeInputValue}
                onChange={this.codeInputChange}
                onFocus={this.codeInputFocus}
                onBlur={this.codeInputBlur}
              />
              <span />
            </div>

            {/* 按钮区域 */}
            <div className="btnWrap">
              {/* <DiyThemeBtn text="登录" size="large" onClick={this.loginBtnClick} /> */}
              <Button type="primary" size="large" onClick={this.loginBtnClick}>
                注册
              </Button>
            </div>

            {/* 辅助提示区域 */}
            <div className="tipWrap">
              <span>注意：名称注册后是不能修改的</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(index);

