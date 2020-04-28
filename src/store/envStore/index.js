import { action, flow, observable, computed } from 'mobx';

export class envStore {
    // 单个实验室温度区域
    @observable dateSelected = "";
    @observable dateStringSelected = "";

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
