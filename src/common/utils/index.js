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