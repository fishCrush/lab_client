import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Switch } from 'antd';
import * as styles from './index.less';
import { Chart, Geom, Axis, Tooltip, View } from 'bizcharts';
import { data } from '../../../../common/constants/mockData';
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

    render() {
        const {  isRendererCanvas, forceUpdate } = this.state;
        const { EnvStore } = this.props;
        const { tempSelectMin, tempSelectMax, isMM } = EnvStore;
        console.log("tempSelectMin, tempSelectMax", tempSelectMin, tempSelectMax);

        //求出最小值 最大值
        const minVal = objArrOnePropertyMM(data, "count", "min");
        const maxVal = objArrOnePropertyMM(data, "count", "max");
        console.log('minval maxval', minVal, maxVal);

        // 限定范围的第一次筛选
        const rangeAboveMinData = data.filter(item => {
            return tempSelectMin === 'init' || (tempSelectMin !== 'init' && item.count >= tempSelectMin)
        })
        console.log('rangeAboveMinData', rangeAboveMinData);

        // 限定范围的第二次筛选
        const rangeUnderMaxData = rangeAboveMinData.filter(item => {
            return tempSelectMax === 'init' || (tempSelectMax !== 'init' && item.count <= tempSelectMax)
        })
        console.log('rangeUnderMaxData', rangeUnderMaxData);



        const noMinWithMax = (tempSelectMin === 'init' && tempSelectMax !== 'init');
        const withMinNoMax = (tempSelectMin !== 'init' && tempSelectMax === 'init');
        const withMinwithMax = (tempSelectMin !== 'init' && tempSelectMax !== 'init');

        // 处理范围内的线
        const alertLine = [...data].map((item) => {
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
        console.log('范围线数据', alertLine);

        // console.log('完整数据', data);
        var scale = {
            date: {
                alias: "日期",
                type: "time",
            },
            count: {
                alias: "次数",
                tickCount: 6,
                // 由于使用不同View，需要设定 scale 的 min 和 max
                min: 0,
                max: 60,
            }
        };
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
                    <View data={data} scale={scale}>
                        <Axis  // 纵轴
                            name="count"
                            label={{
                                formatter: val => `${val} ℃`,
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
                                        name: '次数',
                                        color: '#6a56a5',
                                        value: `${count} ℃`,
                                    };
                                }
                                return {
                                    name: '次数',
                                    color: '#9AD681',
                                    value: count,
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
                                    console.log("count，red", count)
                                    return "red"
                                }
                                // 范围内的点
                                if ((noMinWithMax && count <= tempSelectMax) || (withMinNoMax && count >= tempSelectMin) || (withMinwithMax && count <= tempSelectMax && count >= tempSelectMin)) {
                                    console.log("noMinWithMax,withMinNoMax,withMinwithMax", noMinWithMax, withMinNoMax, withMinwithMax);
                                    console.log("count，紫色 minVal maxVal ", count, tempSelectMin, tempSelectMax);
                                    return '#6a56a5';
                                }
                                return '#9AD681';
                            }]}
                        />


                    </View>

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
