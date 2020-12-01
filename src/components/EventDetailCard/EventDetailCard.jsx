import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddToCalendar from "react-add-to-calendar";
import PostEventImageForm from "../PostEventForm/PostEventImageForm";
import UpdateEventImageForm from "../UpdateEventImageForm";

const EventDetailCard = ({ id, userData, eventData, eventImageData }) => {
    let username = window.localStorage.getItem("username");
    const [loggedIn, setLoggedIn] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        token != null ? setLoggedIn(true) : setLoggedIn(false);
        if (loggedIn && username === eventData.organiser) {
            setIsOwner(true);
        }
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

    let imageContent;

    if (username === eventData.organiser) {
        if (eventImageData[0] != undefined) {
            imageContent = (
                <UpdateEventImageForm
                    eventData={eventData}
                    eventImageData={eventImageData}
                />
            );
        } else {
            imageContent = <PostEventImageForm eventData={eventData} />;
        }
    } else {
        if (eventImageData[0] != undefined) {
            imageContent = (
                <img className="event-image" src={eventImageData[0].image} />
            );
        } else {
            imageContent = (
                <img src="https://www.anzenviro.com.au/wp-content/uploads/2020/05/orionthemes-placeholder-image-300x200.png" />
            );
        }
    }

    const nonOwnerView = (
        <section>
            <div id="event-page-left">
                <h1>{eventData.event_name}</h1>
                <p>Status: {eventData.is_open ? `Open` : `Closed`}</p>
                <p>
                    {FormatDateTime(eventData.event_datetime_start)} until{" "}
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
                {loggedIn && !userData.is_org && generateCalendar(eventData)}
            </div>
            <div id="event-page-image">{imageContent}</div>
        </section>
    );

    const ownerView = (
        <section>
            <div id="event-page-left">
                <div id="owner-links">
                    <Link to={`/events/${id}/edit`}>
                        <p>Edit</p>
                    </Link>
                    <Link to={`/events/${id}/delete`}>
                        <p>Delete</p>
                    </Link>
                </div>
                <h1>{eventData.event_name}</h1>
                <p>Status: {eventData.is_open ? `Open` : `Closed`}</p>
                <p>
                    {FormatDateTime(eventData.event_datetime_start)} until{" "}
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
    );

    return { ownerView };
};

export default EventDetailCard;
