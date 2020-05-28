import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Upload, message, Rate, Tag,notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../MyIcon';
import BatchAddModal from './BatchAddModal';
import { getBase64 } from '../../../../common/utils/index'
import { uploadUrl, QUICKTAGS, diyTagMaxLen, diyTagColor } from '../../../../common/constants/index';

@inject('UserLabInfoStore','ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchTipVisible:true,
      batchModalVisible: false,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      // 最后的tags是selectedTags和diyTags加在一起
      selectedTags: [],
      diyTags: [],
      diyInputVisible: false,
      diyInputValue: '',
      // ossImgUrls:[],
      imgObjList:[]
    };
  }

  // 批量导入相关
  gearClick = () => {
    this.setState({
      batchModalVisible: true,
      batchTipVisible:false
    })
  }

  hideBatchHandle = () => {
    this.setState({
      batchModalVisible: false,
      batchTipVisible:true
    })
  }

  // 获取到这个表单实例
  formRef = React.createRef();

  successHandle = (values) => {
    console.log("成功,数据：", values);
  }

  failHandle=()=>{
    console.log("失败");
  }

  // 快速添加标签相关
  tagChangeHandle(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags },()=>{
      // console.log("快速标签选择的selectedTags",this.state.selectedTags)
    });
  }

  // 自定义标签相关
  diyTagClosehandle = removedTag => {
    const diyTags = this.state.diyTags.filter(tag => tag !== removedTag);
    // console.log(diyTags);
    this.setState({ diyTags });
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
    let { diyTags } = this.state;
    if (diyInputValue && diyTags.indexOf(diyInputValue) === -1) {
      diyTags = [...diyTags, diyInputValue];
    }
    // console.log(diyTags);
    this.setState({
      diyTags,
      diyInputVisible: false,
      diyInputValue: '',
    });
  };

  // 上传图片相关
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

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
       fileList ,
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
      // console.log("删除后的this.state.newImgObjList",this.state.newImgObjList)
    })
  }

  handleBeforeUpload = file => {
    //限制图片 格式、size、分辨率
    const isJPG = file.type === 'image/jpeg';
    const isJPEG = file.type === 'image/jpeg';
    const isGIF = file.type === 'image/gif';
    const isPNG = file.type === 'image/png';
    const isLtM = file.size / 1024 / 1024 < 6;

    if (!(isJPG || isJPEG || isGIF || isPNG)) {
      message.error('图片格式错误！请上传JPG 、JPEG 、GIF、 PNG格式的图片~');
    } else if (!isLtM) {
      message.error('图片过大！请上传 6M 以内大小的图片~');
    }

  }


  // Form相关
  onReset = () => {
    this.formRef.current.resetFields();
    // 需对标签和图片单独处理
  };

  okClick = () => {
    let {name,num,rate,remark}=this.formRef.current.getFieldsValue();
    name=name?name.trim():"";
    remark=remark?remark.trim():"";
    console.log('this.formRef.current.getFieldsValue()',this.formRef.current.getFieldsValue());

    if(!name||!num){
      message.warning("请填好物品的名称和数量")  
      return false
    }
    const {UserLabInfoStore}=this.props;
    const {userInfo,selectedLabInfo}=UserLabInfoStore
    const {selectedTags,diyTags,imgObjList}=this.state; 
    const labels=[...selectedTags,...diyTags].join('&');
    const imgs=imgObjList.map(item=>item.url);
    // console.log("imgs",imgs);
    axios.post('/api/thing/add', {
      name,num,rate,remark,labels,imgs,
      uname:userInfo.name,
      lid:selectedLabInfo.name
    }).then(res => {
    const {data}=res
    if(data.status_code){
      notification.success({
        message: '添加成功',
        duration: 2
      });
      
      // 添加完自动清空  方便下一个的填写
      this.formRef.current.resetFields()
      this.setState({
        selectedTags:[],
        diyTags:[],
        imgObjList:[],
        fileList:[]
      })
  
      } else {
        message.warning(data.msg)  
      }
    }
    ).catch(error => {
      console.log(error);
    });
  }


  render() {

    const { fileList, previewVisible, previewImage, selectedTags, diyTags, diyInputVisible, diyInputValue,batchTipVisible} = this.state;

    const validateMessages = {};
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <>
        <div className="addModalWrap">
          <div className="addModalWraper">
            {/* <div className="addModalMask" onClick={this.maskClick} > */}
            <div className="addModalContent" >
              <div className="addModalTitleWrap">
                <MyIcon type="icon-shiyanshiyuyue1" style={{ fontSize: 25, marginRight: 12 }} />
                <span className="addModalTitleText">添加实验室资源</span>
              </div>

              <div className="addModalFormWrap">
                <Form
                  name="addForm"
                  size="middle"
                  onFinish={this.successHandle}
                  onFinishFailed={this.failHandle}
                  validateMessages={validateMessages}
                  colon={false}
                  layout="vertical"
                  initialValues={{
                    rate: 3
                  }}
                  ref={this.formRef}
                >
                  <div className="addModalFormTwoHalfWrap">

                    {/* 必填区域 */}
                    <div className="addModalFormRequireWrap" style={{ width: 390 }}>
                      <Form.Item name="name" required={true} className=""
                        label={
                          <>
                            <MyIcon type="icon-wupinzujie" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 5 }} />
                           名称
                           {/* <Tooltip placement="right" title="注意：若名称与已有物品的完全一样，二者数量会归在一起">
                              <MyIcon type="icon-zhuyi4" style={{ marginLeft: 4, fontSize: 19, color: '#ff7875' }} />
                            </Tooltip> */}
                          </>
                        }
                      >
                        <Input size="large"
                          placeholder="请输入物品名称"
                          style={{ borderRadius: 5, width: 300 }}
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
                    </div>

                    {/* 标签区域 */}
                    <div className="addModalFormTagWrap">
                      <Form.Item name="quickTags" className=""
                        label={
                          <>
                            <MyIcon type="icon-biaoqian4"
                              style={{ marginRight: "10px", fontSize: 23, marginLeft: 15, fontWeight: 800 }}
                            />
                            <span style={{ marginTop: 5 }}>
                              快速添加标签
                             <span style={{ color: "rgba(0, 0, 0, 0.35)", fontSize: 15, marginLeft: 4 }}>点击进行选中</span>
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
                            <span style={{ marginTop: 13 }}>自定义标签</span>
                          </>
                        }
                      >
                        <div>
                          {diyTags.map((tag, index) => {
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
                              <span className="addModalDiyAddIconWrap"><PlusOutlined />&nbsp;点此添加</span>
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
                    <Rate  />
                  </Form.Item>

                  <Form.Item name="remark" className=""
                    label={
                      <>
                        <MyIcon type="icon-beizhu-" style={{ marginRight: "10px", fontSize: 22, marginLeft: 15, }} />
                           备注
                        </>
                    }
                  >
                    <Input.TextArea size="large"
                      placeholder="可在此输入一些备注"
                      style={{ borderRadius: 5 }}
                    />
                  </Form.Item>

                  <Form.Item name="imgs" className=""
                    label={
                      <>
                        <MyIcon type="icon-tupian" style={{ marginRight: "10px", fontSize: '25px', marginLeft: 15 }} />
                        <span style={{ alignItems: "flex-end" }}>
                          <span>图片</span>
                          <span style={{ height: 32, marginLeft: 18, fontSize: 16, color: "#6b7075a1" }}>
                            最多4张，支持格式：.png .jpg .jpeg .gif
                            </span>
                        </span>
                      </>}
                  >
                    <Upload
                      action="/api//upload/img_oss"
                      accept=".jpg, .jpeg, .png, .gif"
                      name="file"
                      method="post"
                      withCredentials="true" //上传请求时是否携带 cookie
                      listType="picture-card"
                      multiple={true}
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      beforeUpload={this.handleBeforeUpload} // 上传之前，对图片的格式做校验，并获取图片的宽高
                      onChange={this.handleChange}
                      onRemove={this.imgRemoveHandle}
                    >
                      {fileList.length >= 4 ? null : uploadButton}
                    </Upload>

                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                  </Form.Item>
                </Form>
              </div>
              {/* 底部按钮区*/}
              <div className="addModalBottomWrap">
                <div className="addModalBtnWrap">
                  <Button
                    onClick={this.onReset}
                    size="large"
                    className="addModalResetBtn"
                    style={{ boxShadow: "0 1px 18px 1px rgba(69,65,78,.07)", borderRadius: 5 }}
                  >
                    全部重置
                  </Button>
                  <Button
                    type="primary"
                    onClick={this.okClick}
                    className="addModalOkBtn"
                    size="large"
                  >
                    确认添加
                  </Button>
                </div>
              </div>

              {/* 齿轮跳转区 */}
              <div className="addModalGearWrap" onClick={this.gearClick}>
                <Tooltip placement="right" title="批量导入" visible={batchTipVisible} autoAdjustOverflow={false}>
                  <span className="addGearWrap">
                    <MyIcon type="icon-chilun" style={{ fontSize: 29, color: '#fff' }} spin={true} />
                  </span>
                </Tooltip>
              </div>
            </div>

            <BatchAddModal visible={this.state.batchModalVisible} hideBatchModal={this.hideBatchHandle} />
            
          </div>
        </div>


      </>

    );
  }

}

export default index;
