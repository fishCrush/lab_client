import React, { Suspense,lazy } from 'react';
import { BrowserRouter as Router, Route, Switch,Link} from 'react-router-dom';
//todo
// import { observer, Provider, inject } from 'mobx-react';
import routes from './router/index';
// import { ROUTER_PREFIX, ref, homePageUrl, shareInfo } from './static/js/property';
// import DataStore from './store/index';
// import { withRouter } from 'react-router-dom';
// eslint-disable-next-line


// todo 完善路由方式
import Index from './pages/Index/index';
import Login from './pages/Login/index';
import Setting from './pages/Setting/index';
import Home from './pages/Home/index';
import Sub from './pages/Sub/index';




// function loadableComp(LazyComponent) {
//     return () => (
//       <Suspense fallback={''}>
//         <LazyComponent />
//       </Suspense>
//     );
//   }
// const Index = loadableComp(lazy(() => import(/* webpackChunkName: "index" */'./pages/Index/index.jsx')));
// const Login = loadableComp(lazy(() => import(/* webpackChunkName: "login" */'./pages/Login/index.jsx')));
// const routes = [
//     {
//         path: '',
//         component: Index
//     },
//     {
//       path: '/index',
//       component: Index
//     },
//     {
//         path: '/login',
//         component: Login
//     },
   
    
//   ];



class index extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    componentDidMount(){
      console.log('最外层路由包裹组件 app.jsx  componentDidMount')
    }

    render() {

      return (
        <Router basename="">
          {/* <Provider DataStore={DataStore}> */}
            {/* <Suspense fallback={<p />}> */}
                
            {/* <ul>
            <li>
              <Link to="/login">点击跳转</Link>
            </li>
           
          </ul> */}
              <Switch>
                {/* {
                    routes.map((route, i) => 
                    <Route
                      exact
                      key={i}
                      path={route.path}
                    // component={route.component}
                      render={props => (
                      <route.component {...props} routes={route.routes || []} />
                    )}
                  />
                    )
                }
                 */}
               <Route path="/login" component={Login}/>
               <Route exact path="/" component={Index}/>
               <Route path="/index" component={Index}/>
               <Route path="/setting" component={Setting}/>
               <Route path="/home" component={Home}/>
               <Route path="/sub" component={Sub}/>


               
              </Switch>
            {/* </Suspense> */}
          {/* </Provider> */}
        </Router>
      );


    }
}
export default index;