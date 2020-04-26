import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Table, Tag, Popconfirm, message } from 'antd';


import styles from './index.less';
import MyIcon from '../../../../../../components/MyIcon';
import { mapRateShow } from '../../../../../../common/constants/index';
import Modify from './Modify';

const { Column } = Table;

@inject('ChooseStore', 'ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modifyVisible: false,
      //  formData :[
      //   {
      //     name: '校企合作文件22',
      //     num: 23,
      //     tags: ['娱乐', '学院机密'],
      //     rate: "three",
      //     remark: 'New York No. 1 Lake Park',
      //     imgs: ['iiiiiiiiii', 'kkkkkkkkkkkk']
      //   },
      //   {
      //     name: '校企合作文件33',
      //     num: 33,
      //     tags: ['娱乐', '学院机密'],
      //     rate: "three",
      //     remark: 'New York No. 1 Lake Park',
      //     imgs: ['hhhhhh', 'kkssss']
      //   }
      // ],
      columns: [
        {
          title: '物品名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          // defaultSortOrder: 'descend',
          sorter: (a, b) => a.nun - b.num,
        },


        {
          title: '标签',
          dataIndex: 'tags',
          key: 'tags',
          render: tags => (
            <span>
              {tags.map((tag, index) => (
                <Tag color="purple" key={index}>
                  {tag}
                </Tag>
              ))}
            </span>
          )
        },

        {
          title: '图片',
          dataIndex: 'imgs',
          key: 'imgs',
          render: imgs => (
            <span>
              {/* {value}图片
                 */
                imgs.length > 0 ? (
                  <img src={imgs[0]} alt="图片" style={{width:70,height:70}}/>
                ) : (<MyIcon type="icon-kong2" style={{ fontSize: 35 }} />)
              }

            </span>
          )
        },
        {
          title: '重要程度',
          dataIndex: 'rate',
          key: 'rate',
          render: num => (
            <MyIcon type={`${mapRateShow[String(num)]}`} style={{ fontSize: 28, color: '#722ed1a8' }} />
          )
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          render: (text, record, index) => (

            <span>
              <span
                style={{ marginRight: 16, cursor: 'pointer', color: '#bf98e4' }}
                onClick={this.modifyClickHandle}
              >
                点此修改
              </span>
              <Popconfirm
                placement="right"
                title="你确定要删除这一条资源吗？"
                onConfirm={() => this.confirmDelete(index)} okText="确定" cancelText="取消">
                <span style={{ marginRight: 16, cursor: 'pointer' }}>
                  {/* 点此删除 */}
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

  modifyClickHandle=() => {
    this.setState({
      modifyVisible: true
    });
  }

  confirmDelete=index => {
    console.log('删除的序号是：', index);
    // 删除了一条记录
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
      const { thingList } = ThingStore;
      formData = thingList;
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
