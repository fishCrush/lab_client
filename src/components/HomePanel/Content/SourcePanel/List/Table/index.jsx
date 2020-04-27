import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Table, Tag, Popconfirm, message, Popover } from 'antd';
import Zmage from 'react-zmage';

import styles from './index.less';
import MyIcon from '../../../../../../components/MyIcon';
import { mapRateShow } from '../../../../../../common/constants/index';
import Modify from './Modify';

const { Column } = Table;

@inject('ChooseStore', 'ThingStore','UserLabInfoStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modifyVisible: false,
      columns: [
        {
          title: <span className="headerText">物品名称</span>,
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: <span className="headerText">数量</span>,
          dataIndex: 'num',
          key: 'num',
          // defaultSortOrder: 'descend',
          sorter: (a, b) => a.nun - b.num,
        },


        {
          title: <span className="headerText">标签</span>,
          dataIndex: 'tags',
          key: 'tags',
          render: tags => (
            <span>
              {
                tags.length > 0 ? (
                  <>
                  {tags.map((tag, index) => (
                    <Tag color="purple" key={index}>
                      {tag}
                    </Tag>
                    ))
                  }
                  </>
                  ):('')
              }
            </span>
          )
        },

        {
          // title: '图片(点击可放大查看)',
          title: <><span className="headerText">图片</span><span style={{ color: '#808080c4', fontSize: 14, marginLeft: 3 }}>(点击可放大查看)</span></>,
          dataIndex: 'imgs',
          key: 'imgs',
          width: 200,
          render: imgs => (
            <span>
              {
                imgs && imgs.length > 0 ? (
                  <>  
                    <Zmage src={imgs[0]} alt="图片" style={{ width: 70, height: 70 }} /> 

                    {imgs.length > 1 ? (
                      <>
                        <Popover
                          title="图片" trigger="click"
                          content={(  //省略号里的图片；除去第一张图片的剩余图片
                            <>
                              {imgs.slice(1).map((img, index) => (
                                <span key={index}><Zmage src={img} alt="图片" style={{width:70,height:70}}/> </span>
                              ))}
                            </>
                          )}
                        >
                          <span style={{ marginLeft: 15, fontSize: 24, cursor: 'pointer' }}>
                            ...
                          </span>
                        </Popover>
                      </>
                    ) : ('')
                    }
                  </>
                ) : (<MyIcon type="icon-kong2" style={{ fontSize: 35 }} />)
              }
            </span>
          )
        },
        {
          title: <span className="headerText">重要程度</span>,
          dataIndex: 'rate',
          key: 'rate',
          render: num => (
            <MyIcon type={`${mapRateShow[String(num)]}`} style={{ fontSize: 28, color: '#722ed1a8' }} />
          )
        },
        {
          title: <span className="headerText">操作</span>,
          key: 'action',
          dataIndex: 'action',
          render: (actionObj) => (

            <span>
              <span
                style={{ marginRight: 16, cursor: 'pointer', color: '#bf98e4' }}
                onClick={()=>this.modifyClickHandle(actionObj.thingid)}
              >
                点此修改
              </span>
              <Popconfirm
                placement="right"
                title="你确定要删除这一条资源吗？"
                onConfirm={() => this.confirmDelete(actionObj)} okText="确定" cancelText="取消">
                <span style={{ marginRight: 16, cursor: 'pointer' }}>
                  <MyIcon type="icon-lajitong5" style={{ fontSize: 16 }} />
                </span>
              </Popconfirm>
            </span>
          )
        }
      ]

    };
  }

  formChange=(pagination, filters, sorter, extra) => {
    console.log('formchange params', pagination, filters, sorter, extra);
  }

  modifyClickHandle=(thingid) => {
    const {ThingStore}=this.props;
    // console.log("modifyClickHandle thingid",thingid)
    // ThingStore.setModifyThingid(thingid)
    ThingStore.setModifyThingObj(thingid)
    this.setState({
      modifyVisible: true
    });
  }

  // 删除物品
  confirmDelete=actionObj => {
    // console.log('删除的thingid：', thingid);
    const {name,thingid}=actionObj;
    const{UserLabInfoStore}=this.props
    const {uname,lid}=UserLabInfoStore;
    // 请求接口
    axios.post('/api/thing/delete', {
      uname,lid,name,thingid
    }).then(res => {
    const {data}=res
    if(data.status_code){
      message.success("删除成功");

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

  hideModify=() => {
    this.setState({
      modifyVisible: false
    });
  }

  componentDidMount() {

  }


  render() {
    console.log('table组件渲染');
    // 小心注意转换rate的数字与字符串  1与“1”  //选择框里的几个星星值是数字字符串，注意！接口返回的原生值是数字
    const { columns } = this.state;
    let formData = [];
    const { ThingStore } = this.props;
    // ThingStore
    if (ThingStore) {
      const { showingThingList } = ThingStore;
      formData = showingThingList;
    }

    console.log('赋值给table的数值', formData);
    return (

      <div className="sourceTableWrap">
        <Table
          dataSource={formData}
          columns={columns}
          // pagination={{ position: ["bottomCenter"] }}
          pagination={false}
          onChange={this.formChange}
        />
        <Modify visible={this.state.modifyVisible} hideModifyHandle={this.hideModify} />
      </div>



    );
  }

}

export default index;
