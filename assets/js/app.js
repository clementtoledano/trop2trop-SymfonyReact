import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from "react-router-dom";

import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PostsPage from "./pages/PostsPage";

console.log('Hello Webpack Encore! 88!!!');

const App = () => {
    return <HashRouter>
        <Navbar/>
        <main className="container pt-5">
            <Switch>
                <Route path="/posts" component={PostsPage}/>
                <Route path="/" component={HomePage}/>
            </Switch>
        </main>
    </HashRouter>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement)
