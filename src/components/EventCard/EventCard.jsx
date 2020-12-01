import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";
import retrieveIcons from "../../utilities/retrieveIcons.js";

const EventCard = (event) => {
    const [images, setImages] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_API_URL}events/${event.eventData.id}/images/`
        )
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                setImages(data);
            });
        setLoading(false);
    }, []);

    console.log(event);
    console.log(images);

    if (images == undefined) {
        return (
            <Link to={`/events/${event.eventData.id}`}>
                <div id="event-card">
                    <div id="event-card-image">
                        <img
                            src="https://www.anzenviro.com.au/wp-content/uploads/2020/05/orionthemes-placeholder-image-300x200.png"
                            alt={event.eventData.event_name}
                        />
                    </div>
                    <div id="event-card-text">
                        <h5>
                            {event.eventData.event_date} |{" "}
                            {event.eventData.event_name}
                        </h5>
                        <small>{event.eventData.organiser}</small>
                        <div>
                            {retrieveIcons(event.eventData.categories).map(
                                (icon) => (
                                    <>{icon}</>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    } else {
        return (
            <Link to={`/events/${event.eventData.id}`}>
                <div id="event-card">
                    <div id="event-card-image">
                        <img
                            src={images[0].image}
                            alt={event.eventData.event_name}
                        />
                    </div>
                    <div id="event-card-text">
                        <h5>
                            {event.eventData.event_date} |{" "}
                            {event.eventData.event_name}
                        </h5>
                        <small>{event.eventData.organiser}</small>
                        <div>
                            {retrieveIcons(event.eventData.categories).map(
                                (icon) => (
                                    <>{icon}</>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
};

export default EventCard;
