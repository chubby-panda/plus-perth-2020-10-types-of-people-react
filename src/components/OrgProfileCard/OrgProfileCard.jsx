import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "../EventCard/EventCard";
import "./OrgProfileCard.css";
import logo from "../../Spinner.svg";

const OrgProfileCard = ({ userData }) => {
    const [orgDataProfile, setOrgDataProfile] = useState({});
    const user = window.localStorage.getItem("username");
    const username = userData.username;
    const [isBusy, setBusy] = useState(true);
    const [eventsHosted, setEventsHosted] = useState([]);

    const fetchOrg = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}users/org/${username}/profile/`
        );
        if (response.ok) {
            const data = await response.json();
            if (data) {
                setOrgDataProfile(data);
                // setBusy(false);
            }
            return;
        }
        const data = await response.json();
    };

    const fetchOrgEvents = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}events/${user}/events-hosted/`
        );
        if (response.ok) {
            const data = await response.json();
            if (data) {
                setEventsHosted(data);
                setBusy(false);
            }
            return;
        }
        const data = await response.json();
    };

    useEffect(() => {
        fetchOrg();
        fetchOrgEvents();
    }, []);

    const org_profile = {
        is_org: userData.is_org,
        username: userData.username,
        email: userData.email,
        company_name: orgDataProfile.company_name,
        contact_name: orgDataProfile.contact_name,
        org_bio: orgDataProfile.org_bio,
        //   "https://cdn.shecodes.com.au/wp-content/uploads/2018/10/SheCodes-01.png",
        org_image: orgDataProfile.org_image,
    };

    function IsOwnerCanEdit() {
        // if (username != null) {
        if (user === userData.username) {
            return (
                <div id="owner-links">
                    <Link className="owner-link" to={`/profile/${user}/edit`}>
                        <p>Edit</p>
                    </Link>
                    <Link className="owner-link" to={`/profile/${user}/delete`}>
                        <p>Delete</p>
                    </Link>
                </div>
            );
        } else {
            return <p></p>;
        }
    }
    // }

    return (
        <>
            {isBusy ? (
                <img id="spinner-img" src={logo} alt="loading..." />
            ) : (
                <>
                    <div id="profile-exist">
                        {(org_profile.company_name === null ||
                            org_profile.company_name === undefined) &&
                        // (org_profile.org_image === null || org_profile.org_image === undefined)&&
                        (org_profile.org_bio === null ||
                            org_profile.org_bio === undefined) &&
                        (org_profile.contact_name === null ||
                            org_profile.contact_name === undefined) ? (
                            <div>
                                <h2>{org_profile.username}</h2>
                                <h2>
                                    There is no profile set up for this company{" "}
                                </h2>
                                {user === org_profile.username ? (
                                    <>
                                        <p>Tell us about the company</p>
                                        <IsOwnerCanEdit />
                                        <br></br>
                                        <p>Email: {org_profile.email}</p>
                                    </>
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        ) : (
                            <>
                                <div id="o-profile-sections-1-2">
                                    <div id="o-profile-left">
                                        <IsOwnerCanEdit />
                                        <h1>
                                            {org_profile.company_name} (
                                            {org_profile.username})
                                        </h1>
                                        <p>{org_profile.org_bio}</p>
                                        <br />
                                        <p>
                                            Contact person:{" "}
                                            {org_profile.contact_name}
                                        </p>
                                        <p>Email: {org_profile.email}</p>
                                    </div>
                                    <div id="o-profile-right">
                                        <img
                                            id="o-profile-image"
                                            src={org_profile.org_image}
                                            alt={org_profile.name}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
            <div id="m-profile-section-3">
                <h3>Events hosted</h3>
                <div className="event-grid">
                    {eventsHosted.map((eventData, key) => {
                        return <EventCard key={key} eventData={eventData} />;
                    })}
                </div>
            </div>
        </>
    );
};

export default OrgProfileCard;
