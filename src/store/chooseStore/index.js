import { action, flow, observable, computed } from 'mobx';

export class ChooseStore {
    // 坐侧边导航栏
    // @observable navSelectedKey = "mainList";
    @observable navSelectedKey = "mainList";
    @observable labSelected = "lab1";


    // 环境数据模块
    @observable envNavSelectedIndex = 0;

    @action.bound
    changeNavSelected(key) {
        this.navSelectedKey = key;
        // console.log("已经点击，navSelectedKey值为",this.navSelectedKey);
    }

    @action.bound
    changeLabSelected(name) {
        this.labSelected = name;
    }

    // 环境数据模块
    @action.bound
    changeEnvNavSelectedIndex(index) {
        this.envNavSelectedIndex = index;
        // console.log("已经点击，navSelectedKey值为",this.navSelectedKey);
    }


}

export default new ChooseStore();
