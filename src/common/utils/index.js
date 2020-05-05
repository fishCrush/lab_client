/*
 * @Author: your name
 * @Date: 2020-04-10 16:14:53
 * @LastEditTime: 2020-05-05 13:40:48
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

// 生成随机温度数据
export function generateRandomDayTemps(){
  const baseTemps=[19,19,20,22,22,22,22,23,24,25,26,28,28,30,30,30,29,29,28,27,26,25,24,24]
  const resTemps=[];
  baseTemps.forEach((baseTemp)=>{
    const ramdonAdd=Math.random()*2;
    const resTemp=Math.round(baseTemp+ramdonAdd);
    resTemps.push(resTemp);
  })
  return resTemps;
}

// 生成随机湿度数据
export function generateRandomDayHums(){
  const baseHums=[72,75,77,79,81,82,82,81,76,70,65,59,53,49,46,44,43,44,47,54,55,60,65,68]
  const resHums=[];
  baseHums.forEach((baseHum)=>{
    const ramdonAdd=Math.random()*2;
    const resTemp=Math.round(baseHum+ramdonAdd);
    resHums.push(resTemp);
  })
  return resHums;
}

//对字符串数组的每一个成员去除前后空格
// export function trimStrArr(arr){
//   let resArr=arr.map(item=>{
//     if(typeof item === "string"){  //若是字符串则去掉字符串前后的空格
//       return item.trim() 
//     }
//     return item
//   })
//   return resArr;
// }
