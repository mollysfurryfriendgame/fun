import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function ReviewUploads() {
  const [uploads, setUploads] = useState([]);
  const [message, setMessage] = useState("");

  // Get access token and user role from Redux or localStorage
  const accessToken = useSelector((state) => state.app.accessToken) || localStorage.getItem("access_token");
  const isSuperUser = useSelector((state) => state.app.isSuperUser) || false; // Ensure this is set from the token

  useEffect(() => {
    if (accessToken) {
      axios
        .get("http://localhost:8000/uploads/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => setUploads(response.data))
        .catch((error) => console.error(error));
    } else {
      console.error("Access token is missing");
    }
  }, [accessToken]);

  const approveUpload = (id) => {
    if (accessToken) {
      axios
        .post(
          `http://localhost:8000/approve-upload/${id}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => setMessage(response.data.detail))
        .catch((error) => setMessage(error.response?.data?.detail || "An error occurred."));
    } else {
      setMessage("Access token is missing.");
    }
  };

  const deleteUpload = (id) => {
    if (accessToken) {
      axios
        .delete(`http://localhost:8000/delete-upload/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          setMessage("Upload deleted successfully.");
          setUploads((prevUploads) => prevUploads.filter((upload) => upload.id !== id)); // Update UI
        })
        .catch((error) => setMessage(error.response?.data?.detail || "An error occurred."));
    } else {
      setMessage("Access token is missing.");
    }
  };

  return (
    <div>
      <h1>Review Uploads</h1>
      {message && <p>{message}</p>}
      {uploads.length === 0 ? (
        <p>No uploads available for review.</p>
      ) : (
        <ul>
          {uploads.map((upload) => (
            <li key={upload.id}>
              <p>
                {upload.name} ({upload.category})
              </p>
              {upload.image && (
                <img
                  src={`http://localhost:8000${upload.image}`}
                  alt={upload.name}
                  style={{ width: "150px", height: "auto" }} // Adjust size as needed
                />
              )}
              <button onClick={() => approveUpload(upload.id)}>Approve</button>
              {isSuperUser && ( // Conditionally render the delete button
                <button onClick={() => deleteUpload(upload.id)} style={{ marginLeft: "10px", color: "red" }}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewUploads;
