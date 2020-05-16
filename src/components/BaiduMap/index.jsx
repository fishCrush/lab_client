import React, { Component, Spin } from 'react'
// import BMapGL from 'BMap';
import { inject, observer } from 'mobx-react';


@inject('SubStore')
@observer
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinning: true
        };
    }

    MP(ak) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `http://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=init`;
            document.head.appendChild(script)
            window.init = () => {
                // resolve(window.BMap)
                resolve(window.BMapGL)

            }
        })
    }


    componentDidMount() {
       
        this.MP("zBPuuDuCpXzSPAg2dRBk3qD7h0frpEPm").then(BMapGL => {
          
            var map = new BMapGL.Map("allmap"); // 创建Map实例
            var point = new BMapGL.Point(116.404, 39.915); // 创建点坐标
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
            map.setHeading(64.5);   //设置地图旋转角度
            map.setTilt(73);       //设置地图的倾斜角度

            // loading图标消失
            const { SubStore } = this.props;
            SubStore.mapLoaded();
        });
    }
    render() {
        return (
            <>
                <div
                    id='allmap'
                    style={{
                        width:1120,
                        height:600
                    }}
                >
                </div>
            </>
        )
    }
}

export default index