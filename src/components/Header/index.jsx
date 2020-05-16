import React,{Component}from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import { Button} from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Notification from './Nofication';
import UserInfo from './UserInfo';
import Exit from './Exit';

// export default IconFont;
@inject('NotificationStore')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
 
  componentDidMount(){
    // console.log('home页的header  componentDidMount');
    //请求通知消息列表  //这里的uid：后端直接从cookie取
    axios.post('/api/notification/querylist_by_uid').then(res => {
      const { data } = res;
      if (data.status_code) {
        const list=data.data;
        // console.log("通知列表的list",list);
        const {NotificationStore}=this.props;
        NotificationStore.setNotiList(list);
      } else {
        console.log('请求通知消息列表 失败');
      }
    }
    ).catch(error => {
      console.log(error);
    });
  }
  
  render(){
    const { history} = this.props;

    return (
    
      <div className={styles.headerWrap}>       
         <>
            <span
              className={styles.labLogo}
              onClick={() => {
                history.replace({
                  pathname: '/index',
                  search: history.location.search
                });
              }}
            >
              <MyIcon type="icon-jigou-yingyongtubiao_dangqunbumenfuben" style={{fontSize:48}}/>
            </span>

            <span
              className={`${styles.textHomeWrap} ${window.location.pathname.includes('/home') ? '' : styles.notActiveText}`}
              onClick={() => {
                history.replace({
                  pathname: '/home',
                  search: history.location.search
                });
              }}
            >
              <a className={styles.homeText} href="">实验室资源信息板</a>
            </span>
            <span
              className={`${styles.textSetWrap} ${
                window.location.pathname.includes('/setting') ? '' : styles.notActiveText
              }`}
              onClick={() => {
                history.replace({
                  pathname: '/setting',
                  search: history.location.search
                });
              }}
            >
              <a className={styles.setText}>信息设置</a>
            </span>

            <span className={styles.headerWrapRight}>
              <Notification />
              {/* <UserInfo/> */}
              <Exit />
            </span>
            {/* {NotificationStore.isShowPanel && <Panel />} */}
            {/* <Panel /> */}
          </>
        
      </div>
      
    );
  }
  
}

export default withRouter(index);
