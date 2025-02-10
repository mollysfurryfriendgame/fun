import React from "react";

const DonateButton = ({ buttonId = "K6KGBE9F5HNM6", width = 600, height = 800 }) => {
    const handleDonateClick = () => {
        window.open(
            `https://www.paypal.com/donate?hosted_button_id=${buttonId}`,
            "_blank",
            `width=${width},height=${height}`
        );
    };

    return (
        <button
            onClick={handleDonateClick}
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
            }}
        >
            <img
                src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
                alt="Donate with PayPal button"
                title="PayPal - The safer, easier way to pay online!"
            />
        </button>
    );
};

export default DonateButton;
