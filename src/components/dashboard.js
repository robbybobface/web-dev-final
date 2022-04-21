import React, { useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as service from "../services/user-service";
import { UserContext } from "../Utils/UserContext";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
    MDBInput, MDBPagination,
    MDBPaginationItem,
    MDBPaginationLink,
    MDBRadio,
    MDBSwitch
} from "mdb-react-ui-kit";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";
import { updateUser } from "../services/user-service";
import UserListItemLast from "./partials/UserListItemLast";
import UserListItem from "./partials/UserListItem";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #00C9B9;
`;

const Dashboard = () => {
    const { username } = useParams();
    const { user, loggedIn } = useContext(UserContext);
    const [ searchParams, setSearchParams ] = useSearchParams();

    const [ users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const [ page, setPage ] = useState(1);
    const [ pageCount, setPageCount ] = useState(0);

    const [ stateUser, setStateUser ] = user;
    const [ stateLoggedIn, setStateLoggedIn ] = loggedIn;

    const [ usernameObj, setUsernameObj ] = useState({ username: username });
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const getUsers = async () => {
        const users = await service.findAllUsers(searchParams);
        console.log(users.userResults);
        if (searchParams.get('page')) {
            // console.log(users.userResults);
        }
        setUsers(users.userResults);
        if (users.length > 1) {
            setPageCount(users.pagination.pageCount);
            console.log(pageCount);
        } else {
            setPageCount(users.pagination.pageCount);
            console.log(pageCount);
        }
    };

    const previousHandler = () => {
        setPage((p) => {
            if (p === 1) {
                return p;
            }
            console.log(...searchParams);
            setSearchParams({
                ...searchParams,
                page: p - 1
            });
            console.log(...searchParams);
            return p - 1;
        });

    };

    const nextHandler = () => {
        setPage((p) => {
            if (p === pageCount) {
                return p;
            } else {
                setSearchParams({
                    ...searchParams,
                    page: p + 1
                });
                console.log(...searchParams);
                return p + 1;
            }
        });

    };

    useEffect(() => {
        setLoading(true);
        getUsers().catch(err => toast.error(err));
        if (searchParams.get('search') === '') {
            navigate('/dashboard');
            setSearchParams({});
            getUsers().catch(err => toast.error(err));
        }
        console.log('page is ' + page);
        console.log('pageCount is ' + pageCount);
        setLoading(false);
    }, [ searchParams ]);

    return (
        <>
            {stateLoggedIn && stateUser.admin ?
                <>
                    {/*<h1>You are logged In and an Admin</h1>*/}
                    <Helmet>
                        <style>{'body {   background-image: url(\'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\') !important;\n'
                            + '  background-repeat: no-repeat !important;\n'
                            + '  background-size: cover !important;\n'
                            + '  background-color: rgba(61, 162, 195, 0.1) !important; }'}</style>
                    </Helmet>
                    <div className="container container-search mt-5 mb-auto">
                        <div className="row align-content-center justify-content-center">
                            <div className="card d-flex mask-custom px-4 py-2 col-10 col-sm-11 col-xl-9">
                                <div className="card-body">
                                    <p className="h1 font-weight-bold mb-4 text-white text-center">
                                        Admin Dashboard</p>
                                    <div className="row justify-content-center">
                                        <div className="col-md-10 mb-3 mb-md-0">
                                            <MDBInput className="input-search"
                                                      label="Search For A User"
                                                      id="formControlLg"
                                                      type="text"
                                                      size="lg"
                                                      contrast
                                                      onChange={(e) => setSearchParams(
                                                          {
                                                              ...searchParams,
                                                              search: e.target.value
                                                          })}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4 d-flex justify-content-center user-list-card-row">
                            <div className="card mask-custom-details mb-4 w-100 user-list-card">
                                <div className="card-body">
                                    <p className="mb-2 progress-header">
                                        User List
                                    </p>
                                    <div className="row align-items-center mb-0 px-2">
                                        {/*<div className="col-2">*/}
                                        {/*    <p className="mb-0 item-heading user-list">#</p>*/}
                                        {/*</div>*/}
                                        <div className="col-4">
                                            <p className="mb-0 item-heading user-list">
                                                Username
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mb-0 item-heading user-list">
                                                Email
                                            </p>
                                        </div>
                                        <div className="col-2">
                                            <p className="mb-0 item-heading user-list duration ms-auto">
                                                Admin Status
                                            </p>
                                        </div>
                                    </div>
                                    <hr className="less-mt"/>
                                    {loading ?
                                        <>
                                            <div className="d-flex align-items-center justify-content-center custom-height-dashboard">
                                                <ScaleLoader color={`white`}
                                                             loading={loading}
                                                             css={override}
                                                             height={40}
                                                             width={3}
                                                             radius={3}
                                                             margin={3}/>
                                                {/*<BarLoader color={'white'} loading={loading} css={override} height={3}/>*/}
                                            </div>
                                        </>
                                        :
                                        users && users.length > 0 && searchParams.get('search')
                                        === null ?
                                            users.map(
                                                (user, i, { length }) =>
                                                    length - 1 === i ?
                                                        <UserListItemLast key={user.id}
                                                                          itemUser={user}/>
                                                        :
                                                        <UserListItem key={user.id}
                                                                      itemUser={user}/>)
                                            : users && users.length > 0 && searchParams.get(
                                                'search') !== null ?
                                                users.map(
                                                    (user, i, { length }) =>
                                                        length - 1 === i ?
                                                            <UserListItemLast key={user.id}
                                                                              itemUser={user}
                                                                              index={i}/>
                                                            :
                                                            <UserListItem key={user.id}
                                                                          itemUser={user}/>)
                                                : !users ?
                                                    <div className="mt-4 text-center no-users-found">
                                                        No Users Found
                                                    </div>
                                                    :
                                                    <div className="mt-4 text-center no-users-found">
                                                        No Users Found
                                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {pageCount > 1 ?
                        <div className="row d-flex flex-row align-items-center justify-content-center w-100">
                            <div className="col-12 d-flex align-items-center justify-content-center">
                                <nav aria-label="...">
                                    <MDBPagination circle className="mb-0">
                                        <MDBPaginationItem className="page-toggle">
                                            <MDBPaginationLink
                                                className="page-toggle"
                                                tabIndex={-1}
                                                aria-disabled="true"
                                                disabled={page === 1}
                                                onClick={() => {
                                                    previousHandler();
                                                }}>
                                                Previous
                                            </MDBPaginationLink>
                                        </MDBPaginationItem>

                                        <MDBPaginationItem active={page === 1}
                                            // onClick={previousHandler}
                                        >
                                            <MDBPaginationLink>{page === 1 ? 1
                                                : page - 1}</MDBPaginationLink>
                                        </MDBPaginationItem>

                                        {pageCount === 1 ? '' :
                                            <MDBPaginationItem active={page !== 1}
                                                // onClick={() => {
                                                //     if (page === 1) {
                                                //         nextHandler();
                                                //     }
                                                // }}
                                            >
                                                <MDBPaginationLink>
                                                    {page === 1 && pageCount > 1 ? 2 : page === 1
                                                    && pageCount === 1 ? '' : page}
                                                    <span className="visually-hidden">(current)</span>
                                                </MDBPaginationLink>
                                            </MDBPaginationItem>
                                        }


                                        {page + 1 <= pageCount ? pageCount < 3 ? '' :
                                                <MDBPaginationItem
                                                    // onClick={nextHandler}
                                                >
                                                    <MDBPaginationLink>{page === 1 ? 3 : page
                                                        + 1}</MDBPaginationLink>
                                                </MDBPaginationItem>
                                            : ''}

                                        <MDBPaginationItem className="page-toggle">
                                            <MDBPaginationLink
                                                className="page-toggle"
                                                disabled={page === pageCount}
                                                onClick={() => {
                                                    nextHandler();
                                                }}>
                                                Next
                                            </MDBPaginationLink>
                                        </MDBPaginationItem>
                                    </MDBPagination>
                                </nav>
                            </div>
                        </div>
                        : ''}
                </> : navigate('/pagenotfound')
            }
        </>

        // {/*{JSON.stringify(users)}*/}

    );

};

export default Dashboard;
