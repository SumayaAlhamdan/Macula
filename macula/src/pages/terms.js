import React, { useState } from "react";

const TermsAndConditions = () => {
    // State to track if terms are visible
    const [showTerms, setShowTerms] = useState(false);

    return (
        <div>
            <p style={{ fontSize: "10px" }}>
                By using this platform, you agree to the{" "}
                <span
                    onMouseEnter={() => setShowTerms(true)}
                    onMouseLeave={() => setShowTerms(false)}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                    Terms and Conditions
                </span>
            </p>
            {showTerms && (
                <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px", borderRadius: "4px", backgroundColor: "white" ,fontSize:"12px" ,width:"500px"}}>
                    <h3>Terms and Conditions</h3>
                    <p>
                        Our platform integrates with Learning Management Systems (LMS) and may access student information, including pictures, names, and IDs, provided by universities.
                        We use this information solely for the purpose of face recognition to enhance user experience and security features within our platform.
                        We do not store or retain any pictures of students other than for the purpose of immediate face recognition during the session.
                        We are committed to protecting the privacy and security of student information.
                        All student data accessed or processed by our platform is handled in accordance with applicable data protection laws and regulations.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TermsAndConditions;
