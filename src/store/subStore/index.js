import { action, flow, observable, computed } from 'mobx';

export class SubStore{
    @observable mapLoading=true;


    @action.bound
    mapLoaded() {
        console.log('mapLoader执行');
        this.mapLoading = false;
        // console.log("已经点击，navSelectedKey值为",this.navSelectedKey);
    }

   
}

export default new SubStore();
