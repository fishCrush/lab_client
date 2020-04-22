import React, { Component } from 'react';
import { Button, InputNumber, Radio, DatePicker, Switch, message, Tooltip, Tabs } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { inject, observer } from 'mobx-react';

// import { Line } from '@antv/g2plot';
// import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import EnvNav from './EnvNav';
// import { graphData } from '../../common/constants/mockData';
import TempChart from './Charts/TempChart';
import AllLabsChart from './Charts/AllLabsChart';
import ThingChart from './Charts/ThingChart';

@inject('ChooseStore', 'EnvStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oneLabNavValue: "date",
      isMMChecked: false,
      max: 100,
      min: 0,
    };
  }


  oneLabNavValueChange = (e) => {
    this.setState({
      oneLabNavValue: e.target.value,
    })
  }


  // 日期变动
  dateChange = (date, dateString) => {
    console.log("date,dateString", date, dateString);
    const { EnvStore } = this.props;
    EnvStore.changeDate(date, dateString);
  }

  // 温度范围选择  最低温 最高温
  minInputChange = (value) => {
    console.log("minInputChange:", value)
    // this.setState({
    //   min: value
    // })
    const { EnvStore } = this.props;
    EnvStore.changeMinTemp(value);
  }

  minPress = (e) => {
    if (isNaN(e.target.value)) {
      message.warning('请重新输入纯数字');
      return false;
    }
    console.log('minPress e.target.value:', e.target.value);
    const { EnvStore } = this.props;
    EnvStore.changeMinTemp(e.target.value);
  }

  maxInputChange = (value) => {
    if (isNaN(value)) {
      message.warning('请重新输入纯数字');
      return false;
    }
    console.log("maxInputChange:", value)
    const { EnvStore } = this.props;
    EnvStore.changeMaxTemp(value);
  }

  maxPress = (e) => {
    if (isNaN(e.target.value)) {
      message.warning('请重新输入纯数字');
      return false;
    }
    console.log('maxPress e.target.value:', e.target.value);
    const { EnvStore } = this.props;
    EnvStore.changeMaxTemp(e.target.value);
  }

  // 是否显示最大值，最小值 
  isMMchange = (checked) => {
    const { EnvStore } = this.props;
    EnvStore.isMMchange(checked);
  }

  render() {
    const { ChooseStore } = this.props;
    const { envNavSelectedIndex } = ChooseStore;
    return (

      <div className={styles.envWrap}>


        <div className={styles.envNavWrap}>
          < EnvNav />
        </div>

        {envNavSelectedIndex === 0 ? (
          <div className={styles.oneLabNavWrap}>
            <span className={styles.datePickerWrap}>
              <DatePicker onChange={this.dateChange} locale={locale} />
            </span>

            <span className={styles.rangeWrap}>
              <span>
                <span style={{ color: '#6a56a5' }}>高亮显示</span>
              可某一段温度范围的：
              </span>
              <span className={styles.minInputWrap}>
                <span className={styles.mmLabel}>下限</span>
                <Tooltip title="按下Entry键时确认">
                  <InputNumber
                    min={0}
                    max={100}
                    step={0.5}
                    onChange={this.minInputChange}
                    onPressEnter={this.minPress}
                  />
                </Tooltip>
                <span>℃</span>
              </span>
              <span className={styles.rangeSymbol}>~</span>
              <span className={styles.maxInputWrap}>
                <span className={styles.mmLabel}>上限</span>
                <Tooltip title="按下Entry键时确认">
                  <InputNumber
                    min={0}
                    max={100}
                    step={0.5}
                    onChange={this.maxInputChange}
                    onPressEnter={this.maxPress}
                  />
                </Tooltip>
                <span>℃</span>
              </span>
            </span>

            <span className={styles.mmWrap}>
              <Switch defaultChecked onChange={this.isMMchange} />
              <span className={styles.mmText}>
                <span style={{ color: "red" }}>红色显示</span>
                最高温度和最低温度
              </span>
            </span>
          </div>
        ) : ('')}

        <div className={styles.envShowWrap}>
          {/* <ThingChart/> */}
          {envNavSelectedIndex === 0 ? (<TempChart />) : ('')}
          {envNavSelectedIndex === 2 ? (<AllLabsChart />) : ('')}
        </div>
      </div>

    );
  }
}



export default index;
