import React, { useEffect, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Three from './pages/Three/Three';
import Collection from './pages/Collection/Collection';
import Place from './pages/Place/Place';
import Profile from './pages/Profile/Profile';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/NotFound/NotFound';

import Loader from './components/Loader/Loader';

import { logInUserWithOauth, loadMe } from './store/actions/authActions';

const App = ({ logInUserWithOauth, auth, loadMe }) => {
  useEffect(() => {
    loadMe();
  }, [loadMe]);

  //redosled hookova
  useEffect(() => {
    if (window.location.hash === '#_=_') window.location.hash = '';

    const cookieJwt = Cookies.get('x-auth-cookie');
    if (cookieJwt) {
      Cookies.remove('x-auth-cookie');
      logInUserWithOauth(cookieJwt);
    }
  }, []);

  useEffect(() => {
    if (!auth.appLoaded && !auth.isLoading && auth.token && !auth.isAuthenticated) {
      loadMe();
    }
  }, [auth.isAuthenticated, auth.token, loadMe, auth.isLoading, auth.appLoaded]);

  return (
    <Suspense fallback={<>Loading</>}>
      <RecoilRoot>
        {auth.appLoaded ? (
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/users" component={Users} />
            <Route path="/notfound" component={NotFound} />
            <Route path="/admin" component={Admin} />
            <Route exact path="/three" component={Three} />
            <Route exact path="/:username" component={Profile} />
            <Route path="/place/:id" component={Place} />
            <Route path="/collection/:id" component={Collection} />
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        ) : (
          <Loader />
        )}
      </RecoilRoot>
    </Suspense>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { logInUserWithOauth, loadMe }))(App);
