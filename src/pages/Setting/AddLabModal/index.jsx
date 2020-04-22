import React, { Component } from 'react';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Rate, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import { QUICKTAGS, diyTagMaxLen, diyTagColor } from '../../../common/constants/index';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 最后的tags是selectedTags和diyTags加在一起
      selectedTags: [],
      diyTags: [],
      diyInputVisible: false,
      diyInputValue: '',

      // initialValues: [],// 表单初始值
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


  onSubmit = (e) => {
    e.stopPropagation();
    console.log('点击添加啦');

    // 请求接口
    // 应通过form实例的getFieldsValue获取到所有的字段值（tag注意）然后进行处理，再进行ajax将数据发送出去

    // 并隐藏 修改modal
    // this.props.hideModifyHandle();

  }


  render() {

    const { diyInputVisible, diyInputValue } = this.state;

    const validateMessages = {};
    const { visible, isStart } = this.props;
    // console.log("isStart !isStart", isStart, !isStart);

    const addLabNameToolTip = isStart ? "实验室名称是作为识别不同实验室的标志的，名称不可相同" : '实验室名称不可修改'
    // 若是编辑修改实验室：需有初始值
    const initialValues = {}
    if (!isStart) {
      initialValues.name = "电子电力研究所";
      initialValues.position = "电子楼325";
      initialValues.remark = "实验室的指导老师是陈明明，陈鸭鸭；大概有30个工位";
      // this.setState({
      //   initialValues
      // })
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
                    <span className="modifyModalTitleText">添加新的实验室</span>
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
                          onClick={e => this.onSubmit(e)}
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
