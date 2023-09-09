import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
const loggedInUserId = sessionStorage.getItem('loggedInUserId');
import { URL } from '../Constant';



function Profile() {
    var [Users, setUsers] = useState([]);
    var [User, setUser] = useState({
        userId: 0,
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        area: ""
    });

    useEffect(() => {
        console.log("started");
        Select();
    }, []);

    var Select = function () {
        var helper = new XMLHttpRequest();
        helper.onreadystatechange = () => {
            if (helper.readyState == 4 && helper.status == 200) {
                var result = JSON.parse(helper.responseText);
                setUsers(result.data); // Set the array of users from the server
            }
        }
        helper.open("GET", `${URL}users/${loggedInUserId}`);
        helper.send();
    }

    var TextChanged = function (args, userId) {
        const updatedUsers = Users.map(user => {
            if (user.userId === userId) {
                return {
                    ...user,
                    [args.target.name]: args.target.value
                };
            }
            return user;
        });
        setUsers(updatedUsers);
    };

    var Update = function (userId) {
        const updatedUser = Users.find(user => user.userId === userId);
        var helper = new XMLHttpRequest();
        helper.onreadystatechange = () => {
            if (helper.readyState == 4 && helper.status == 200) {
                console.log("Update successful");
            }
        }
        helper.open("POST", `${URL}Users/update/`);
        helper.setRequestHeader("Content-Type", "application/json");
        helper.send(JSON.stringify(updatedUser));
    };

    return (
        <div classname="row justify-content-center">
            {Users.map((user) => (
                <table classname="table table-responsive" key={user.userId}>
                    <tbody>
                        <tr>
                            <th>name</th>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={(e) => TextChanged(e, user.userId)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input
                                    type="text"
                                    name="email"
                                    value={user.email}
                                    onChange={(e) => TextChanged(e, user.userId)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={(e) => TextChanged(e, user.userId)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Phone</th>
                            <td>
                                <input
                                    type="text"
                                    name="phone"
                                    value={user.phone}
                                    onChange={(e) => TextChanged(e, user.userId)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>
                                <input
                                    type="text"
                                    name="address"
                                    value={user.address}
                                    onChange={(e) => TextChanged(e, user.userId)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Area</th>
                            <td>
                                <input
                                    type="text"
                                    name="area"
                                    value={user.area}
                                    onChange={(e) => TextChanged(e, user.userId)}
                                />
                            </td>
                        </tr>
                        <tr style={{ padding: 10 }}>
                            <td colSpan="2">
                                <button
                                    className='btn btn-warning'
                                    onClick={() => Update(user.userId)}
                                    style={{ padding: 10 }}
                                >
                                    Update Details
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ))}
        </div>
    );
}

export default Profile;