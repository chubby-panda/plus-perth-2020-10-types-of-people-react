import React, { useState } from "react";
import { Link } from "react-router-dom";

const PostEventImageForm = ({ eventData }) => {
    const [imageData, setImageData] = useState();
    const [currentImage, setCurrentImage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();

    const handleChange = (e) => {
        setImageData(e.target.files[0]);
        setCurrentImage(URL.createObjectURL(e.target.files[0]));
    };

    const postData = async () => {
        const token = window.localStorage.getItem("token");
        const options = {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "Content-Disposition": `attachment; filename="${imageData.name}"`,
            },
            credentials: "omit",
            body: imageData,
        };
        const url = `${process.env.REACT_APP_API_URL}events/${eventData.id}/images/`;
        const response = await fetch(url, options);

        return response.json();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("One moment please...");
        if (imageData != null) {
            postData().then((response) => {
                console.log(response);
                setSuccessMessage("Successfully uploaded!");
            });
        } else {
            console.log("No image");
            setErrorMessage("Something went wrong");
        }
    };

    return (
        <div id="post-event-image-form">
            <Link to={`/events/${eventData.id}`}>Back to event</Link>
            <form>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        onChange={handleChange}
                        id="image"
                        type="file"
                        accept="image/*"
                    />
                </div>
                <button onClick={handleSubmit} type="submit">
                    Upload image
                </button>
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}
                {errorMessage && <p className="alert">{errorMessage}</p>}
            </form>
            {currentImage && (
                <img className="" src={currentImage} alt="image" />
            )}
        </div>
    );
};

export default PostEventImageForm;
