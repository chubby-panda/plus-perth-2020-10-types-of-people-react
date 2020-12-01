import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import AddToCalendar from "react-add-to-calendar";
import MentorRegisterForm from "../components/MentorRegisterForm/MentorRegisterForm";
import MentorAttendedPage from "./MentorAttendedPage";
// import { Button } from "react-bootstrap";
import retrieveIcons from "../utilities/retrieveIcons.js";
import logo from "../Spinner.svg";
import PostEventImageForm from "../components/PostEventForm/PostEventImageForm";
import UpdateEventImageForm from "../components/UpdateEventImageForm";
import EventDetailCard from "../components/EventDetailCard/EventDetailCard";

const EventPage = () => {
    let username = window.localStorage.getItem("username");
    const { id } = useParams();
    const location = useLocation();

    const [userData, setUserData] = useState({});
    const [eventData, setEventData] = useState({
        responses: [],
        categories: [],
    });
    const [eventImageData, setEventImageData] = useState([]);

    const [isBusy, setBusy] = useState(true);
    const [LoggedIn, setLoggedIn] = useState(false);

    const fetchData = async (url, setterFunction) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`);
        if (response.ok) {
            const data = await response.json();
            if (data) {
                setterFunction(data);
            }
        }
    };

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        token != null ? setLoggedIn(true) : setLoggedIn(false);
    }, [location]);

    useEffect(() => {
        fetchData(`users/${username}/`, setUserData);
        fetchData(`events/${id}/`, setEventData);
        fetchData(`events/${id}/images/`, setEventImageData);
        setBusy(false);
    }, []);

    const generateCalendar = (eventData) => {
        const event = {
            title: eventData.event_name,
            description: eventData.event_description,
            location: eventData.event_location,
            startTime: eventData.event_datetime_start,
            endTime: eventData.event_datetime_end,
        };
        return <AddToCalendar event={event} />;
    };

    let imageContent;

    if (eventImageData[0] != undefined) {
        imageContent = (
            <div className="event-image-box">
                <img className="event-image" src={eventImageData[0].image} />
            </div>
        );
    } else {
        imageContent = (
            <div className="event-image-box">
                <img
                    className="event-image"
                    src="https://www.anzenviro.com.au/wp-content/uploads/2020/05/orionthemes-placeholder-image-300x200.png"
                />
            </div>
        );
    }

    const FormatDateTime = (dateObject) => {
        if (dateObject != null) {
            const array = dateObject.split("T");
            const dateElements = array[0].split("-");
            const year = dateElements[0];
            const month = dateElements[1];
            const day = dateElements[2];
            const timeElements = array[1].split(":");
            const hour = timeElements[0];
            const minutes = timeElements[1];
            return `${day}-${month}-${year} ${hour}:${minutes}`;
        }
    };

    const event_is_open = () => {
        const today = new Date();
        const event_date = new Date(eventData.event_datetime_start);
        if (event_date - today >= 0) {
            //first date is in future, or it is today
            // return false;
            return (eventData.is_open = true);
        }
        // return true;
        return (eventData.is_open = false);
    };

    function MentorRegister() {
        if (userData.is_org) {
            // return <p>Only mentors can register to mentor at events </p>;
        } else {
            return (
                <MentorRegisterForm
                    eventData={eventData}
                    username={username}
                    id={id}
                />
            );
        }
    }

    return (
        <>
            {isBusy ? ( 
                <img id="spinner-img" src={logo} alt="loading..." />
            ) : (
                <div id="event-page" className="container">
                    <section>
                        <div id="event-page-left">
                            {username === eventData.organiser && (
                                <div id="owner-links">
                                    <Link
                                        className="owner-link"
                                        to={`/events/${id}/edit`}
                                    >
                                        <p>Edit</p>
                                    </Link>
                                    <Link
                                        className="owner-link"
                                        to={`/events/${id}/delete`}
                                    >
                                        <p>Delete</p>
                                    </Link>
                                    <Link
                                        className="owner-link"
                                        to={`/events/${id}/images`}
                                    >
                                        <p>Update Image</p>
                                    </Link>
                                </div>
                            )}
                            <h1>{eventData.event_name}</h1>
                            {event_is_open()}
                            <p>
                                Status: {eventData.is_open ? "Open" : "Closed"}
                            </p>
                            <p>
                                {FormatDateTime(eventData.event_datetime_start)}{" "}
                                until{" "}
                                {FormatDateTime(eventData.event_datetime_end)}
                            </p>
                            <div className="event-page-bio">
                                <p>{eventData.event_description}</p>
                            </div>
                            <p>{eventData.event_location}</p>
                            <p>
                                Hosted by{" "}
                                <Link to={`/profile/${eventData.organiser}`}>
                                    {eventData.organiser}
                                </Link>
                            </p>
                            <div className="icons">
                                <h3>Key Skills</h3>
                                {eventData.categories.map((skill) => (
                                    <p>{skill}</p>
                                ))}
                            </div>
                        </div>
                        <div id="event-page-image">{imageContent}</div>
                    </section>
                    {event_is_open() && !LoggedIn && (
                        <p>
                            Login to register your interest to be a mentor at
                            this event
                        </p>
                    )}
                    {LoggedIn && !userData.is_org && (
                        <>
                            <MentorRegisterForm
                                eventData={eventData}
                                username={username}
                                id={id}
                            />
                            {generateCalendar(eventData)}
                        </>
                    )}
                    {!event_is_open() && username === eventData.organiser && (
                        <Link
                            className="navbar-menu-item"
                            to={`/events/${id}/attended`}
                        >
                            Confirm Mentor Attendance
                        </Link>
                    )}
                    <div>
                        <h3>Registrations: </h3>
                        {eventData.responses.length === 0 ? (
                            <p>
                                There are currently no registrations for this
                                event
                            </p>
                        ) : (
                            <div>
                                <ul>
                                    {eventData.responses.map(
                                        (responseData, key) => {
                                            return (
                                                <li key={responseData.id}>
                                                    {responseData.mentor}{" "}
                                                    registered on{" "}
                                                    {FormatDateTime(
                                                        responseData.date_registered
                                                    )}
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EventPage;
