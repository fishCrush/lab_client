import React, { Component } from 'react';
import { Button, Form, Input, Modal, notification, Card, Avatar, Tooltip } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Header from '../../components/Header';
import { UserOutlined, LockOutlined, PlusOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import AddLabModal from './AddLabModal';
import EditHostModal from './EditHostModal';
import ChangeAdminModal from './ChangeAdminModal';


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "潘伟旋",
      password: "panweixuan82929",
      isStart: true,  // 是否modal为新创建  true:添加实验室  false:修改编辑实验室
      passwordModalVisible: false,
      addLadbModalVisible: false,
      // editHostModalVisible:true,
      editHostModalVisible: false,
      changeAdminModalVisible: false,
      // changeAdminModalVisible:true,

      // 实验室列表
      list: [
        {
          name: "电子信息科学与技术",
          position: "电子楼511",
          host: ['潘伟旋', '小明鸭'],
          remark: ""
        },
        {
          name: "物理研究实验室",
          position: "电子楼511",
          host: ['小鱼', '小明'],
          remark: "校企合作实验室  工作位3人"
        },
        {
          name: "光学影像实验室",
          position: "实验楼314",
          host: [],
          remark: "指导老师是李明明"
        }
      ]
    };
  }


  // 和修改密码相关
  resetFormRef = React.createRef();

  modifyPasswordClick = () => {
    this.setState({
      passwordModalVisible: true,
    });
  }

  passwordModalCancel = e => {
    this.resetFormRef.current.resetFields();
    this.setState({
      passwordModalVisible: false,
    });
  };

  passwordModalOk = () => {
    //发起请求 将新旧密码发送过去
    // 旧密码验证通过，直接将新密码作为新密码（不验证是否重复）：成功
    // modal自动隐藏
    // this.setState({
    //   passwordModalVisible: false,
    // });

    // 旧密码验证不通过:modal不自动隐藏，发出警告
    this.setState({
      passwordModalVisible: false,
    });
    this.resetFormRef.current.resetFields();
    notification.success({
      message: '密码已修改成功',
      duration: 3
    });


  }

  // 和新建实验室相关的
  hideLabModal = () => {
    this.setState({
      addLadbModalVisible: false
    })
  }

  addLabBtnClick = () => {

    this.setState({
      addLadbModalVisible: true,
      isStart: true
    })
  }

  //修改实验室地理信息相关
  labItemPositionModifyClick = () => {
    this.setState({
      addLadbModalVisible: true,
      isStart: false
    })
  }

  // 编辑实验室的管理员
  labItemHostModifyClick = () => {
    this.setState({
      editHostModalVisible: true
    })
  }

  hideEditHostModal = () => {
    this.setState({
      editHostModalVisible: false
    })
  }

  // 移交超管身份
  labItemAdminModifyClick = () => {
    this.setState({
      changeAdminModalVisible: true
    })
  }

  hideChangeAdminModal = () => {
    this.setState({
      changeAdminModalVisible: false
    })
  }



  render() {
    const { username, password, passwordModalVisible, addLadbModalVisible, list, editHostModalVisible, changeAdminModalVisible, isStart } = this.state;
    const initialValues = { username, password };

    return (
      <>
        <Header />


        <div className="settingWraper">
          <div className="settingWrap">
            {/* 用户信息区域 */}
            <div className="userSettingWrap">

              {/* 头部信息 */}
              <div className="userSettingHeader">
                <div className="userSettingHeaderText">账户信息设置</div>
              </div>

              {/* 内容区 */}
              <div className="userContentWrap">
                <Form name="user_form" layout="vertical" initialValues={initialValues}>
                  <div className="userOneLineWrap">
                    <Form.Item
                      required={false}
                      name="username"
                      label="个人名称"
                      colon={false}
                      rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input style={{ width: 348 }} disabled={true}
                        prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                      required={false}
                      name="password"
                      rules={[{ required: true, message: 'Please input your password!' }]}
                      colon={false}
                      label={
                        <span style={{ display: 'flex', justifyContent: "space-between", width: 348 }}>
                          <span>密码</span>
                          <span style={{ color: "rgb(7, 185, 224)", cursor: 'pointer' }} onClick={this.modifyPasswordClick}>
                            重设
                          </span>
                        </span>}
                    >
                      <Input style={{ width: 348 }} disabled={true}
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                      />
                    </Form.Item>
                  </div>

                </Form>
              </div>

            </div>


            {/* 实验室信息区域 */}
            <div className={styles.labInfo}>
              {/* 头部信息 */}
              <div className={styles.labHeader}>
                <div className={styles.labHeaderText}>实验室信息设置</div>
              </div>

              {/* 内容区 */}
              <div className={styles.labContentWrap}>
                <Button
                  type="dashed"
                  onClick={this.addLabBtnClick}
                  style={{ width: '430px', height: '75px' }}
                >
                  <PlusOutlined />
                  <span style={{ fontSize: 18 }}>添加新的管理实验室</span>
                </Button>
                <div className={styles.labCardListWrap}>
                  {
                    list.map((item, index) => {
                      return (
                        <div className={styles.settingPanelLabItemWrap}>
                          <Card
                            style={{ width: 330 }}
                            cover={
                              <>
                                <div className="settingPanelLabListItem"  >
                                  {/* <div className="settingPanelLabItemText" >{item.name}</div> */}
                                </div>
                                <div className="settingPanelLabItemText" >
                                  <p>
                                    {item.name}
                                    {item.remark.length > 0 ? (
                                      <Tooltip placement="top" title={item.remark}>
                                        <MyIcon type="icon-beizhu3" style={{ marginLeft: 3, color: "#1890ff" }} />
                                      </Tooltip>
                                    ) : ('')}

                                  </p>
                                </div>
                              </>

                            }
                            actions={[
                              <div className="labItemModify" onClick={this.labItemPositionModifyClick}><SettingOutlined key="setting" /><div>编辑信息</div></div>,
                              <div className="labItemHostModify" onClick={this.labItemHostModifyClick}><EditOutlined key="edit" /><div>编辑管理员</div></div>,
                              <div className="labItemAdminModify" onClick={this.labItemAdminModifyClick}>
                                {/* <Tooltip placement="right" title="移交超级管理员身份"> */}
                                <EllipsisOutlined key="ellipsis" />
                                <div>移交超管</div>
                                {/* </Tooltip> */}
                              </div>,
                            ]}
                          >
                            <Card.Meta
                              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                              title={<>
                                {item.host.length > 0 ? <span>普通管理员：</span> : ''}
                                {item.host.map(item => <span style={{ marginRight: 7, fontColor: "#303641" }}>{item}</span>)}
                              </>}
                              description={item.position}
                            />
                          </Card>
                        </div>
                      )
                    })
                  }

                </div>
              </div>
            </div>



          </div>




          {/* 修改密码的modal */}
          <div className="resetPasswordModalWrap">
            <Modal
              title="修改密码"
              width={450}
              centered={true}
              visible={passwordModalVisible}
              okText="确认"
              cancelText="取消"
              onOk={this.passwordModalOk}
              onCancel={this.passwordModalCancel}

            >
              <Form name="resetPassword" layout="vertical" ref={this.resetFormRef} >
                <Form.Item name="old" label="原密码"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password placeholder="请输入原密码" />
                </Form.Item>
                <Form.Item name="new" label="新密码"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password placeholder="请输入新的密码" />
                </Form.Item>
                <Form.Item name="confirm" label="验证新密码"
                  rules={[
                    { required: true, message: '请输入密码!' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('new') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('两次输入不同，请重新输入');
                      },
                    })
                  ]}
                >
                  <Input.Password placeholder="请重新输入新的密码进行验证" />
                </Form.Item>
              </Form>
            </Modal>
          </div>

          {/* 添加实验室的Modal */}
          <AddLabModal visible={addLadbModalVisible} isStart={isStart} hideModifyHandle={this.hideLabModal} />


          <EditHostModal visible={editHostModalVisible} hideModifyHandle={this.hideEditHostModal} />
          {/* 编辑实验室管路员的modal */}
          < ChangeAdminModal visible={changeAdminModalVisible} hideModifyHandle={this.hideChangeAdminModal} />


        </div>



      </>

    );
  }

}

export default index;
