import logo from './logo.svg';
import './vendors/bootstrap/css/bootstrap.min.css';
import './vendors/bootstrap/bootstrap.min.css';
import './App.css';

import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";

import Header from "./components/partials/header";
import Login from './components/login';
import Home from './components/home'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import userReducer from "./reducers/user-reducer";
import authReducer from "./reducers/auth-reducer";

const reducer = combineReducers({
    users: userReducer, auth: authReducer
});
const store = createStore(reducer);

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Header/>
                <div className="container">
                    <Routes>
                        <Route exact={true} path="/" element={<Home/>}/>
                        <Route exact={true} path="/login" element={<Login/>}/>
                        {/*<Route exact={true} path="/login" element={<Login/>}/>*/}
                        {/*<Route exact={true} path="/register" element={<Register/>}/>*/}
                        {/*<Route exact={true} path="/profile" element={<Profile/>}/>*/}
                    </Routes>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
