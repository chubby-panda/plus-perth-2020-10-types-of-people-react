import React from "react";
import { useHistory, useParams } from "react-router-dom";

function DeleteEventForm(props) {
  const history = useHistory();
  const { id } = useParams();

  const editData = async () => {
    let token = window.localStorage.getItem("token");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}events/${id}/`,
      {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    // return response.json();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit pressed");
    editData().then((response) => {
      //   window.localStorage.removeItem("title", credentials.title);
      // console.log("set local storage");
      history.push("/");
      //   window.location.reload();
    });
  };
  return (
    <div>
      <p>Are you sure you want to delete Event {id}? </p>
      <button className="btn" type="submit" onClick={handleSubmit}>
        Delete Event
      </button>
    </div>
  );
}

export default DeleteEventForm;