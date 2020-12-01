import React, { useState } from "react";

const PostEventImageForm = ({ eventData }) => {
    const [imageData, setImageData] = useState();

    const handleChange = (e) => {
        setImageData(e.target.files[0]);
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
        if (imageData != null) {
            postData().then((response) => {
                console.log(response);
            });
        } else {
            console.log("No image");
        }
    };

    return (
        <div id="post-event-image-form">
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
            </form>
        </div>
    );
};

export default PostEventImageForm;
