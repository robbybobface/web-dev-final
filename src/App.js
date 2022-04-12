import React from 'react';
import { MDBBtn, MDBContainer } from 'mdb-react-ui-kit';

import './components/stylesheets/global.css';
import './components/stylesheets/home.css';
import './components/stylesheets/header.css';
import './components/stylesheets/login.css';
import './components/stylesheets/search.css';
import './components/stylesheets/privacypolicy.css';

import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/partials/header";
import Login from './components/login';
import Home from './components/home';
import Register from "./components/register";
import Search from "./components/search";
import PrivacyPolicy from "./components/privacypolicy";
import Footer from "./components/partials/footer";

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
                    <Route exact={true} path="/privacy-policy" element={<PrivacyPolicy/>}/>
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
                <Footer/>
            </Router>
        </Provider>
    );
}

export default App;
