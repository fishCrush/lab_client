import React, { Component } from 'react';
import * as styles from './index.less'
import { CountDownByLeftInterval } from '../../common/utils/countdown.js'

class Index extends Component {
    state = {
      leftTimeMs: 60,
      countDown: null
    };
    componentDidMount() {
      const leftTimeMs = this.props.leftTime * 1000;
      const countDown = new CountDownByLeftInterval(leftTimeMs, cobj => {
        this.calcTimeInterval(cobj);
      });
      this.setState({
        leftTimeMs,
        countDown
      });
    }
    componentWillUnmount() {
      const { countDown } = this.state;
      if (countDown) {
        clearInterval(countDown.obj.timer);
      }
    }
    calcTimeInterval = cobj => {
      const { endFunc } = this.props;
      if (cobj.total <= 0) {
        clearInterval(cobj.obj.timer);
        typeof endFunc === 'function' && endFunc();
      }
      this.setState({ countDown: cobj });
    };
    render() {
      const { countDown, leftTimeMs } = this.state;
      if (countDown === null || countDown.total <= 0 || leftTimeMs <= 0 || !countDown.seconds) {
        return null;
      } else {
        return (
          <div className={styles.descWrap}>
            <p className={styles.linkText} style={{ cursor: 'default', textDecoration: 'none' ,color:"#00000075"}}>
              {countDown.seconds}秒后可重新发送验证码
            </p>
          </div>
        );
      }
    }
  }


export default Index;
