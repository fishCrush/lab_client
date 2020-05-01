/*
 * @Author: your name
 * @Date: 2020-04-16 19:30:45
 * @LastEditTime: 2020-05-01 23:59:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/store/envStore/index.js
 */
import { action, flow, observable, computed } from 'mobx';

export class envStore {
    // 单个实验室温度区域
    @observable showType="temp"  //展示的数据类型：湿度/温度 枚举：temp和hum
    @observable dateSelected = "";
    @observable dateStringSelected = "";
    @observable allLabTimeData = [];  //多实验室24小时数据列表
    @observable allLabTimeDataHum = [];  //多实验室24小时数据列表 湿度


    @observable tempSelectMin = "init";   //变化后才为数值类型
    @observable tempSelectMax = "init";  //变化后才为数值类型

    @observable isMM = true;

    // 多个实验室
    @observable labsNum = 2;
    @observable labsName = [];
    @observable labsTem = {
        "物理研究": [],
        "电力电子": [],
        "物联网通信": [],
    }

   
    @action.bound
    setAllLabTimeData(data) {
        this.allLabTimeData=data
        // console.log("allLabTimeData已存入",this.allLabTimeData);
    }

    @action.bound
    setAllLabTimeDataHum(data) {
        this.allLabTimeDataHum=data
        // console.log("allLabTimeDataHum已存入",this.allLabTimeDataHum);
    }

     // 设置展示类型
     @action.bound
     changeShowType(type) {
         this.showType=type
         console.log("已存入type",this.type);
     }

    // 单个实验室
    @action.bound
    changeDate(date, dateString) {
        this.dateSelected = date;
        this.dateStringSelected = dateString;
    }

    @action.bound
    changeMinTemp(min) {
        const minNum = parseFloat(min);
        this.tempSelectMin = minNum;
    }

    @action.bound
    changeMaxTemp(max) {
        const maxNum = parseFloat(max);
        this.tempSelectMax = maxNum;
    }

    @action.bound
    isMMchange(bool) {
        this.isMM = bool;
    }


}

export default new envStore();
