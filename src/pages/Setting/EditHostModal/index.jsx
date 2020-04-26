import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Modal, Form, Input, InputNumber, Tooltip, Rate, Tag, Transfer,notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon';
import locale from 'antd/es/date-picker/locale/zh_CN';


@inject('UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // host:['小明'],
      users: [],
      // 删除管理员标签处
      selectedTags: [],
      // 添加管理员穿梭框
      selectedKeys: [],
      targetKeys: [],

    };
  }


  tagChangeHandle(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });
  }

  filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1;

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({
      targetKeys: nextTargetKeys
    });
    const { UserLabInfoStore } = this.props;
    UserLabInfoStore.setTransferTargetKeys(nextTargetKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  // Form相关
  onCancel = e => {
    e.stopPropagation();
    this.props.hideModifyHandle();
  };


  okClick = e => {
    e.stopPropagation();
    const { selectedTags, targetKeys } = this.state;//前者删除 后者增加
    // console.log('selectedTags,targetKeys', selectedTags, targetKeys);


    if(selectedTags.length){  //删除管理者
      const {UserLabInfoStore}=this.props;
      const lid=UserLabInfoStore.choosedCardLabInfo.name;
      const originUname=UserLabInfoStore.userInfo.name

      axios.post('/api/lab/delete_host',{
        unames:selectedTags,
        lid,
        originUname
      }).then(res => {
        const {data}=res
        if(data.status_code){
          notification.success({
            message: '成功删除',
            duration: 3
          });
         } else {
           console.log("删除管理者 失败")
         }
        }
      ).catch(error => {
        console.log(error);
      });
    }
  
    // 请求接口
    if(targetKeys.length){   //增加管理者
      const {UserLabInfoStore}=this.props;
      const lid=UserLabInfoStore.choosedCardLabInfo.name;
      // console.log("UserLabInfoStore.userInfo",UserLabInfoStore.userInfo)
      const originUname=UserLabInfoStore.userInfo.name
      axios.post('/api/lab/add_host',{
        unames:targetKeys,
        lid,
        originUname
      }).then(res => {
        const {data}=res
        if(data.status_code){
          notification.success({
            message: '成功增加',
            duration: 3
          });
         } else {
           console.log("增加管理者 失败")
         }
        }
      ).catch(error => {
        console.log(error);
      });
    }

    // 并隐藏 修改modal
    this.props.hideModifyHandle();
    setTimeout(() => {
      window.location.reload();  // 刷新页面
    }, 800);                    //设0.8秒让接口请求完

  }

  componentDidMount() {
  }


  render() {
    // let oldHosts=["hahha","hhhh"]
    let oldHosts = [];
    let users = [];
    // console.log('编辑管理员渲染');
    const { UserLabInfoStore } = this.props;
    if (UserLabInfoStore) {
      const { usersName, userInfo } = UserLabInfoStore;
      // 处理原管理员数据
      const oldHostList = UserLabInfoStore.choosedCardLabInfo ? UserLabInfoStore.choosedCardLabInfo.host : [];
      oldHosts = userInfo ? oldHostList.filter(item => item !== userInfo.name):[]; // 除去当前用户

      // 处理可选的其他用户
      const usersMix = usersName.filter(item => item !== userInfo.name); // 可选人员里先除去当前用户
      users = usersMix.filter(item=>oldHosts.indexOf(item)<0)  //然后去掉已是管理员的用户
      // console.log("targetKeys",targetKeys)
    }

    const { selectedKeys, targetKeys, selectedTags } = this.state;
    const dataSource = [];
    users.forEach((user, index) => {
      let itemPbj = {};
      // 注意此处的key就是各项区分的唯一标志，不是简单用index
      itemPbj.key = user;
      itemPbj.title = user;
      itemPbj.description = user;
      dataSource.push(itemPbj); // dataSource是所有注册者的列表
    });
    // console.log("dataSource",dataSource);
    const { visible } = this.props;
    return (
      <>
        {visible ? (
          <div className="editHostModalWrap">
            <div className="editHostModalWraper">
              <div className="modifyModalMask">
                <div className="modifyModalContent">
                  <div className="modifyModalTitleWrap">
                    <MyIcon type="icon-shiyanshiguanlixitong_huaban" style={{ fontSize: 25, marginRight: 12 }} />
                    <span className="modifyModalTitleText">编辑管理员</span>
                  </div>
                  {/* 删除原有的管理员 区域*/}
                  {
                    oldHosts.length > 0 ? (
                      <div className="oldHostWrap">
                        <div className="tagsTitleWrap">删除原有的管理员<span className="tip">可点击进行选择</span></div>
                        {oldHosts.map(tag => (
                          <Tag.CheckableTag
                            key={tag}
                            checked={selectedTags.indexOf(tag) > -1}
                            onChange={checked => this.tagChangeHandle(tag, checked)}
                          >
                            <span style={{ fontSize: 20 }}>{tag}</span>
                          </Tag.CheckableTag>
                        ))}

                      </div>
                    ) : ('')
                  }

                  {/* 添加新管理员 */}
                  <div className="modifyModalFormWrap">
                    <div className="addTitle">增加新的管理员</div>
                    <div className="modifyModalFormLayWrap">
                      <Transfer
                        showSearch
                        locale={{ itemUnit: '项', itemsUnit: '项', searchPlaceholder: '可搜索用户名称' }}
                        titles={[<span style={{ color: 'rgb(7, 185, 224)' }}>其他用户</span>, <span style={{ color: '#b37feb' }}>新增加管理员</span>]}
                        dataSource={dataSource}
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        filterOption={this.filterOption}
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange}
                        render={item => item.title}
                      />
                    </div>

                    {/* 底部按钮区*/}
                    <div className="modifyModalBottomWrap">
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
