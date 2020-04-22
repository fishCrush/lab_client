import React from 'react';
import ReactDOM from 'react-dom';
// todo
import { hot } from 'react-hot-loader';
import { Provider } from 'mobx-react'; // 引入mobx的包裹组件
import * as otherStore from './store/index'; // 引入store的数据

import AppRouter from './index.jsx';
import * as serviceWorker from './serviceWorker';

const HotApp = hot(module)(AppRouter);

const store = {
  ...otherStore
};
const App = (
  // 通过Provider将store数据送入 可以传给子组件
  <Provider {...store}> 
  
      <HotApp />
  </Provider>
);

ReactDOM.render(
  App,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
