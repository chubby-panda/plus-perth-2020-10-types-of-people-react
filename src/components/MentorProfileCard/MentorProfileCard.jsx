import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../components/EventCard/EventCard";
import retrieveIcons from "../../utilities/retrieveIcons.js";
import "./MentorProfileCard.css";
import logo from "../../Spinner.svg";

const MentorProfileCard = ({ userData }) => {
    const [mentorDataProfile, setMentorDataProfile] = useState({});
    const username = userData.username;
    const user = window.localStorage.getItem("username");
    const [isBusy, setBusy] = useState(true);
    const [eventsAttended, setEventsAttended] = useState([]);

    const fetchMentorEvents = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}events/${username}/mentor-attendance/`
        );
        if (response.ok) {
            const data = await response.json();
            if (data) {
                setEventsAttended(data);
                console.log(data);
                // setBusy(false);
            }
            return;
        }
        const data = await response.json();
    };

    const fetchMentor = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}users/mentor/${user}/profile/`
        );
        if (response.ok) {
            const data = await response.json();
            if (data) {
                setMentorDataProfile(data);
                setBusy(false);
            }
            return;
        }
        const data = await response.json();
    };
    useEffect(() => {
        fetchMentor();
        fetchMentorEvents();
        setBusy(false);
    }, []);

    const mentor_profile = {
        is_org: userData.is_org,
        username: userData.username,
        email: userData.email,
        name: mentorDataProfile.name,
        bio: mentorDataProfile.bio,
        mentor_image: mentorDataProfile.mentor_image,
        skills: mentorDataProfile.skills,
        location: mentorDataProfile.location,
    };

    function IsOwnerCanEdit() {
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

    return (
        <>
            {isBusy ? (
                <img id="spinner-img" src={logo} alt="loading..." />
            ) : (
                <>
                    <div id="profile-exist">
                        {mentorDataProfile.name == null &&
                        mentorDataProfile.skills == null &&
                        mentor_profile.bio == null ? (
                            <div>
                                <h2>{mentor_profile.username}</h2>
                                <h2>
                                    There is no user profile set up for this
                                    user{" "}
                                </h2>
                                {user === mentor_profile.username && (
                                    <>
                                        <p>
                                            Tell us about yourself and your
                                            skills
                                        </p>
                                        <IsOwnerCanEdit />
                                        <br></br>
                                        <p>Email: {mentor_profile.email}</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <div id="m-profile-sections-1-2">
                                    <div id="m-profile-left">
                                        <img
                                            id="m-profile-image"
                                            src={mentor_profile.mentor_image}
                                            alt={mentor_profile.username}
                                        />
                                    </div>
                                    <div id="m-profile-right">
                                        <h1>
                                            {mentor_profile.name} (
                                            {mentor_profile.username})
                                        </h1>
                                        <p>Email: {mentor_profile.email}</p>
                                        <p>{mentor_profile.bio}</p>
                                        <p>
                                            Location: {mentor_profile.location}
                                        </p>
                                        <br />
                                        <IsOwnerCanEdit />
                                        <div>
                                            {mentor_profile.skills != null &&
                                                retrieveIcons(
                                                    mentor_profile.skills
                                                ).map((icon) => <>{icon}</>)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default MentorProfileCard;
