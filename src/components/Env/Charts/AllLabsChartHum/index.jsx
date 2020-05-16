import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Switch } from 'antd';
import * as styles from './index.less';
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from 'bizcharts';
import { LabsData } from '../../../../common/constants/mockData';
import {generateRandomDayTemps,generateRandomDayHums} from '../../../../common/utils' 
import { objArrOnePropertyMM } from '../../../../common/utils/index';
import { colors } from '../../../../common/constants/index';
import DiyThemeButton from '../../../DiyThemeButton';
import { formatTimeStr } from 'antd/lib/statistic/utils';




const EXPORT_TEXT_PNG = '导出 PNG 图片';
const EXPORT_TEXT_SVG = '导出 SVG 矢量图';


@inject('ChooseStore', 'EnvStore','UserLabInfoStore')
@observer
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRendererCanvas: true,
            allLabsData: [],
            rendererValue:'canvas'
        }
    }

    onClick = () => {
        // console.log('state ')
        this.chartLabs.downloadImage();
    }

    onSwitchChange = (checked) => {
        this.setState({
            isRendererCanvas: !checked,    
            forceUpdate: true,
            rendererValue: checked ? 'svg':'canvas'
        });
    }

    componentDidMount() {
        console.log('多实验室环境 componenDidMount');
       
        // todo 切换湿度时多实验室数据没有变化  可能是没有重新渲染的原因。
        const _that=this;
        // 处理LabsData的值为：数组（从0时到12时以此排序），成员为小数组(多个实验室同个time的项)
        let timesRun = 0;
        _that.interval = setInterval(() => {
            const{EnvStore}= _that.props;
            const {allLabsData,allLabTimeDataHum}=EnvStore;
            // console.log("定时器里的allLabTimeData",allLabTimeData)
            
            if (timesRun > 23) {  //24个小时，从0时开始逐步到24小时。到23时之后就清除计数器
                clearInterval(_that.interval);
            }
            //  console.log("定时器里的allLabsData",allLabsData);
            const oriData=allLabTimeDataHum;
            const thisHourLabsData = oriData.filter(item=>item.time===`${timesRun}:00`)  //每一个小时多个实验室的数据
            // console.log("thisHourLabsData",thisHourLabsData);
            const newAllLabsData = allLabsData.concat(thisHourLabsData);  //原来的小时加上新增的小时
            // console.log("newAllLabsData", newAllLabsData);
            timesRun = timesRun + 1;
           
            EnvStore.setAllLabsData(newAllLabsData);
        }, 300);
    }

    componentWillUnmount() {
        // console.log("多实验室组件卸载了")
        const{EnvStore}=this.props;
        EnvStore.setAllLabsData([]);
        clearInterval(this.interval); //组件卸载时记得去掉定时器；否则定时器也会继续执行的，哪怕已经切换了组件
    }
    

    render() {
        const { isRendererCanvas, forceUpdate ,rendererValue } = this.state;
        const { EnvStore,UserLabInfoStore } = this.props;
        // const { labsNum } = EnvStore;
        const{allLabsData}=EnvStore;
        const {labHostNames}=UserLabInfoStore;
        let labsNum=labHostNames.length;

        // 给每一个实验室的线安排一个颜色
        let labLineColorList = []
        for (let i = 0; i < labsNum; i++) {
            labLineColorList.push(colors[i]);
        }
       
        const exportText = isRendererCanvas ? EXPORT_TEXT_PNG : EXPORT_TEXT_SVG;
        const unitText="单位：°";

        //定义横轴和纵轴的定义
        const scale = {
            time: {
                alias: "时间",
                tickCount: 24,
                nice: false
            },
            temperature: {
                alias: "湿度(°)",
                min: 40,
                max: 90
            },
            type: {
                type: "cat"
            }
        };

        

        return (
            <>
              <div style={{marginLeft:20}}>{unitText}</div>
                <Chart
                    data={allLabsData}
                    scale={scale}
                    forceFit
                    height={500}
                    forceUpdate={forceUpdate}
                    renderer={rendererValue} // renderer 默认值: canvas,可选值 svg.
                    onGetG2Instance={chartIns => {
                        this.chartLabs = chartIns;
                    }}
                >
                    <Tooltip />
                    {allLabsData.length !== 0 ? 
                    <Axis 

                    /> 
                    : ''}
                    <Legend />
                    <Geom
                        type="line"
                        position="time*temperature"
                        color={["type", labLineColorList]}
                        shape="smooth"
                        size={2}
                    />
                </Chart>
                <div className={styles.btnWrap}>
                    <span className={styles.switchWrap}>
                        <Switch className="large-width" onChange={this.onSwitchChange} />
                        <span className={styles.switchText}>
                            SVG渲染
                        </span>
                    </span>
                    <DiyThemeButton text={exportText} size="large"
                        type="icon-daochutupian1"
                        onClick={this.onClick}
                    />
                </div>
            </>

        );
    }

}


export default index;
