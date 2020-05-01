import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button, Select, Spin, Form, DatePicker, message } from 'antd';
import styles from './index.less';
import MyIcon from '../../../../../components/MyIcon';
import locale from 'antd/es/date-picker/locale/zh_CN'; // 为了改变日期选择器的语言
import debounce from 'lodash/debounce';
import SourceTable from './Table';
const { Option } = Select;


@inject('UserLabInfoStore', 'ThingStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.searchName = debounce(this.searchName, 800);
    this.state = {
      nameSelectData: [],
      nameValue: [],
      fetching: false,
      rateSelctOptions: [
        { value: '1', label: (<><MyIcon type="icon-xingxing" /></>) },
        { value: '2', label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
        { value: '3', label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
        { value: '4', label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
        { value: '5', label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
      ],
      // ！name和tag的选择框的选项值需注意，因为不是不固定而是来自接口值得
      // ！处理tag时需转换处理！rate组件的值是number,这里的value是string
      tagSelctOptions: ['娱乐', '工作', '校企合作'],
    };
  }

  // 选择区域
  formRef = React.createRef();

  onReset = () => {
    this.formRef.current.resetFields();
    const { ThingStore } = this.props;
    ThingStore.resetThingList();
  };

  // successChooseSubmit = values => {
  //   console.log('成功');
  // }

  // failChooseSubmit = () => {
  //   console.log('失败');
  // }

  // 导出事件
  exportBtnClick = () => {
    const { UserLabInfoStore } = this.props;
    const { lid } = UserLabInfoStore;

    axios.post('/api/thing/export_info',{
      lid,
    }).then(res => {
      console.log("res",res)
      const {data}=res
      if(data.status_code){
       const jsonData=data.data;

       let str = `物品名称,物品数量,物品标签,物品备注\n`;
       for(let i = 0 ; i < jsonData.length ; i++ ){
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;     
        }
        str+='\n';
      }
      
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);  //encodeURIComponent解决中文乱码
      let link = document.createElement("a");  //通过创建a标签实现
      link.href = uri;
      link.download = `${lid}资源清单.xlsx`;  //对下载的文件进行命名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
       message.success("成功导出excel文件！")
       } else {
         console.log(" 返回excel所需原数据 失败")
       }
      }
    ).catch(error => {
      console.log(error);
    });
    //   axios.post('/api/thing/export_all',{
    //     lid,
    //   }).then(res => {
    //     console.log("res",res)
    //     // const {data}=res
    //     if(res.status){
    //       message.success("成功导出excel文件！")
    //      } else {
    //        console.log(" 导出excel文件 失败")
    //      }
    //     }
    //   ).catch(error => {
    //     console.log(error);
    //   });
    // }

    // const url="/api/thing/export_all"
    // let iframe = document.getElementById('_DOWNLOAD_FILE_');
    // if (iframe) {
    //     iframe.src = url;
    // } else {
    //     iframe = document.createElement('iframe');
    //     iframe.style.display = 'none';
    //     iframe.src = url;
    //     iframe.id = '_DOWNLOAD_FILE_';
    //     document.body.appendChild(iframe);
    // }
    // const jsonData = [
    //   {
    //     name: '路人甲',
    //     phone: '123456789',
    //     email: '000@123456.com'
    //   },
    //   {
    //     name: '炮灰乙',
    //     phone: '123456789',
    //     email: '000@123456.com'
    //   },
    //   {
    //     name: '土匪丙',
    //     phone: '123456789',
    //     email: '000@123456.com'
    //   },
    //   {
    //     name: '流氓丁',
    //     phone: '123456789',
    //     email: '000@123456.com'
    //   },
    // ];
    // let str = `姓名,电话,邮箱\n`;
    //   //增加\t为了不让表格显示科学计数法或者其他格式
    //   for(let i = 0 ; i < jsonData.length ; i++ ){
    //     for(let item in jsonData[i]){
    //         str+=`${jsonData[i][item] + '\t'},`;     
    //     }
    //     str+='\n';
    //   }
    //   //encodeURIComponent解决中文乱码
    //   let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //   //通过创建a标签实现
    //   let link = document.createElement("a");
    //   link.href = uri;
    //   //对下载的文件命名
    //   link.download =  "json数据表.csv";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);

  }




  // 输入值变化时立即监测到
  searchName = value => {
    // console.log('fetching names', value);
    this.setState({
      fetching: true,
      nameValue: '' // !
    });
    const { ThingStore } = this.props;
    if (ThingStore) {
      const { thingList } = ThingStore;
      if (thingList.length > 0) {
        const names = thingList.map(thingItem => thingItem.name).flat(1); // 将所有的thingItem的tags集合起来
        const includeNames = names.filter(name => name.indexOf(value) > -1); // 模糊搜索
        // tagSelctOptions=uniqueTags
        const nameSelectData = includeNames.map(name => ({
          text: name,
          value: name,
        }));
        this.setState({ nameSelectData, fetching: false });
      }
    }
  };

  nameChange = obj => {
    console.log('nameChange', obj);
    this.setState({
      nameValue: obj,
      fetching: false,
      nameSelectData: []
    });
    const { ThingStore } = this.props;
    const { thingList } = ThingStore;
    const newThingList = thingList.filter(item => item.name === obj.value);
    // console.log('newThingList',newThingList);
    ThingStore.setShowingThingList(newThingList);
  };

  okClick=() => {
    console.log('ss', this.formRef.current.getFieldsValue());
    const { num, tag, rate, timeRange } = this.formRef.current.getFieldsValue(); // 注意form字段里的rate的值为数字字符串
    const { ThingStore } = this.props;
    let newThingList = ThingStore.thingList;

    // 处理数量筛选
    if (num !== undefined) {
      switch (num) {
        case 'num1': // 10以下
          newThingList = newThingList.filter(item => {
            if (item.num < 10) {
              return true;
            } else {
              return false;
            }
          });
          break;

        case 'num2': // 10~50
          newThingList = newThingList.filter(item => {
            if (item.num >= 10 && item.num < 50) {
              return true;
            } else {
              return false;
            }
          });
          break;

        case 'num3': // 50-100
          newThingList = newThingList.filter(item => {
            if (item.num >= 50 && item.num <= 100) {
              return true;
            } else {
              return false;
            }
          });
          break;

        case 'num4': // 100以上
          newThingList = newThingList.filter(item => {
            if (item.num > 100) {
              return true;
            } else {
              return false;
            }
          });
          break;

        default:
      }
    }

    // 处理标签筛选
    if (tag !== undefined) {
      newThingList = newThingList.filter(item => item.tags.indexOf(tag) > -1);
    }

    // 处理重要性/星星筛选
    if (rate !== undefined) {
      newThingList = newThingList.filter(item => String(item.rate) === rate);
    }

    // 时间处理筛选
    if (timeRange !== undefined) {
      const startTime = new Date(timeRange[0]._d).getTime();
      const endTime = new Date(timeRange[1]._d).getTime();
      console.log('ahhaha', startTime);
      newThingList = newThingList.filter(item => {
        const itemTime = new Date(item.time).getTime();
        if (itemTime >= startTime && itemTime <= endTime) {
          return true;
        } else {
          return false;
        }
      });
    }
    ThingStore.setShowingThingList(newThingList);
  }
  // nameFocus=()=>{
  //   this.setState({})
  // }

  render() {
    let tagSelctOptions = [];
    const { ThingStore } = this.props;
    if (ThingStore) {
      const { thingList } = ThingStore;
      if (thingList.length > 0) {
        const tags = thingList.map(thingItem => thingItem.tags).flat(1); // 将所有的thingItem的tags集合起来
        const uniqueTags = Array.from(new Set(tags)); // 去重
        tagSelctOptions = uniqueTags;
      }
    }

    const { fetching, nameSelectData, nameValue, rateSelctOptions } = this.state;
    const selectLineTwoSize = 'large';
    return (

      <div className="ListWrap">
        <Form
          name="chooseForm"
          ref={this.formRef}
          // onFinish={this.successChooseSubmit} // 提交表单且数据验证成功后回调事件
          // onFinishFailed={this.failChooseSubmit} // 提交表单且数据验证失败后回调事件
        >
          <div className="chooseWrap">
            {/* 选择项的第一行 */}
            <div className="chooseLineOne">
              <Form.Item className="chooseNameFormItem" name="quickSearch">
                <Select
                  // mode="multiple"
                  showSearch
                  // onFocus={this.nameFocus}
                  labelInValue
                  value={nameValue}
                  placeholder="搜索物品名称...支持模糊搜索"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.searchName}
                  onChange={this.nameChange}
                  // style={{ width: 350,height:50 }}
                  showArrow={true} // 不设这个属性为true的话，自定义的后缀图标是不会生效的
                  suffixIcon={<><MyIcon type="icon-sousuo" style={{ fontSize: 14, lineHeight: 14 }} /></>}
                >
                  {nameSelectData.map(d => (
                    <Option key={d.value}>{d.text}</Option>
                  ))}
                </Select>
              </Form.Item>
              <div className="listExportWrap">
                <Button
                  type="primary"
                  className={`${styles.addBtn} `}
                  style={{ borderRadius: '4px' }}
                  onClick={this.exportBtnClick}
                  size="middle"
                >
                  <MyIcon type="icon-excel1" style={{ color: '#fff', fontSize: 20 }} />
                  导出全部物品
                </Button>
              </div>

            </div>

            {/* 选择项的第二行 */}
            <div className="chooseLineTwo">
              <div className={'chooseLineTwoSelect'}>
                <Form.Item name="num">
                  <Select
                    showSearch
                    size={selectLineTwoSize}
                    placeholder="选择数量"
                    optionFilterProp="children" // 搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索
                    // onChange={onChange}
                    // onFocus={onFocus}
                    // onBlur={onBlur}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } // 符合筛选条件时，应返回 true
                  >
                    <Option value="num1">10以下</Option>
                    <Option value="num2">10~50</Option>
                    <Option value="num3">50-100</Option>
                    <Option value="num4">100以上</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={'chooseLineTwoSelect'}>
                <Form.Item name="tag">
                  <Select
                    showSearch
                    size={selectLineTwoSize}
                    placeholder="选择标签"
                    // labelInValue={true}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >

                    {tagSelctOptions.map((option, index) => (
                      <Option key={index} value={option}>{option}</Option>
                    ))
                    }
                  </Select>
                </Form.Item>
              </div>

              <div className={'chooseLineTwoSelect'}>
                <Form.Item name="rate">
                  <Select
                    showSearch
                    size={selectLineTwoSize}
                    placeholder="选择重要性"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {rateSelctOptions.map((option, index) => (
                      <Option key={index} value={option.value}>{option.label}</Option>
                    ))
                    }
                  </Select>
                </Form.Item>
              </div>

              {/* 时间选择 */}
              <Form.Item name="timeRange">
                <DatePicker.RangePicker locale={locale} size={selectLineTwoSize} />
              </Form.Item>

              {/* 右侧两个按钮区 */}
              <div className="listChooseBtnWrap">
                <Button
                  onClick={this.onReset}
                  size={selectLineTwoSize}
                  className="chooseResetBtn"
                  style={{ boxShadow: '0 1px 18px 1px rgba(69,65,78,.07)', borderRadius: 5 }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={this.okClick}
                  className="chooseOkBtn"
                  size={selectLineTwoSize}
                >
                  搜索
                </Button>
              </div>
            </div>




          </div>



          {/* 表格 */}
          <div className="listForm">
            <SourceTable />
          </div>
        </Form>



      </div>

    );
  }

}

export default index;
