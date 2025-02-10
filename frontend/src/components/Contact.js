import React, { useState } from "react";

const Contact = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // To capture email for unauthenticated users
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !message || !email) {
      setResponseMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          email,
        }),
      });

      if (response.ok) {
        setResponseMessage("Your message has been sent successfully!");
        setTitle("");
        setMessage("");
        setEmail("");
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error: ${errorData.error || "Something went wrong."}`);
      }
    } catch (error) {
      setResponseMessage("An error occurred while sending your message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email: (the one you used to signup if applicable)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={!email} // Required only for unauthenticated users
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Submit
        </button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Contact;
