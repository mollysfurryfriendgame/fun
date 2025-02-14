import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/slices";
import { useAuth0 } from "@auth0/auth0-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Link } from "react-router-dom"; // Ensure Link is imported

function Upload() {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("dog");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [freeUploads, setFreeUploads] = useState(null); // Change default from 0 to null
  const [loading, setLoading] = useState(true); // Track API loading state
  const [showModal, setShowModal] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Fetch user profile and remaining uploads when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get("http://localhost:8000/userprofile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFreeUploads(response.data.profile.free_uploads_remaining);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false); // Mark API call as finished
      }
    };

    fetchUserProfile();
  }, [getAccessTokenSilently]);

  // Show the modal only after API data is loaded
  useEffect(() => {
    if (!loading && freeUploads === 0) {
      setShowModal(true);
    }
  }, [freeUploads, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (freeUploads <= 0) {
      alert("You have no uploads remaining. Please request more uploads via Contact.");
      return;
    }

    if (!file) {
      alert("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("image", file);
    formData.append("description", description);

    try {
      const token = await getAccessTokenSilently();
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("Upload successful!");
      dispatch(setMessage("New upload created successfully!"));
      setFreeUploads((prev) => prev - 1);
      console.log("Upload successful:", response.data);
    } catch (error) {
      setUploadStatus("Upload failed.");
      console.error("Error uploading file:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload</h1>
      <h2>Welcome, {user.nickname}!</h2>

      {loading ? (
        <p>Loading uploads...</p>
      ) : (
        <p>Remaining Uploads: {freeUploads}</p> // Display once loaded
      )}

      <div {...getRootProps()} style={{ border: "1px dashed #ccc", padding: "20px", marginBottom: "20px" }}>
        <input {...getInputProps()} />
        <label>Image:</label>
        <p>Drag and drop a file here, or click to select a file</p>
      </div>
      {file && <p>Selected file: {file.name}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="horse">Horse</option>
            <option value="bunbun">Bunbun</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          ></textarea>
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px", cursor: "pointer" }}
          disabled={freeUploads <= 0}
        >
          Submit
        </button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}

      {/* Modal Popup */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "400px",
          }}>
            <h2>You've Reached Your Monthly Limit</h2>
            <p>
              Send us a message in the <Link to="/contact">Contact</Link> page about your experience.
            </p>
            <p>
              Include in the Title: "More Uploads" along with the E-mail address you used to sign up.
            </p>
            <p>5 more uploads are free, but must be requested through Contact.</p>
            <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", marginTop: "10px", cursor: "pointer" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
