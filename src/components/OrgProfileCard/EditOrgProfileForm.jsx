import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import Loader from "react-loader-spinner";

function EditProfileFrom(props) {
    const [errorMessage, setErrorMessage] = useState();
    const history = useHistory();
    const { orgDataProfile, userData } = props;
    let username = window.localStorage.getItem("username");

    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
    });

    const [publicProfile, setPublicProfile] = useState({
        company_name: "",
        org_bio: "",
        contact_name: "",
        org_image: "",
    });

    useEffect(() => {
        setCredentials({
            username: userData.username,
            email: userData.email,
        });
        setPublicProfile({
            company_name:
                orgDataProfile === null || orgDataProfile === undefined
                    ? " "
                    : orgDataProfile.company_name,
            contact_name:
                orgDataProfile === null ? " " : orgDataProfile.contact_name,
            org_bio: orgDataProfile === null ? " " : orgDataProfile.org_bio,
            org_image: orgDataProfile === null ? " " : orgDataProfile.org_image,
        });
    }, [userData, orgDataProfile]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPublicProfile((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [id]: value,
        }));
    };

    const editData = async () => {
        let token = window.localStorage.getItem("token");

        const fetch1 = fetch(
            `${process.env.REACT_APP_API_URL}users/${username}/`,
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(credentials),
            }
        );

        const cleanData = Object.fromEntries(
            // strip out things that are null
            Object.entries(publicProfile).filter(([k, v]) => v != null)
        );

        const fetch2 = fetch(
            `${process.env.REACT_APP_API_URL}users/org/${username}/profile/`,
            {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(cleanData),
            }
        );
        const responses = await Promise.all([fetch1, fetch2]);
        return responses;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (credentials.username) {
            editData().then((responses) => {
                console.log(responses);
                if (responses[0].ok && responses[1].ok) {
                    history.push(`/profile/${username}`);
                } else {
                    setErrorMessage("Invalid email address");
                }
            });
        } else {
            setErrorMessage("Please fill out the required fields");
        }
    };

    return (
        <form className="form">
            <div className="form-item">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={credentials.email}
                    onChange={handleChange}
                />
            </div>
            <div className="form-item">
                <label htmlFor="company_name">Company Name:</label>
                <input
                    type="text"
                    id="company_name"
                    defaultValue={publicProfile.company_name}
                    onChange={handleChange}
                />
            </div>
            <div className="form-item">
                <label htmlFor="contact_name">Contact Name:</label>
                <input
                    type="text"
                    id="contact_name"
                    defaultValue={publicProfile.contact_name}
                    onChange={handleChange}
                />
            </div>
            <div className="form-item">
                <label htmlFor="org_bio">About:</label>
                <textarea
                    type="text"
                    id="org_bio"
                    defaultValue={publicProfile.org_bio}
                    onChange={handleChange}
                    maxLength="500"
                />
            </div>
            <div className="form-item">
                <label htmlFor="org_image">Image:</label>
                <input
                    type="url"
                    id="org_image"
                    defaultValue={publicProfile.org_image}
                    onChange={handleChange}
                />
            </div>
            <div>
                <Link to={`/${username}/password`}>
                    <p>Reset Password</p>
                </Link>
            </div>
            {errorMessage && <p className="alert">{errorMessage}</p>}
            <button className="btn" type="submit" onClick={handleSubmit}>
                Update Account
            </button>
        </form>
    );
}

export default EditProfileFrom;
