import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, withRouter, Redirect} from "react-router-dom";
import "bootswatch/dist/sketchy/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

import '../css/app.css';
import Navbar from "./components/Navbar";
import PostsPage from "./pages/PostsPage";
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/authAPI"
import PostEditPage from "./pages/PostEditPage";
import SubscribePage from "./pages/SubscribePage";
import AccountProfilePage from "./pages/AccountProfilePage";
import AccountPostsPage from "./pages/AccountPostsPage";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

AuthApi.setup();


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthApi.isAuthenticated());


    const NavbarWithRouter = withRouter(Navbar)

    return <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }}>
        <HashRouter>
            <NavbarWithRouter/>
            <div className="container pt-5">
                <Switch>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/subscribe" component={SubscribePage}/>
                    <Route path="/posts" component={PostsPage}/>
                    <PrivateRoute path={"/post-edit/:id"} component={PostEditPage}/>
                    <PrivateRoute path={"/account-profile"} component={AccountProfilePage}/>
                    <PrivateRoute path={"/account-posts"} component={AccountPostsPage}/>
                    <Redirect path={""} to={"/posts"}/>
                </Switch>
            </div>
        </HashRouter>



        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    </AuthContext.Provider>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement)
