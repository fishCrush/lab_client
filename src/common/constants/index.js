/*
 * @Author: your name
 * @Date: 2020-04-08 22:17:00
 * @LastEditTime: 2020-04-27 16:33:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/common/constants/index.js
 */
 // iconfont项目地址
export const MYICON="//at.alicdn.com/t/font_1739697_7pjnocmstqo.js" ;

// 下载excel模板文件的地址（放于七星云的对象存储里）
export const templateUrl="http://q95hlcjwx.bkt.clouddn.com/0426%E5%AF%BC%E5%87%BA%E6%A8%A1%E6%9D%BF%E6%96%87%E4%BB%B6.xlsx"

// 添加资源  上传图片时的假定地址
export const uploadUrl="https://www.mocky.io/v2/5cc8019d300000980a055e76";

// 文件类型映射
export const typeFile = {
  csv: {
      type: 'text/csv,charset=UTF-8',
      sufix: '.csv'
  },
  xlsx: {
      type: 'application/vnd.ms-excel',
      sufix: '.xlsx'
  },
  xls: {
      type: 'application/vnd.ms-excel',
      sufix: '.xls'
  }
};

export const QUICKTAGS=["娱乐","机关","备案","数据文件"]

export const diyTagMaxLen=8;
export const diyTagColor="#b37feb";

export const mapRateShow = {
    "1": "icon-yixing",
    "2": "icon-erxing",
    "3": "icon-sanxing",
    "4": "icon-sixing",
    "5": "icon-wuxing"
  };

  export const historyActionMapChinese={
    add:"增加",
    delete:"删除",
    modify:"修改"
  }
export const historyActionMapColor={
  modify:"#b37feb",
  delete:"#ff7875",
  add:"#69c0ff"
}

export const colors=[
  "#ff7f0e", "#2ca02c","#9254de",'#ff85c0','#36cfc9','#bae637'
]

