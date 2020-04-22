import {MYICON} from '../common/constants/index'
import { createFromIconfontCN } from '@ant-design/icons';

const MyIcon = createFromIconfontCN({
  scriptUrl: MYICON, // 在 iconfont.cn 上生成
});

export default MyIcon;