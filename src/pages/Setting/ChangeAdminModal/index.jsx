import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Rate, Tag,message ,notification} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { QUICKTAGS, diyTagMaxLen, diyTagColor, MYICON } from '../../../common/constants/index';


@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 最后的tags是selectedTags和diyTags加在一起
      selectedTags: [],
      diyTags: [],
      diyInputVisible: false,
      diyInputValue: '',

      initialValues: { // 初始值
        name: "",
        position: "",
        host: [],
        diyTags: [],
      }
    };
  }



  // 获取到这个表单实例
  modalFormRef = React.createRef();

  successHandle = (values) => {
    console.log("成功,数据：", values);
  }

  failHandle = () => {
    console.log("失败");
  }

  // 快速添加标签相关
  tagChangeHandle(tag, checked) {
    // ！此tag就是标签的值
    console.log("change的tag,checked", tag, checked)
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags });
  }


  // 自定义标签相关
  diyTagClosehandle = removedTag => {
    const diyTags = this.state.initialValues.diyTags.filter(tag => tag !== removedTag);
    console.log(diyTags);
    const initialValues = this.state.initialValues;
    initialValues.diyTags = diyTags
    this.setState({
      initialValues
    });
  };

  saveInputRef = input => (this.diyAddinput = input);

  showDiyInput = () => {
    this.setState({ diyInputVisible: true }, () => this.diyAddinput.focus());
  };


  diyInputChangeHandle = e => {
    this.setState({ diyInputValue: e.target.value });
  };

  diyInputConfirmHandle = () => {
    const { diyInputValue } = this.state;
    // let { diyTags } = this.state;
    let diyTags = this.state.initialValues.diyTags
    if (diyInputValue && diyTags.indexOf(diyInputValue) === -1) {
      diyTags = [...diyTags, diyInputValue];
    }
    console.log(diyTags);
    const initialValues = this.state.initialValues;
    initialValues.diyTags = diyTags;
    this.setState({
      initialValues,
      diyInputVisible: false,
      diyInputValue: '',
    });
  };



  // Form相关
  onCancel = (e) => {
    e.stopPropagation();
    this.props.hideModifyHandle();
  };


  okClick = (e) => {
    e.stopPropagation();
    // console.log('点击添加啦');
    const{UserLabInfoStore}=this.props;
    const lid=UserLabInfoStore.choosedCardLabInfo.name;
    const originUname=UserLabInfoStore.userInfo.name

    const {password,targetName}=this.modalFormRef.current.getFieldsValue();
    if(!password ||!targetName){
      message.warning("密码和新超管的名称都是必填的！");
      return false;
    }

    const {usersName}=UserLabInfoStore
    if(usersName.indexOf(targetName)<0){
      message.warning('该用户不存在！请重新输入')
      return false;
    }

    // 请求接口
    axios.post('/api/lab/modify_admin', {
      lid,targetName,originUname,password
    }).then(res => {
    const {data}=res
    if(data.status_code){
      // 成功   // 旧密码验证通过，直接将新密码作为新密码(不验证是否重复)且modal自动隐藏
      this.props.hideModifyHandle();   // 并隐藏 修改modal
      notification.success({
        message: '成功移交超管身份',
        duration: 3
      });
     } else {
       message.warning(data.msg)  
     }
    }
    ).catch(error => {
      console.log(error);
    });

    // 并隐藏 修改modal
    this.props.hideModifyHandle();
    setTimeout(() => {
      window.location.reload();  // 刷新页面
    }, 800);                    //设0.8秒让接口请求完

  }


  render() {

    const { initialValues, diyInputVisible, diyInputValue } = this.state;

    const validateMessages = {};
    const { visible } = this.props;
    // const visible = true;

    return (
      <>
        {visible ? (
          <div className="changeAdminLabModalWrap">
            <div className="changeAdminLabModalWraper">
              <div className="modifyModalMask"  >
                <div className="modifyModalContent" >
                  <div className="modifyModalTitleWrap">
                    <div className="modifyModalTitleTextWrap">
                      <MyIcon type="icon-shiyanshiguanlixitong_huaban" style={{ fontSize: 25, marginRight: 12 }} />
                      <span className="modifyModalTitleText">移交超级管理员身份</span>
                    </div>

                    <div className="modifyModalTitleTipWrap">
                      <MyIcon type="icon-zhuyi5" style={{fontSize:30,marginTop:5,marginRight:5}}/>
                      <span>一经移交，你将变为为普通管理员身份，不再拥有编辑该实验室管理员的权限</span>
                    </div>
                  </div>

                  <div className="modifyModalFormWrap">
                    <Form
                      name="modifyForm"
                      size="middle"
                      onFinish={this.successHandle}
                      onFinishFailed={this.failHandle}
                      validateMessages={validateMessages}
                      colon={false}
                      layout="vertical"
                      initialValues={initialValues}
                      ref={this.modalFormRef}
                    >
                      <div className="modifyModalFormNotTwoHalfWrap">

                        {/* 必填区域 */}
                        {/* <div className="modifyModalFormRequireWrap" > */}
                        <Form.Item name="password" required={true} className=""
                          label={
                            <>
                              <MyIcon type="icon-mima" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5, fontWeight: 600 }} />
                                 实验室密码
                              {/* <Tooltip placement="right" title="实验室名称是作为识别不同实验室的标志的，名称不可相同"> */}
                              {/* </Tooltip> */}
                            </>
                          }
                        >
                          <Input size="large"
                            placeholder="请输入实验室密码"
                            style={{ borderRadius: 5, width: 300 }}
                          // disabled={true}
                          />
                        </Form.Item>

                        <Form.Item name="targetName" required={true} className=""
                          label={
                            <>
                              <MyIcon type="icon-chaojiguanliyuan1" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5 }} />
                              新的超级管理员
                        </>}
                        >
                          <Input size="large" width={100} min={1}
                            style={{ borderRadius: 5, width: 300 }}
                            placeholder="请输入新的超级管理员的名称"
                          />
                        </Form.Item>
                        {/* </div> */}



                      </div>

                    </Form>

                    {/* 底部按钮区*/}
                    <div className="modifyModalBottomWrap">
                      {/* jjjjj</div> */}
                      {/* <div></div> */}
                      <div className="modifyModalBtnWrap">
                        <Button
                          onClick={e => this.onCancel(e)}
                          size="large"
                          className="modifyModalResetBtn"
                          style={{ boxShadow: "0 1px 18px 1px rgba(69,65,78,.07)", borderRadius: 5 }}
                        >
                          取消
                     </Button>
                        <Button
                          type="primary"
                          onClick={e => this.okClick(e)}
                          className="modifyModalOkBtn"
                          size="large"
                        >
                          确认
                  </Button>
                      </div>
                    </div>
                  </div>





                </div>

              </div>
            </div>
          </div>


        ) : ('')
        }

      </>
    );
  }

}

export default index;
