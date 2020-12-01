import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const UpdateEventImageForm = ({ eventData, eventImageData }) => {
    const [successMessage, setSuccessMessage] = useState();
    const [currentImage, setCurrentImage] = useState();
    const [imageFile, setImageFile] = useState();
    const token = window.localStorage.getItem("token");
    const history = useHistory();

    useEffect(() => {
        setCurrentImage(eventImageData[0].image);
    }, [eventImageData]);

    const handleChange = (e) => {
        setCurrentImage(URL.createObjectURL(e.target.files[0]));
        setImageFile(e.target.files[0]);
    };

    const postData = async () => {
        const options = {
            method: "PUT",
            headers: {
                "Content-Disposition": `attachment; filename=${imageFile.name}`,
                Authorization: `Token ${token}`,
            },
            credentials: "omit",
            body: imageFile,
        };
        const url = `${process.env.REACT_APP_API_URL}events/${eventData.id}/images/${eventImageData[0].id}/`;
        const response = await fetch(url, options);
        return response.json();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("One moment please...");
        if (imageFile != null) {
            postData().then((response) => {
                setSuccessMessage("Successfully updated");
            });
        }
    };

    return (
        <div id="update-event-image-form">
            <form>
                <div className="form-input">
                    <label htmlFor="image">Image</label>
                    <input
                        onChange={handleChange}
                        type="file"
                        accept="image/*"
                        id="image"
                    />
                </div>
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}
                <button type="submit" onClick={handleSubmit}>
                    Update Image
                </button>
            </form>
            <img src={currentImage} alt="image" />
        </div>
    );
};

export default UpdateEventImageForm;
