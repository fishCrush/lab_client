import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import MyIcon from '../../components/MyIcon';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    btnClick = () => {
        this.props.onClick();
    }

    render() {
        const { text, size,type} = this.props;
        const iconSize=this.props.iconSize?this.props.iconSize:18;
        return (
            <span className="diyThemeBtnWrap">
                <Button type="primary" size={size} onClick={this.btnClick}
                  style={{fontSize:iconSize}}
                >
                    <MyIcon type={type}/>
                    {text}
                </Button>
            </span>

        );
    }

}

export default index;
