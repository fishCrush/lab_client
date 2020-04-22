import React, { Component } from 'react';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Rate, Tag, Transfer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import locale from 'antd/es/date-picker/locale/zh_CN';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // host:['小明'],
      users:[ "小明", "小红" ,"小鱼",'hh'],
      selectedKeys:[],
      // targetKeys需要在初始化的时候进行赋值的
      targetKeys:[]
    };
  }



  // 获取到这个表单实例
  modalFormRef = React.createRef();
  
  
  filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
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
    // 应通过form实例的getFieldsValue获取到字段值（然后进行处理，再进行ajax将数据发送出去

    // 并隐藏 修改modal
    // this.props.hideModifyHandle();

  }


  render() {
    // dataSource是所有注册者的列表
    const { initialValues,users,host,targetKeys,selectedKeys} = this.state;
    const dataSource =[];
    users.forEach((user,index)=>{
      let itemPbj={};
      //注意此处的key就是各项区分的唯一标志，不是简单用index
      itemPbj.key=user;
      itemPbj.title=user;
      itemPbj.description=user;
      dataSource.push(itemPbj);
    })
    // console.log("dataSource",dataSource);

    // const targetKeys=host;
    // console.log("targetKeys",targetKeys);


    // const validateMessages = {};
    const { visible } = this.props;
    // const visible = true;

    return (
      <>
        {visible ? (
          <div className="editHostModalWrap">
            <div className="editHostModalWraper">
              <div className="modifyModalMask"  >
                <div className="modifyModalContent" >
                  <div className="modifyModalTitleWrap">
                    <MyIcon type="icon-shiyanshiguanlixitong_huaban" style={{ fontSize: 25, marginRight: 12 }} />
                    <span className="modifyModalTitleText">编辑管理员</span>
                  </div>

                  <div className="modifyModalFormWrap">
                    <div className="modifyModalFormLayWrap">
                      <Form
                        name="modifyForm"
                        size="middle"
                        onFinish={this.successHandle}
                        onFinishFailed={this.failHandle}
                        colon={false}
                        layout="vertical"
                        initialValues={initialValues}
                        ref={this.modalFormRef}
                      >
                        <Form.Item name="host"  >
                          <Transfer
                            showSearch
                            locale={{ itemUnit: '项', itemsUnit: '项', searchPlaceholder: '可搜索用户名称' }}
                            titles={[<span style={{color:'rgb(7, 185, 224)'}}>所有用户名称</span>, <span style={{color:'#b37feb'}}>已有管理员</span>]}
                            dataSource={dataSource}
                            targetKeys={targetKeys}
                            selectedKeys={selectedKeys}
                            filterOption={this.filterOption}
                            onChange={this.handleChange}
                            onSelectChange={this.handleSelectChange}
                            render={item => item.title}
                          />
                        </Form.Item>
                      </Form>
                    </div>

                    {/* 底部按钮区*/}
                    <div className="modifyModalBottomWrap">
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
