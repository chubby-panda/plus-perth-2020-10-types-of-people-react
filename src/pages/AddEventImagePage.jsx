import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import PostEventImageForm from "../components/PostEventForm/PostEventImageForm";
import UpdateEventImageForm from "../components/UpdateEventImageForm";

const AddEventImagePage = () => {
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
            imageContent = <img src={eventImageData[0].image} />;
        } else {
            imageContent = (
                <img src="https://www.anzenviro.com.au/wp-content/uploads/2020/05/orionthemes-placeholder-image-300x200.png" />
            );
        }
    }

    return <div className="container">{imageContent}</div>;
};

export default AddEventImagePage;
