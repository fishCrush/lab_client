import React, { Component } from 'react';
import { Button, Select, Spin, Form, DatePicker } from 'antd';
import styles from './index.less';
import MyIcon from '../../../../../components/MyIcon';
import locale from 'antd/es/date-picker/locale/zh_CN'; // 为了改变日期选择器的语言
import debounce from 'lodash/debounce';
import SourceTable from './Table';
const { Option } = Select;

class index extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchNames = debounce(this.fetchNames, 800);
    this.state = {
      nameSelectData: [],
      nameValue: [],
      fetching: false,
      rateSelctOptions: [
        { value: "one", label: (<><MyIcon type="icon-xingxing" /></>) },
        { value: "two", label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
        { value: "three", label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
        { value: "four", label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
        { value: "five", label: (<><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /><MyIcon type="icon-xingxing" /></>) },
      ],
      // ！name和tag的选择框的选项值需注意，因为不是不固定而是来自接口值得
      // ！处理tag时需转换处理！rate组件的值是number,这里的value是string
      tagSelctOptions: ["娱乐", "工作", "校企合作"],
    };
  }

  // 选择区域
  formRef = React.createRef();

  onReset = () => {
    this.formRef.current.resetFields();
    // 需对标签和图片单独处理
  };

  successChooseSubmit = (values) => {
    console.log('成功');
  }

  failChooseSubmit = () => {
    console.log('失败');
  }
  // 导出事件
  exportBtnClick = () => {
    //导出
    
  }
  // 和名称选择输入框有关
  fetchNames = value => {
    console.log('fetching names', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ nameSelectData: [], fetching: true });
    // todo请求接口需改
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const nameSelectData = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ nameSelectData, fetching: false });
      });
  };

  nameChange = value => {
    this.setState({
      nameValue: value,
      nameSelectData: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, nameSelectData, nameValue, tagSelctOptions, rateSelctOptions } = this.state;
    const selectLineTwoSize = "large";
    return (

      <div className="ListWrap">
        <Form
          name="chooseForm"
          ref={this.formRef}
          onFinish={this.successChooseSubmit} //提交表单且数据验证成功后回调事件
          onFinishFailed={this.failChooseSubmit}  //提交表单且数据验证失败后回调事件
        >
          <div className="chooseWrap">
            {/* 选择项的第一行 */}
            <div className="chooseLineOne">
              <Form.Item className="chooseNameFormItem" name="name">
                <Select
                  mode="multiple"
                  labelInValue
                  value={nameValue}
                  placeholder="搜索物品名称...支持模糊搜索"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchNames}
                  onChange={this.nameChange}
                  // style={{ width: 350,height:50 }}
                  showArrow={true}  // 不设这个属性为true的话，自定义的后缀图标是不会生效的
                  suffixIcon={<><MyIcon type="icon-sousuo" style={{ fontSize: 14 }} /></>}
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
                  style={{ borderRadius: "4px", }}
                  onClick={this.exportBtnClick}
                  size="middle"
                >
                  <MyIcon type="icon-daochuwenjian-" style={{ color: "#fff", fontSize: 15 }} />
                导出全部物品
              </Button>
              </div>

            </div>

            {/* 选择项的第二行 */}
            <div className="chooseLineTwo">
              <div className={`chooseLineTwoSelect`}>
                <Form.Item name="num">
                  <Select
                    showSearch
                    size={selectLineTwoSize}
                    placeholder="选择数量"
                    optionFilterProp="children"  //搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索
                    // onChange={onChange}
                    // onFocus={onFocus}
                    // onBlur={onBlur}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }  // 符合筛选条件时，应返回 true
                  >
                    <Option value="num1">10以下</Option>
                    <Option value="num2">10~50</Option>
                    <Option value="num3">50-100</Option>
                    <Option value="num4">100以上</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={`chooseLineTwoSelect`}>
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

                    {tagSelctOptions.map((option, index) => {
                      return (
                        <Option key={index} value={option}>{option}</Option>
                      )
                    })
                    }
                  </Select>
                </Form.Item>
              </div>

              <div className={`chooseLineTwoSelect`}>
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
                    {rateSelctOptions.map((option, index) => {
                      return (
                        <Option key={index} value={option.value}>{option.label}</Option>
                      )
                    })
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
                  style={{ boxShadow: "0 1px 18px 1px rgba(69,65,78,.07)", borderRadius: 5 }}
                >
                  重置
                  </Button>
                <Button
                  type="primary"
                  onClick={this.onSubmit}
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
            < SourceTable />
          </div>
        </Form>



      </div>

    );
  }

}

export default index;
