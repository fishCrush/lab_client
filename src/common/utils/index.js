/*
 * @Author: your name
 * @Date: 2020-04-10 16:14:53
 * @LastEditTime: 2020-04-28 10:34:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /client/src/common/utils/index.js
 */
import Axios from 'axios';
import { templateUrl,typeFile } from '../constants/index';

 export function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


// 求出对象数组里某个属性值最大或者最小的值
export function objArrOnePropertyMM(arr,Property,sort){
  if(!arr[0].hasOwnProperty(Property)){
    return false;
  }

  if(sort==="max"){
  return Math.max.apply(Math, arr.map(function(o) {return o[Property]}))
  } else {
  return Math.min.apply(Math, arr.map(function(o) {return o[Property]}))
  }

}

// blob下载  可用于生产excel表
export function BlobDownload(type="xls",filename = '') {
  if (!filename) {
    filename = `file_${new Date().getTime()}`;
  }

  Axios.get(templateUrl, {
    responseType: 'blob'
  }).then(data => {
    // console.log("res/data",data)
    const content = data.data;  // 拿到模板文件的数据
    // console.log("content数据是：",content)
    const blob = new Blob([content], { type: typeFile[type].type });  // 在本地创建excel表
    const fileName = `${filename}${typeFile[type].sufix}`;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();   // 文件开始下载
    window.URL.revokeObjectURL(url);
  });
}

// 格式化时间对象
export function formatDate(date){
    // var date = new Date(date);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return year + '-' + month + '-' + day +'   '+ hour + ':'+minute +':'+second;
}