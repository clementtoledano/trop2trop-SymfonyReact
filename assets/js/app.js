import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch, withRouter, Redirect} from "react-router-dom";

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
import InputSearch from "./components/InputSearch";

AuthApi.setup();


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthApi.isAuthenticated());
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState('');

    const NavbarWithRouter = withRouter(Navbar)

    return <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }}>
        <HashRouter>
            <NavbarWithRouter/>
            <div className="container">
                <div className="row pt-5">
                    <main className="col-8">

                        <Switch>
                            <Route path="/login" component={LoginPage}/>
                            <Route path="/subscribe" component={SubscribePage}/>
                            <Route path="/posts" component={() => <PostsPage theCurrentPage={currentPage} theSearchResults={searchResults} />}  />
                            <PrivateRoute path={"/post/:id"} component={PostEditPage}/>
                            <PrivateRoute path={"/account-profile"} component={AccountProfilePage}/>
                            <PrivateRoute path={"/account-posts"} component={AccountPostsPage}/>
                            <Redirect path={""} to={"/posts"}/>
                        </Switch>

                    </main>
                    <aside className={"col-4"}>
                        <InputSearch theSearchResults={setSearchResults} theCurrentPage={setCurrentPage}/>
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-header">Hashtags</div>
                            <div className="card-body">
                                <h4 className="card-title">Primary card title</h4>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-header">Trop de trop</div>
                            <div className="card-body">
                                <h4 className="card-title">Primary card title</h4>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-header">Les pages</div>
                            <div className="card-body">
                                <h4 className="card-title">Primary card title</h4>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </HashRouter>
    </AuthContext.Provider>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement)
