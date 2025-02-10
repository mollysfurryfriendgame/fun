import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../redux/slices";
import { useAuth0 } from "@auth0/auth0-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function Upload() {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("dog");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [freeUploads, setFreeUploads] = useState(0); // Track remaining uploads

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]); // Store the dropped file
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
      }
    };

    fetchUserProfile();
  }, [getAccessTokenSilently]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (freeUploads <= 0) {
      alert("You have no uploads remaining. Please purchase more uploads.");
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
      const token = await getAccessTokenSilently(); // Get Auth0 access token
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("Upload successful!");
      dispatch(setMessage("New upload created successfully!"));
      setFreeUploads((prev) => prev - 1); // Update the remaining uploads
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
      <p>Remaining Uploads: {freeUploads}</p> {/* Display remaining uploads */}
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
          disabled={freeUploads <= 0} // Disable the button if no uploads remain
        >
          Submit
        </button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
      <button
        onClick={() => dispatch(setMessage("New Message from Upload!"))}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Update Message
      </button>
    </div>
  );
}

export default Upload;
