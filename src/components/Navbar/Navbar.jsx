import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [LoggedIn, setLoggedIn] = useState(false);
    const history = useHistory();
    const location = useLocation();
    let username = window.localStorage.getItem("username");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        token != null ? setLoggedIn(true) : setLoggedIn(false);
        setLoading(false);
    }, [location]);

    const logout = () => {
        window.localStorage.clear();
        history.push("/");
    };

    const reloadprofile = () => {
        history.push(`/profile/${username}`);
        window.location.reload();
    };

    if (loading) {
        return <></>;
    } else {
        return (
            <>
                <div id="navbar">
                    <div id="navbar-logo-container">
                        <Link to="/">
                            <img
                                id="navbar-logo"
                                src={
                                    window.location.origin + "/binary_logo.png"
                                }
                                alt="Binary"
                            />
                        </Link>
                    </div>
                    <div id="navbar-menu-items">
                        {!LoggedIn && (
                            <>
                                <Link className="navbar-menu-item" to="/login">
                                    Login
                                </Link>
                                <Link className="navbar-menu-item" to="/signup">
                                    Sign up
                                </Link>
                            </>
                        )}
                        {LoggedIn && (
                            <>
                                <Link
                                    className="navbar-menu-item"
                                    to="/create-event"
                                >
                                    Create Event
                                </Link>

                                <Link
                                    className="navbar-menu-item"
                                    to={`/profile/${username}`}
                                    onClick={reloadprofile}
                                >
                                    {username}
                                </Link>
                                <Link
                                    className="navbar-menu-item"
                                    to="/"
                                    onClick={logout}
                                >
                                    Logout
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="separation-container"></div>
            </>
        );
    }
};

export default Navbar;
