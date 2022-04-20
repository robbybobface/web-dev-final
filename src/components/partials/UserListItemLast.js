import { MDBSwitch } from "mdb-react-ui-kit";
import * as service from "../../services/user-service";
import React, { useContext } from "react";
import { UserContext } from "../../Utils/UserContext";

const UserListItemLast = ({ itemUser, index }) => {

    const { user } = useContext(UserContext);
    const [ stateUser, setStateUser ] = user;

    return (
        <>
            <div className="track-list-row-last">
                <div className="row align-items-center mb-0 px-2">
                    {/*<div className="col-2">*/}
                    {/*    <p className="mb-0 item-heading user-list">*/}
                    {/*        {index + 1}</p>*/}
                    {/*</div>*/}
                    <div className="col-4">
                        <p className="mb-0 item-heading user-list">
                            {itemUser.username}
                        </p>
                    </div>
                    <div className="col-6">
                        <p className="mb-0 item-heading user-list">
                            {itemUser.email}
                        </p>
                    </div>
                    <div className="col-2">
                        <p className="mb-0 item-heading duration ms-auto">
                            {itemUser.admin ?
                                <MDBSwitch
                                    defaultChecked
                                    disabled={stateUser._id === itemUser._id}
                                    onClick={() => service.updateUser(
                                        { ...itemUser, admin: !itemUser.admin })}/>
                                :
                                <MDBSwitch name={user.id}
                                           disabled={stateUser._id === itemUser._id}
                                           onClick={() => service.updateUser(
                                               { ...itemUser, admin: !itemUser.admin })}/>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserListItemLast;
