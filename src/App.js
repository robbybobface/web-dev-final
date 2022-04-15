import React, { useMemo, useState } from 'react';

import './components/stylesheets/global.css';
import './components/stylesheets/home.css';
import './components/stylesheets/header.css';
import './components/stylesheets/login.css';
import './components/stylesheets/search.css';
import './components/stylesheets/details.css';

import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/partials/header";
import Login from './components/login';
import Home from './components/home';
import Register from "./components/register";
import Search from "./components/search";
import Profile from './components/profile';

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import userReducer from "./reducers/user-reducer.js";
import authReducer from "./reducers/auth-reducer.js";
import { UserContext } from './Utils/UserContext';
import Artist from "./components/artist";
import Album from "./components/album";
import Track from "./components/track";
import Tracks from "./components/tracks";
import Albums from "./components/albums";

const reducer = combineReducers({
    user: userReducer, auth: authReducer
});
const store = createStore(reducer);

function App() {
    const [ user, setUser ] = useState({});
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ searchBy, setSearchBy ] = useState('tracks');

    const providerValue = useMemo(() => ({
        loggedIn: [ loggedIn, setLoggedIn ],
        user: [ user, setUser ],
        searchBy: [ searchBy, setSearchBy ]
    }), [ loggedIn, setLoggedIn, user, setUser, searchBy, setSearchBy ]);

    return (
        <Provider store={store}>
            <Router>
                <UserContext.Provider value={providerValue}>
                    <Header/>
                    <Routes>
                        <Route exact={true} path="/" element={<Home/>}/>
                        <Route exact={true} path="/login" element={<Login/>}/>
                        <Route exact={true} path="/register" element={<Register/>}/>
                        <Route exact={true} path="/search" element={<Search/>}/>
                        <Route exact={true} path="/search/:searchString" element={<Search/>}/>
                        <Route exact={true} path="/profile/:username" element={<Profile/>}/>
                        <Route exact={true} path="/artist/:aid" element={<Artist/>}/>
                        <Route exact={true} path="/album/:aid" element={<Album/>}/>
                        <Route exact={true} path="/track/:tid" element={<Track/>}/>
                        <Route exact={true} path="/tracks/:aid" element={<Tracks/>}/>
                        <Route exact={true} path="/albums/:aid" element={<Albums/>}/>
                        {/*<Route path="*" element={<PageNotFound/>}/>*/}
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
                        theme={"colored"}
                    />
                </UserContext.Provider>
            </Router>
        </Provider>
    );
}

export default App;
