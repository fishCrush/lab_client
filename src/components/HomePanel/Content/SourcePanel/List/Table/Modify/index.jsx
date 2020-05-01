import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button,Upload, Modal, Form, Input, InputNumber, Tooltip, Rate, Tag,message,notification } from 'antd';
import { PlusOutlined,UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../../../../MyIcon';
import { QUICKTAGS, diyTagMaxLen, diyTagColor } from '../../../../../../../common/constants/index';



@inject('UserLabInfoStore', 'ThingStore')
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
      imgObjList:[],
      initialValues: { // 初始值
        name: 'hhhh',
        num: 12,
        // tags: ["娱乐"],
        diyTags: ['kk', '曾经的diy'], // 标签
        rate: 3,
        remark: '这是一些曾经的备注'
      }
    };
  }

  // 获取到这个表单实例
  modalFormRef = React.createRef();

  successHandle = values => {
    // console.log('成功,数据：', values);
  }

  failHandle = () => {
    console.log('失败');
  }

  // 标签
  tagClosehandle = removedTag => {
    const { ThingStore } = this.props;
    const {  modifyTags } = ThingStore;
    const newTags = modifyTags.filter(tag => tag !== removedTag);  //删除后的数组
    // console.log("删除后的标签",newTags);
    ThingStore.setModifyTags(newTags);
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
    const { ThingStore } = this.props;
    let modifyTags=ThingStore.modifyTags

    if (diyInputValue && modifyTags.indexOf(diyInputValue) === -1) {
      modifyTags = [...modifyTags, diyInputValue];
    }
    // console.log(modifyTags);
    ThingStore.setModifyTags(modifyTags);
    this.setState({
      diyInputVisible: false,
      diyInputValue: '',
    });
  };



  // Form相关
  onCancel = e => {
    e.stopPropagation();
    this.props.hideModifyHandle();
  };


  okClick = e => {
    e.stopPropagation();
    // console.log('点击添加啦');
    const {name, num,  rate, remark}=this.modalFormRef.current.getFieldsValue();
    const { ThingStore,UserLabInfoStore } = this.props;
    const {imgObjList}=this.state; 
    console.log('okClick imgObjList',imgObjList);
    const {uname,lid}=UserLabInfoStore;
    const nLabels=ThingStore.modifyTags.join("&")
    const thingid=ThingStore.modifyThingid
    const imgs=imgObjList.map(item=>item.url);
    console.log('请求参数里的imgs',imgs);
    // 请求接口
    axios.post('/api/thing/modify', {
      uname,
      lid,
      thingid,
      name,
      imgs,
      nNum:num,
      nRate:rate, 
      nRemark:remark,
      nLabels
    }).then(res => {
    const {data}=res
    if(data.status_code){
      // 成功   // 旧密码验证通过，直接将新密码作为新密码(不验证是否重复)且modal自动隐藏
      this.props.hideModifyHandle();   // 并隐藏 修改modal
      message.success("修改成功");

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
    // 并隐藏 修改modal
    // this.props.hideModifyHandle();

  }

  handleChange = ({ fileList }) => {
    console.log('handleChange fileList',fileList)
    const imgObjList=[]
    fileList.forEach(file=>{
      if(file.response){
        if(file.response.status_code){
          const newImgObj={}
          newImgObj["uid"]=file.uid  //留下uid做图片的标识，删除图片时可用
          newImgObj["url"]=file.response.data.url
          imgObjList.push(newImgObj)
        }
      }
    })

    this.setState({ 
      // fileList ,
      imgObjList
     },()=>{
       // console.log("this.state.imgObjList",this.state.imgObjList)
     });
  }

  imgRemoveHandle=(file)=>{
    // console.log('imgRemoveHandle file',file)
    const {imgObjList}=this.state;
    const newImgObjList=imgObjList.filter(item=>item.uid!==file.uid)
    this.setState({
      newImgObjList
    },()=>{
      console.log("删除后的this.state.newImgObjList",this.state.newImgObjList)
    })
  }



  render() {
    const { visible ,ThingStore } = this.props;
    const { diyInputVisible, diyInputValue } = this.state;
    const validateMessages = {};
    let initialValues = {};
    let tags=[]
    if (ThingStore && ThingStore.thingList) {
      const { modifyThingObj,modifyTags } = ThingStore;
      // console.log('修改面板 modifyThingObj', modifyThingObj);
      const { name, num,  rate, remark } = modifyThingObj;
      initialValues = Object.assign({}, { name, num, rate, remark});
      tags=modifyTags;
      // console.log('initialValues', initialValues);
    }

    return (
      <>
        {visible ? (
          <div className="modifyModalWrap">
            <div className="modifyModalWraper">
              <div className="modifyModalMask">
                <div className="modifyModalContent">
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
                        <Form.Item
                          name="name" required={true} className=""
                          label={(
                            <>
                              <MyIcon type="icon-wupinzujie" style={{ marginRight: '10px', fontSize: '25px', marginLeft: 5 }} />
                              名称
                              <Tooltip placement="right" title="名称不可修改">
                                <MyIcon type="icon-zhuyi4" style={{ marginLeft: 4, fontSize: 19 }} />
                              </Tooltip>
                            </>
                          )}
                        >
                          <Input
                            size="large"
                            placeholder="请输入物品名称"
                            style={{ borderRadius: 5, width: 300 }}
                            disabled={true}
                          />
                        </Form.Item>

                        <Form.Item
                          name="num" required={true} className=""
                          label={(
                            <>
                              <MyIcon type="icon-shuliang2" style={{ marginRight: '10px', fontSize: '25px', marginLeft: 5 }} />
                              数量
                            </>
                          )}
                        >
                          <InputNumber
                            size="large" width={100} min={1}
                            style={{ borderRadius: 5, width: 300 }}
                          />
                        </Form.Item>
                        {/* </div> */}

                        {/* 标签区域 */}
                        <div className="modifyModalFormTagWrap">

                          <Form.Item
                            name="diyTags" className=""
                            label={(
                              <>
                                <MyIcon
                                  type="icon-label"
                                  style={{ marginRight: '10px', fontSize: 28, marginLeft: 13, fontWeight: 800, marginTop: 13 }}
                                />
                                <span style={{ marginTop: 13 }}>标签</span>
                              </>
                            )}
                          >
                            <div>
                              {tags.map((tag, index) => {
                                const isLongTag = tag.length > diyTagMaxLen;
                                const tagElem = (
                                  <Tag
                                    key={tag}
                                    closable={true}
                                    color={diyTagColor}
                                    onClose={() => this.tagClosehandle(tag)}
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
                      <Form.Item
                        name="rate" className=""
                        label={(
                          <span style={{ marginTop:18 }}>
                            <MyIcon
                              type="icon-xingxing2"
                              style={{ marginRight: '10px', fontSize: 23, marginLeft: 15, fontWeight: 800 }}
                            />
                            重要程度
                          </span>
                        )}
                      >
                        <Rate />
                      </Form.Item>

                      <Form.Item
                        name="remark" className=""
                        label={(
                          <>
                            <MyIcon type="icon-beizhu-" style={{ marginRight: '10px', fontSize: 22, marginLeft: 15 }} />
                            备注
                          </>
                        )}
                      >
                        <Input.TextArea
                          size="large" width={300}
                          placeholder="可在此输入一些备注"
                          style={{ borderRadius: 5 }}
                        />
                      </Form.Item>

                      {/* 添加图片区域 */}
                      <Form.Item name="imgs" className=""  style={{display:'block'}}
                      label={
                        <span style={{ marginTop:15 }}>
                          <MyIcon type="icon-tupian" style={{ marginRight: "10px", fontSize: 22, marginLeft: 15 }} />
                          <span >
                            <span>新增图片<span style={{marginLeft:5,fontSize:8}}>支持格式：.png .jpg .jpeg .gif</span></span>
                          </span>
                        </span>}
                      >
                        <Upload 
                        action="/api//upload/img_oss"
                        accept=".jpg, .jpeg, .png, .gif"
                        name="file"
                        method="post"
                        listType='picture'
                        className= 'upload-list-inline'
                        onChange={this.handleChange}
                        onRemove={this.imgRemoveHandle}
                        >
                        <Button>
                          <UploadOutlined /> 上传图片
                        </Button>
                      </Upload>

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
                          style={{ boxShadow: '0 1px 18px 1px rgba(69,65,78,.07)', borderRadius: 5 }}
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
