import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Rate, Tag,message,notification} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { QUICKTAGS, diyTagMaxLen, diyTagColor } from '../../../common/constants/index';

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

  // Form相关
  onCancel = (e) => {
    e.stopPropagation();
    this.props.hideModifyHandle();
  };

  okClick = (e) => {
    e.stopPropagation();
    console.log('点击添加啦');
    const {isStart,UserLabInfoStore}=this.props;
    const {labsName}=UserLabInfoStore;
      console.log("labsName",labsName);
    let {name,position,remark}=this.modalFormRef.current.getFieldsValue();
    name=name?name.trim():"";
    position=position?position.trim():"";
    remark=remark?remark.trim():'';

    if(isStart){    // 创建实验室
      if(!name ||!position){
        message.warning("实验室名和位置都是必填的！");
        return false;
      }
      // 判断实验室名称是否已被占用
      if(labsName && labsName.indexOf(name)>-1){
        message.warning("哎哟~该实验室名已经被添加使用过了，请重新换一个");
        return false;
      }
      // 请求接口
      axios.post('/api/lab/create', {
        name, position, remark
      }).then(res => {
      const {data}=res
      if(data.status_code){
        // 成功   // 旧密码验证通过，直接将新密码作为新密码(不验证是否重复)且modal自动隐藏
        this.props.hideModifyHandle();   // 并隐藏 修改modal
        notification.success({
          message: '实验室已创建成功',
          duration: 3
        });

        // setTimeout(() => {
        //   window.location.reload();  // 刷新页面
        // }, 600); 
    
       } else {
         message.warning(data.msg)  
       }
      }
      ).catch(error => {
        console.log(error);
      });

    } else {   // 修改实验室
      if(!position){
        message.warning("实验室位置不能为空");
        return false;
      }
      axios.post('/api/lab/modify_base', {
         position, remark,lid:name
      }).then(res => {
      const {data}=res
      if(data.status_code){
        this.props.hideModifyHandle();   // 并隐藏 修改modal
        notification.success({
          message: '已修改成功',
          duration: 3
        });

        setTimeout(() => {
          window.location.reload();  // 刷新页面
        }, 600); 
    
       } else {
         message.warning(data.msg)  
       }
      }
      ).catch(error => {
        console.log(error);
      });
    }
  }

  render() {
    const { diyInputVisible, diyInputValue } = this.state;
    const validateMessages = {};
    const { visible, isStart } = this.props;
    // console.log("isStart !isStart", isStart, !isStart);
    const addLabNameToolTip = isStart ? "实验室名称是作为识别不同实验室的标志的，名称不可相同" : '实验室名称不可修改'
    const titleText=isStart?"添加新的实验室":"修改实验室信息";
    // 若是编辑修改实验室：需有初始值
    const initialValues = {}
    if (!isStart) {
      const {UserLabInfoStore}=this.props;
      if(UserLabInfoStore){
        const {name,position,remark}=UserLabInfoStore.choosedCardLabInfo
         initialValues.name = name
        initialValues.position = position
        initialValues.remark = remark
      }
    }
    // const visible = true;

    return (
      <>
        {visible ? (
          <div className="addLabModalWrap">
            <div className="addLabModalWraper">
              <div className="modifyModalMask"  >
                <div className="modifyModalContent" >
                  <div className="modifyModalTitleWrap">
                    <MyIcon type="icon-shiyanshiguanlixitong_huaban" style={{ fontSize: 25, marginRight: 12 }} />
                    <span className="modifyModalTitleText">{titleText}</span>
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
                        <Form.Item name="name" required={true} className=""
                          label={
                            <>
                              <MyIcon type="icon-icon-test7" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5, fontWeight: 600 }} />
                                 实验室名称
                              <Tooltip placement="right" title={addLabNameToolTip}>
                                <MyIcon type="icon-zhuyi4" style={{ marginLeft: 4, fontSize: 19 }} />
                              </Tooltip>
                            </>
                          }
                        >
                          <Input size="large"
                            placeholder="请输入实验室名称"
                            style={{ borderRadius: 5, width: 300 }}
                            disabled={!isStart}
                          />
                        </Form.Item>

                        <Form.Item name="position" required={true} className=""
                          label={
                            <>
                              <MyIcon type="icon-tubiaokuwenjian-gengxin-" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5 }} />
                              实验室位置
                        </>}
                        >
                          <Input size="large"
                            style={{ borderRadius: 5, width: 300 }}
                            placeholder="请输入实验室所在的楼号和房间号"
                          />
                        </Form.Item>
                        {/* </div> */}

                        {/* 备注区域 */}
                        <Form.Item name="remark" className=""
                          label={
                            <>
                              <MyIcon type="icon-beizhu2" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5 }} />
                              备注
                        </>}
                        >
                          <Input size="large"
                            style={{ borderRadius: 5, width: 300 }}
                            placeholder="可输入实验室的描述或相关备注"
                          />
                        </Form.Item>

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
