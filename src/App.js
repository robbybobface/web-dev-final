import React from 'react';

import './components/stylesheets/global.css';
import './components/stylesheets/home.css';
import './components/stylesheets/header.css';
import './components/stylesheets/login.css';
import './components/stylesheets/search.css';

import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/partials/header";
import Login from './components/login';
import Home from './components/home';
import Register from "./components/register";
import Search from "./components/search";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import userReducer from "./reducers/user-reducer.js";
import authReducer from "./reducers/auth-reducer.js";

const reducer = combineReducers({
    user: userReducer, auth: authReducer
});
const store = createStore(reducer);

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Header/>
                <Routes>
                    <Route exact={true} path="/" element={<Home/>}/>
                    <Route exact={true} path="/login" element={<Login/>}/>
                    <Route exact={true} path="/register" element={<Register/>}/>
                    <Route exact={true} path="/search" element={<Search/>}/>
                    {/*<Route exact={true} path="/user/:username" element={<Profile/>}/>*/}
                </Routes>
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
            </Router>
        </Provider>
    );
}

export default App;
