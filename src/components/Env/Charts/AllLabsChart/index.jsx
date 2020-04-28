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
import { objArrOnePropertyMM } from '../../../../common/utils/index';
import { colors } from '../../../../common/constants/index';
import DiyThemeButton from '../../../DiyThemeButton';
import { formatTimeStr } from 'antd/lib/statistic/utils';


const EXPORT_TEXT_PNG = '导出 PNG 图片';
const EXPORT_TEXT_SVG = '导出 SVG 矢量图';

const scale = {
    time: {
        alias: "时间",
        type: "time",
        mask: "MM:ss",
        tickCount: 10,
        nice: false
    },
    temperature: {
        alias: "平均温度(°C)",
        min: 10,
        max: 35
    },
    type: {
        type: "cat"
    }
};

@inject('ChooseStore', 'EnvStore')
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
        console.log('state ')
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

        // 处理LabsData的值为：数组（从0时到12时以此排序），成员为小数组(多个实验室同个time的项)
        let timesRun = 0;
        let interval = setInterval(() => {
            timesRun = timesRun + 2;
            if (timesRun > 8) {
                clearInterval(interval);
            }
            // var now = new Date(); //new Date().getTime() 可得到数据类似：1587105550445
            // var time = now.getTime();
            // let thisHourLabsData = [];// 这个时间的数组，成员类似：{ time: 1587105550445, temperature: 22, type: "电力电子实验室" },
            // const newAllLabsData = allLabsData.concat(thisHourLabsData);
            // console.log('newAllLabsData', newAllLabsData);
            const { allLabsData } = this.state;
            // console.log('allLabsData  component', allLabsData);

            // console.log("两项：", LabsData[timesRun], LabsData[timesRun + 1]);
            const thisHourLabsData = [].concat(LabsData[timesRun]).concat(LabsData[timesRun + 1]);

            const newAllLabsData = allLabsData.concat(thisHourLabsData);
            // console.log("newAllLabsData", newAllLabsData);


            this.setState({
                allLabsData: newAllLabsData
            });


        }, 1000);
    }

    render() {
        const { allLabsData,isRendererCanvas, forceUpdate ,rendererValue } = this.state;
        console.log("isRendererCanvas",isRendererCanvas);
        console.log("allLabsData  render", allLabsData);
        const { EnvStore } = this.props;
        const { labsNum } = EnvStore;

        // 给每一个实验室的线安排一个颜色
        let labLineColorList = []
        for (let i = 0; i < labsNum; i++) {
            labLineColorList.push(colors[i]);
        }
        // console.log("labLineColorList",labLineColorList);
        // const rendererValue = isRendererCanvas ? 'canvas' : 'svg';
        console.log("render  rendererValue",rendererValue);
        const exportText = isRendererCanvas ? EXPORT_TEXT_PNG : EXPORT_TEXT_SVG;

        return (
            <>
                <Chart
                    data={allLabsData}
                    scale={scale}
                    forceFit
                    forceUpdate={forceUpdate}
                    renderer={rendererValue} // renderer 默认值: canvas,可选值 svg.
                    onGetG2Instance={chartIns => {
                        this.chartLabs = chartIns;
                    }}
                >
                    <Tooltip />
                    {allLabsData.length !== 0 ? <Axis /> : ''}
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
