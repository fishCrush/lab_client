import React,{Component}from 'react';
import { withRouter } from "react-router-dom";

import { Button} from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';
import Notification from './Nofication';
import UserInfo from './UserInfo';
import Exit from './Exit';

// export default IconFont;
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
 
  


  componentDidMount(){
    console.log('home页的header  componentDidMount')
  }
  
  render(){
    // const { history, NotificationStore } = this.props;
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
              {/* <img src={require('src/common/images/imgSvg/t-logo-top.svg')} alt="" /> */}
              {/* <img src="" alt="" />      */}
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
           
            {/* <span
              className={`${styles.textHomeSubWrap} ${window.location.pathname.includes('/sub') ? '' : styles.notActiveText}`}
              onClick={() => {
                history.replace({
                  pathname: '/sub',
                  search: history.location.search
                });
              }}
            >
              <a className={styles.homeSubText} href="">实验室环境信息板</a>
            </span> */}

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
