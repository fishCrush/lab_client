/*
 * @Author: your name
 * @Date: 2020-04-24 16:02:01
 * @LastEditTime: 2020-04-24 16:02:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/common/utils/countDownByLeftInterval.js
 */
class CountDownByLeftInterval {
    /**
     *
     * @param LeftInteval 剩余时间
     * @param callback 每次倒计时的回调
     */
    constructor(LeftInteval, callback) {
        this.LeftInteval = LeftInteval; // ms
        this.callback = callback;
        this.timer = null;
        this.init();
    }
    init() {
        let cObj = this;
        if (cObj.timer) {
            clearInterval(cObj.timeInterVal);
        }

        cObj.timer = setInterval(function () {
            let t = cObj.getRemainTimeObj();
            cObj.callback(t);
        }, 1000);
    }
    getRemainTimeObj() {
        let cObj = this;
        if (cObj.LeftInteval > 0) {
            cObj.LeftInteval = cObj.LeftInteval - 1000;
        }

        let t = cObj.LeftInteval;
        let seconds = Math.floor((t / 1000) % 60);
        let minutes = Math.floor((t / 1000 / 60) % 60);
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            obj: cObj,
            total: t, // ms
            totalSec: Math.floor(t / 1000), // ms
            days,
            hours: ('0' + hours).slice(-2),
            minutes: ('0' + minutes).slice(-2),
            seconds: ('0' + seconds).slice(-2)
        };
    }
}
export { CountDownByLeftInterval };
