import React, { useState } from "react";
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

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]); // Store the dropped file
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
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
