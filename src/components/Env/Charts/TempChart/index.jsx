import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Switch } from 'antd';
import * as styles from './index.less';
import { Chart, Geom, Axis, Tooltip, View } from 'bizcharts';

import {generateRandomDayTemps,generateRandomDayHums} from '../../../../common/utils' 
import { objArrOnePropertyMM } from '../../../../common/utils/index';
import DiyThemeButton from '../../../DiyThemeButton';

const EXPORT_TEXT_PNG = '导出 PNG 图片';
const EXPORT_TEXT_SVG = '导出 SVG 矢量图';

@inject('ChooseStore', 'EnvStore')
@observer
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRendererCanvas: true
        }
    }

    onClick = () => {
        this.chartIns.downloadImage();
    }

    onSwitchChange = (checked) => {
        this.setState({
            isRendererCanvas: !checked,    
            forceUpdate: true
        });
    }
    componentWillUnmount() {
        // console.log("temp面板卸载");
        const {EnvStore}=this.props;
        EnvStore.initSelect();   //组件卸载时还原筛选图表的条件为初始化
    }

    render() {
        // console.log("单线图表渲染");
        let data=[];
        const {  isRendererCanvas, forceUpdate } = this.state;
        const { EnvStore } = this.props;
        const { showType,tempSelectMin, tempSelectMax, isMM,dayTemps,dayHums} = EnvStore;

        const isTemp= showType==='temp';
        const originData=isTemp?dayTemps:dayHums;
        // console.log("dayTemps",dayTemps);
        //将原温度数据 处理成表格需要的数据格式
        data=originData.map((temp,index)=>{
            let tempObj={};
            tempObj["date"]=`${index}:00`;
            tempObj["count"]=temp;
            return tempObj;
        })
        // console.log("data",data);

        let alertLine=[];
        // 处理范围内的线
        const minVal = data.length?objArrOnePropertyMM(data, "count", "min"):'';
        const maxVal = data.length?objArrOnePropertyMM(data, "count", "max"):'';
        const noMinWithMax = (tempSelectMin === 'init' && tempSelectMax !== 'init');
        const withMinNoMax = (tempSelectMin !== 'init' && tempSelectMax === 'init');
        const withMinwithMax = (tempSelectMin !== 'init' && tempSelectMax !== 'init');

        alertLine = [...data].map((item) => {
            if (tempSelectMin !== 'init' && tempSelectMax !== 'init') { // 有上下限
                if (item.count >= tempSelectMin && item.count <= tempSelectMax) {
                    return item;
                }
            } else if (tempSelectMin !== 'init') {  // 有下限
                if (item.count >= tempSelectMin) {
                    return item;
                }
            } else {  // 有上限
                if (item.count <= tempSelectMax) {
                    return item;
                }
            }
            return {
                ...item,
                count: null,
            };
        });
            
        // console.log('范围线数据', alertLine);
        // console.log('完整数据', data);

        //区分开温度和湿度下的纵轴刻度范围
        let scale={};
        if(isTemp){  //温度和湿度范围不同
            scale = {
                date: {    //横轴数据
                    alias: "日期",
                    // type: "time",//这临时规定类型为Date对象类型
                },
                count: {   //纵轴数据
                    alias: "次数",
                    tickCount: 6,
                    // 由于使用不同View，需要设定 scale 的 min 和 max
                    min: 0,
                    max: 45,
                }
            };
        }else{

            scale = {
                date: {    //横轴数据
                    alias: "日期",
                    // type: "time",//这临时规定类型为Date对象类型
                },
                count: {   //纵轴数据
                    alias: "次数",
                    tickCount: 6,
                    min: 40,
                    max: 90,
                }
            };

        }
        const rendererValue = isRendererCanvas ? 'canvas' : 'svg';
        const exportText = isRendererCanvas ? EXPORT_TEXT_PNG : EXPORT_TEXT_SVG;


        return (
            <div >
                <Chart
                    padding="auto"
                    forceFit
                    renderer={rendererValue} // renderer 默认值: canvas,可选值 svg.
                    forceUpdate={forceUpdate}
                    scale={{
                        count: {
                            sync: true
                        }
                    }}
                    onGetG2Instance={chartIns => {
                        this.chartIns = chartIns;
                    }}
                >
                    {/* 提示浮标 */}
                    <Tooltip />
                    {/* 在View层注入数据data */}
                    <View data={data} scale={scale}> 
                        <Axis  // 纵轴
                            name="count"
                            label={{
                                formatter: val =>  isTemp?`${val} ℃`:`${val} °`,
                            }}
                        />

                        {/* 正常展示的线 */}
                        <Geom
                            type="line"
                            position="date*count"
                            color="#9AD681"
                            size={2}
                            tooltip={['count*alert', (count, alert) => {
                                // if (alert) {
                                if ((noMinWithMax && count <= tempSelectMax) || (withMinNoMax && count >= tempSelectMin) || (withMinwithMax && count <= tempSelectMax && count >= tempSelectMin)) {
                                    return {
                                        name: isTemp?'温度':'湿度',
                                        color: '#6a56a5',
                                        value: isTemp?`${count} ℃`:`${count} °`,
                                    };
                                }
                                return {
                                    name:  isTemp?'温度':'湿度',
                                    color: '#9AD681',
                                    value: isTemp?`${count} ℃`:`${count} °`,
                                };
                            }]}
                        />

                        {/* 最大值最小值点 范围点 */}
                        <Geom
                            type="point"
                            position="date*count"
                            size={6}
                            shape={"circle"}
                            tooltip={false}
                            color={['count*alert', (count, alert, max) => {
                                // 最大最小值
                                if (isMM && (count === minVal || count === maxVal)) {
                                    // console.log("count，red", count)
                                    return "red"
                                }
                                // 范围内的点
                                if ((noMinWithMax && count <= tempSelectMax) || (withMinNoMax && count >= tempSelectMin) || (withMinwithMax && count <= tempSelectMax && count >= tempSelectMin)) {
                                    return '#6a56a5';
                                }
                                return '#9AD681';
                            }]}
                        />


                    </View>

                    {/* 紫色限定区域的线 */}
                    <View data={alertLine} scale={scale}>
                        <Geom
                            type="line"
                            position="date*count"
                            color="#6a56a5"
                            size={2}
                            tooltip={false}
                        />
                    </View>
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
            </div>

        );
    }

}


export default index;
