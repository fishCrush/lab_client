import React, { Component } from 'react';
import { Button, Timeline, ClockCircleOutlined, Popover, Table } from 'antd';
import styles from './index.less';
import MyIcon from '../../../../components/MyIcon';
import LabIntro from './LabIntro';
import { historyActionMapColor, historyActionMapChinese } from '../../../../common/constants/index';

const columns = [
  {
    title: '变化的属性',
    dataIndex: 'attri',
  },
  {
    title: '新值',
    dataIndex: 'new',
  },
  {
    title: '旧值',
    dataIndex: 'old',
  },
];



class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // list需先处理成这样   最好服务端的数据表也是这样的形式的
      list: [
        { time: '2015-09-01 09:12:12', action: "modify", host: '小明', thing: "示波器", change: [{attri:"num",old:'23',new:'33'},{attri:"tags",old:'呵呵',new:'哈哈'}]},
        { time: '2015-09-01 09:12:12', action: "add", host: '小明', thing: "电子几件" },
        { time: '2015-09-01 09:12:11', action: "delete", host: "小红", thing: '点播器',  },
        { time: '2015-09-01 09:12:10', action: 'modify', host: "小雨", thing: "黑板檫", change: [{attri:"num",old:'55',new:'66'}]},
        { time: '2015-09-01 09:12:12', action: "add", host: '潘伟旋', thing: "示波器", },
        { time: '2015-09-01 09:12:12', action: "add", host: '小明', thing: "鼠标", },
      ]
    };
  }

  render() {
    const { list } = this.state;

    // 处理list
    // 抽离出“操作为修改”的数组
    const changeList=list.filter(item=>{
      return item.action==="modify"
    })
    console.log("changeList",changeList)

    // 将修改数组转换为映射的对象
    const mapObj={};
    changeList.forEach((item,index)=>{
      const keyName=item.thing;
      mapObj[keyName]=item.change;
    })
    console.log("mapObj",mapObj);

    // 给change数组里的每一个成员(对象)添加属性key
    for(let key in mapObj){
      const changeArr=mapObj[key];
      const newChangeArr=[];
      changeArr.map(((item,index)=>{
        // item["key"]=index
        return newChangeArr.push(Object.assign({},item,{key:index}))
      }))
      mapObj[key]=newChangeArr
    }
    console.log('new mapobj',mapObj);
    
    return (

      <div className={styles.historyPanel}>
        <LabIntro />

        <div className={styles.timeLineWrap}>
          <Timeline
            // mode="alternate"
            mode="left"
          >
            {
              list.map((item, index) => {
                return (
                  // 注意：Timeline.Item 需是Timeline的直接子组件
                  <Timeline.Item label={item.time}  key={index}
                    color={historyActionMapColor[item.action]}
                  >
                    <span className={styles.textWrap}>
                      <span className={styles.thingWrap}>
                        <MyIcon type="icon-kuanchuangyidianzishangwutubiaoshiliangsucai--" style={{ fontSize: 33 }} />
                        {item.thing}
                      </span>

                      <span style={{ color: historyActionMapColor[item.action] }} className={styles.actionWrap}>
                        {item.action === 'modify' ? (
                          <span className={styles.modifyWrap}>
                            {historyActionMapChinese[item.action]}
                            
                            <Popover title={null}
                              content={<span>
                                <Table columns={columns} dataSource={mapObj[item.thing]} size="small" pagination={false} />
                              </span>}
                            >

                              <MyIcon type="icon-zhuyi4" />
                            </Popover>
                          </span>
                        )
                          : (<>  {historyActionMapChinese[item.action]} </>)
                        }
                      </span>

                      <span className={styles.hostWrap} >
                        <MyIcon type="icon-caozuoren" style={{ marginRight: 3 }} />
                        <span className={styles.hostText}>{item.host}</span>
                      </span>
                    </span>
                  </Timeline.Item>
                )
              })
            }
          </Timeline>
        </div>
      </div>

    );
  }

}

export default index;
