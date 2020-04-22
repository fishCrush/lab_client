import React, { Component } from 'react';
import { Button, Modal, Form, Input, InputNumber, Tooltip,  Rate, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../../../../MyIcon';
import { QUICKTAGS, diyTagMaxLen, diyTagColor } from '../../../../../../../common/constants/index';

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
        name: "hhhh",
        num: 12,
        tags: ["娱乐"],
        diyTags: ["kk", "曾经的diy"],
        rate: 3,
        remark: "这是一些曾经的备注"
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
    console.log("change的tag,checked",tag,checked)
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
    let diyTags=this.state.initialValues.diyTags
    if (diyInputValue && diyTags.indexOf(diyInputValue) === -1) {
      diyTags = [...diyTags, diyInputValue];
    }
    console.log(diyTags);
    const initialValues = this.state.initialValues;
    initialValues.diyTags=diyTags;
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

  // maskClick=(e)=>{
  //无法生效 所以干脆去掉这个
  //   e.stopPropagation();  
  //   this.props.hideModifyHandle();
  // }

  onSubmit = (e) => {
    e.stopPropagation();
    console.log('点击添加啦');

    // 请求接口
    // 应通过form实例的getFieldsValue获取到所有的字段值（tag注意）然后进行处理，再进行ajax将数据发送出去

    // 并隐藏 修改modal
    // this.props.hideModifyHandle();

  }


  render() {

    const { initialValues, selectedTags,  diyInputVisible, diyInputValue } = this.state;

    const validateMessages = {};
    const { visible } = this.props;

    return (
      <>
        {visible ? (
          <div className="modifyModalWrap">
            <div className="modifyModalWraper">
              <div className="modifyModalMask"  >
                <div className="modifyModalContent" >
                  <div className="modifyModalTitleWrap">
                    <MyIcon type="icon-shiyanshiyuyue1" style={{ fontSize: 25, marginRight: 12 }} />
                    <span className="modifyModalTitleText">修改资源</span>

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
                              <MyIcon type="icon-wupinzujie" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5 }} />
                                 名称
                              <Tooltip placement="right" title="名称不可修改">
                                <MyIcon type="icon-zhuyi4" style={{ marginLeft: 4, fontSize: 19 }} />
                              </Tooltip>
                            </>
                          }
                        >
                          <Input size="large"
                            placeholder="请输入物品名称"
                            style={{ borderRadius: 5, width: 300 }}
                            disabled={true}
                          />
                        </Form.Item>

                        <Form.Item name="num" required={true} className=""
                          label={
                            <>
                              <MyIcon type="icon-shuliang2" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5 }} />
                          数量
                        </>}
                        >
                          <InputNumber size="large" width={100} min={1}
                            style={{ borderRadius: 5, width: 300 }}
                          />
                        </Form.Item>
                        {/* </div> */}

                        {/* 标签区域 */}
                        <div className="modifyModalFormTagWrap">
                          <Form.Item name="tags" className=""
                            label={
                              <>
                                <MyIcon type="icon-biaoqian4"
                                  style={{ marginRight: "10px", fontSize: 23, marginLeft: 13, fontWeight: 800 }}
                                />
                                <span style={{ marginTop: 5 }}>
                                  快速添加标签
                             <span style={{ color: "rgba(0, 0, 0, 0.35)", fontSize: 13, marginLeft: 4 }}>点击进行选中</span>
                                </span>
                              </>
                            }
                          >
                            {QUICKTAGS.map(tag => (
                              <Tag.CheckableTag
                                key={tag}
                                checked={selectedTags.indexOf(tag) > -1}
                                onChange={checked => this.tagChangeHandle(tag, checked)}
                              >
                                {tag}
                              </Tag.CheckableTag>
                            ))}
                          </Form.Item>

                          <Form.Item name="diyTags" className=""
                            label={
                              <>
                                <MyIcon type="icon-label"
                                  style={{ marginRight: "10px", fontSize: 28, marginLeft: 13, fontWeight: 800, marginTop: 13 }}
                                />
                                <span style={{ marginTop: 13, }}>自定义标签</span>
                              </>
                            }
                          >
                            <div>
                              {this.state.initialValues.diyTags.map((tag, index) => {
                                const isLongTag = tag.length > diyTagMaxLen;
                                const tagElem = (
                                  <Tag
                                    key={tag}
                                    closable={true}
                                    color={diyTagColor}
                                    onClose={() => this.diyTagClosehandle(tag)}
                                  >
                                    {isLongTag ? `${tag.slice(0, diyTagMaxLen)}...` : tag}
                                  </Tag>
                                );
                                return isLongTag ? (
                                  <Tooltip title={tag} key={tag}>
                                    {tagElem}
                                  </Tooltip>
                                ) : (
                                    tagElem
                                  );
                              })}
                              {diyInputVisible && (
                                <Input
                                  ref={this.saveInputRef}
                                  type="text"
                                  size="small"
                                  style={{ width: 78 }}
                                  value={diyInputValue}
                                  onChange={this.diyInputChangeHandle}
                                  onBlur={this.diyInputConfirmHandle}
                                  onPressEnter={this.diyInputConfirmHandle}
                                />
                              )}
                              {!diyInputVisible && (
                                <Tag className="site-tag-plus" onClick={this.showDiyInput}>
                                  <span className="modifyModalDiyAddIconWrap"><PlusOutlined />&nbsp;点此添加</span>
                                </Tag>
                              )}
                            </div>
                          </Form.Item>
                        </div>

                      </div>



                      {/* 隔开 */}
                      <Form.Item name="rate" className=""
                        label={
                          <>
                            <MyIcon type="icon-xingxing2"
                              style={{ marginRight: "10px", fontSize: 23, marginLeft: 15, fontWeight: 800 }}
                            />
                           重要程度
                        </>
                        }
                      >
                        <Rate />
                      </Form.Item>

                      <Form.Item name="remark" className=""
                        label={
                          <>
                            <MyIcon type="icon-beizhu-" style={{ marginRight: "10px", fontSize: 22, marginLeft: 15, }} />
                           备注
                        </>
                        }
                      >
                        <Input.TextArea size="large" width={300}
                          placeholder="可在此输入一些备注"
                          style={{ borderRadius: 5 }}
                        />
                      </Form.Item>





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
