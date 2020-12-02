import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "./PostEventForm.css";

const PostEventForm = () => {
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [locationData, setLocationData] = useState({
        latitude: null,
        longitude: null,
        event_location: "",
    });
    const [categoryData, setCategoryData] = useState([]);
    const history = useHistory();

    const category_option = categoryData.map((category) => category.category);
    const updateCat = (newCat) => {
        setEventData({ ...eventData, categories: newCat });
    };

    useEffect(() => {
        // Fetch categories to prefill category select
        fetch(`${process.env.REACT_APP_API_URL}events/categories/`)
            .then((results) => {
                return results.json();
            })
            .then((data) => {
                setCategoryData(data);
            });
    }, []);

    const [eventData, setEventData] = useState({
        event_name: "",
        event_description: "",
        event_datetime_start: "",
        event_datetime_end: "",
        categories: [],
    });

    // Unpacking the data from usePlacesAutocomplete library
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    // Handling input for location
    const handleInput = (e) => {
        setValue(e.target.value);
    };

    // Setting state as the user selects a suggestion
    const handleSelect = ({ description }) => () => {
        setValue(description, false);
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({ address: description })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setLocationData({
                    latitude: lat,
                    longitude: lng,
                    event_location: description,
                });
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    };

    // Rendering the suggestions from the api as input changes
    const renderSuggestions = () =>
        data.map((suggestion) => {
            // Unpack suggestion
            const {
                id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            // Render list of suggestions
            return (
                <li key={id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setEventData((prevEventData) => ({
            ...prevEventData,
            [id]: value,
        }));
    };

    const postData = async () => {
        let token = window.localStorage.getItem("token");
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}events/`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    event_name: eventData.event_name,
                    event_description: eventData.event_description,
                    event_image:
                        "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png",
                    date_created: new Date().toISOString(),
                    event_location: locationData.event_location,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    categories: eventData.categories,
                    event_datetime_start: eventData.event_datetime_start,
                    event_datetime_end: eventData.event_datetime_end,
                }),
            }
        );
        const data = await response.json();
        return {
            ok: response.ok,
            ...data,
        };
    };
    console.log(eventData);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit pressed");
        // console.log(eventData);
        if (
            eventData.event_name &&
            eventData.event_description &&
            locationData.event_location &&
            eventData.categories &&
            eventData.event_datetime_start &&
            eventData.event_datetime_end &&
            locationData.latitude &&
            locationData.longitude
        ) {
            postData().then((response) => {
                // console.log(response);
                if (response.ok) {
                    setSuccessMessage("Event created");
                    setErrorMessage(null);
                    //   history.push(`/`);
                    history.push(`/events/${response.id}`);
                } else {
                    if (
                        response.event_description !== undefined &&
                        response.event_description[0] ===
                            "Ensure this field has no more than 500 characters."
                    ) {
                        setErrorMessage(response.event_description[0]);
                    } else {
                        setErrorMessage("Something went wrong");
                    }
                }
            });
        } else {
            setErrorMessage("Please fill out all fields");
        }
    };

    return (
        <form className="form">
            <div className="form-item">
                <label htmlFor="">Event Name</label>
                <input type="text" id="event_name" onChange={handleChange} />
            </div>
            <div className="form-item">
                <label htmlFor="">More details</label>
                <textarea
                    type="description"
                    id="event_description"
                    onChange={handleChange}
                    maxLength="500"
                />
            </div>
            <div className="form-item">
                <label htmlFor="event_datetime_start">Starts</label>
                <input
                    type="datetime-local"
                    id="event_datetime_start"
                    onChange={handleChange}
                />
            </div>
            <div className="form-item">
                <label htmlFor="event_datetime_end">Ends</label>
                <input
                    type="datetime-local"
                    id="event_datetime_end"
                    onChange={handleChange}
                />
            </div>
            <div className="form-item">
                <label htmlFor="event_location">Event location</label>
                <input
                    id="event_location"
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Where will the event take place?"
                />
            </div>
            {status === "OK" && (
                <div className="form-item">
                    <label></label>
                    <ul className="location-options">{renderSuggestions()}</ul>
                </div>
            )}
            <div className="form-item">
                <Fragment>
                    <div className="category-item-container">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Coding skills needed</Form.Label>
                            {/* <label htmlFor="">Category</label> */}
                            <Typeahead
                                id="categories"
                                labelKey="categories"
                                multiple
                                onChange={updateCat}
                                options={category_option}
                                placeholder="Choose skills..."
                                selected={eventData.categories}
                            />
                        </Form.Group>
                    </div>
                </Fragment>
            </div>
            {errorMessage && <p className="alert">{errorMessage}</p>}
            {successMessage && (
                <p className="success-message">{successMessage}</p>
            )}
            <button className="btn" type="submit" onClick={handleSubmit}>
                Post Event
            </button>
        </form>
    );
};

export default PostEventForm;
