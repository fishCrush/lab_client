import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Steps, Upload, Button, message, notification, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../../MyIcon';
import {BlobDownload} from '../../../../../common/utils'
// import { uploadUrl, QUICKTAGS, diyTagMaxLen, diyTagColor } from '../../../../common/constants/index';

@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      uploadDisabled: false,//控制文件上传过程中禁止点击上传
      uploadLoading: false,//控制文件上传过程中显示加载中的样式
    };
  }


  maskClick = () => {
    this.props.hideBatchModal();
  }

  // 关闭图标相关
  closeIconClick = () => {
    this.props.hideBatchModal();
    this.setState({
      hover: false
    })
  }
  closeIconMouseEnter = () => {
    this.setState({
      hover: true,

    })
  }
  closeIconMouseLeave = () => {
    this.setState({
      hover: false,
    })
  }



  // 下载文件相关
  downloadClickHandle=(e)=>{
    //阻止点击事件的冒泡
    e.stopPropagation();

    // 请求模板文件，得到数据后在前端自定义生成excel表格
    BlobDownload("xls","批量添加实验室物品的模板文件") 
  }


  //上传文件相关
  upWrapClick=(e)=>{
    e.stopPropagation();//阻止点击事件的冒泡

  }
  
  uploadChangeHandle = (info) => {
    // console.log("info",info)
    this.setState({
      uploadLoading: true,
      uploadDisabled:true
    })

    const { status } = info.file;
    // console.log('status', status);

    // 上传完成或者失败时都将结果打印出来
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList);
    }

    if (status === 'done') {

      this.setState({
        uploadLoading: false,
        uploadDisabled:false

      })

      notification.success({
        message: "文件已上传成功",
        description: `文件名：${info.file.name} `,
        placement: "topRight"
      });
    } else if (status === 'error') {

      this.setState({
        uploadLoading: false,
        uploadDisabled:false
      })

      notification.error({
        message: "文件上传失败！",
        description: `文件名：${info.file.name} `,
        placement: "topRight"
      });
    }
  }

  componentDidMount(){
   
  }

  render() {
    const { hover, uploadDisabled, uploadLoading } = this.state;
    const { visible } = this.props;
    // const visible = true;
    return (
      <>
        {visible ? (
          <div className="batchModalWrap">
            <div className="batchModalWraper">
              <div className="batchModalMask" onClick={this.maskClick} >
                <div className="batchModalContent" >
                  {/* 头部 */}
                  <div className="batchModalTitleWrap">
                    <span className="batchModalTitleText">批量导入</span>
                    <span
                      className={`batchModalCloseIcon }`}
                      onClick={this.closeIconClick}
                      onMouseEnter={this.closeIconMouseEnter}
                      onMouseLeave={this.closeIconMouseLeave}
                    >
                      {
                        !hover ? (
                          <MyIcon type="icon-guanbi3" style={{ fontWeight: 800, fontSize: 20, color: "#d9d9d9" }} />

                        ) : (
                            <MyIcon type="icon-guanbi3" style={{ fontWeight: 800, fontSize: 22, color: "#b37feb" }} />
                          )
                      }

                    </span>
                  </div>
                  {/* 步骤条区域 */}
                  <div className="batchStepsWrap">
                    <Steps progressDot={true}>
                      <Steps.Step
                        status="process"
                        title={
                          <span style={{ marginLeft: 10 }}>
                            <MyIcon type="icon-xuhao" />
                          </span>
                        }
                        description="下载模板Excel文件"
                      />
                      <Steps.Step
                        status="process"
                        title={
                          <span style={{ marginLeft: 6 }}>
                            <MyIcon type="icon-xuhao1" />
                          </span>
                        }
                        description="向下载后的Excel文件里填写数据"
                      />
                      <Steps.Step
                        status="process"
                        title={
                          <span style={{ marginLeft: 6 }}>
                            <MyIcon type="icon-xuhao2" />
                          </span>
                        }
                        description="上传填写好数据的Excel文件" />
                    </Steps>
                  </div>
                  {/* 下载和上传区域 */}
                  <div className="batchActionWrap">
                    <div className="batchDown" onClick={this.downloadClickHandle}>点此下载模板文件</div>
                    <div className="batchOr">或者</div>
                    <div className="batchUp" onClick={this.upWrapClick}>
                      <Upload.Dragger
                        name='file'
                        action='/api/thing/add_bulk_upload'
                        accept=".xlsx,.xls"
                        onChange={this.uploadChangeHandle}  // 上传中、完成、失败都会调用这个函数
                        disabled={uploadDisabled}
                        showUploadList={false}
                        method="post"
                        // data={{test:"hahaha"}}  //附加参数传不了 改成后端从cookie取
                      // headers={{
                      //   "authorization": 'authorization-text',
                      // }}
                      >
                        <>
                          <Spin spinning={uploadLoading} tip="上传中...">
                            <p className="ant-upload-drag-icon">
                              <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点此上传数据文件</p>
                            <p className="ant-upload-hint">
                              可点击后选择文件上传，<br></br>也可直接将文件拖至此处上传
                            </p>
                          </Spin>
                        </>



                      </Upload.Dragger>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : ('')}



      </>

    );
  }

}

export default index;
