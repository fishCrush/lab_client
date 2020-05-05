/*
 * @Author: your name
 * @Date: 2020-04-16 19:30:45
 * @LastEditTime: 2020-05-05 21:26:16
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

    @observable dayTemps = [];  //单实验室原始温度数据124小时
    @observable dayHums = [];  //单实验室原始湿度数据124小时

    @observable allLabTimeData = [];  //多实验室24小时数据列表
    @observable allLabTimeDataHum = [];  //多实验室24小时数据列表 湿度

    @observable allLabsData = [];  //当前多试验图表展示出的数据
    @observable switchMany=false;   //多实验室下是否切换了温湿度

    //单线选择筛选区域
    @observable tempSelectMin = "init";   //变化后才为数值类型
    @observable tempSelectMax = "init";  //变化后才为数值类型
    @observable isMM = true;


    @action.bound
    setSwitchMany(bool) {
        this.switchMany=bool;
        console.log("刚切换了温湿度",this.switchMany);
    }

    @action.bound
    setAllLabsData(data) {
        this.allLabsData=data;
        // console.log("存入的当前多试验图表展示出的数据",this.allLabsData);
    }

    @action.bound
    initSelect() {
        this.tempSelectMin="init";
        this.tempSelectMax="init";
        this.isMM = true;
        // console.log("选择条件已还原初始化状态")
    }

    @action.bound
    setOneLabOriData(dayTemps,dayHums) {
        this.dayTemps=dayTemps;
        this.dayHums=dayHums;
        console.log("单实验室温度湿度数据已存入",this.dayTemps,this.dayHums);
    }

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
        //  console.log("已存入type",this.type);
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
