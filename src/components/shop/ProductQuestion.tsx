import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const ProductQuestion = ({ productName = "Brake caliper KAMOKA JBC0206" }) => {
    const intl = useIntl();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        comment: "",
    });

    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
        // Reset form
        setFormData({
            name: "",
            email: "",
            comment: "",
        });
    };

    return (
        <section className="product-questions-section">
            <div className="questions-container">
                <div className="questions-layout">
                    {/* Left Column - Information */}
                    <div className="questions-info-column">
                        <div className="questions-intro">
                            <p className="product-reference">
                                <FormattedMessage id="QUESTIONS_TITLE" />
                                <br />
                                <FormattedMessage id="QUESTIONS_PRODUCT_REFERENCE" values={{ productName }} />
                            </p>
                            <p className="support-message">
                                <FormattedMessage id="QUESTIONS_SUPPORT_MESSAGE" />
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="questions-form-column">
                        <form className="questions-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        <FormattedMessage id="FORM_LABEL_NAME" /> *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        <FormattedMessage id="FORM_LABEL_EMAIL" /> *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="comment" className="form-label">
                                    <FormattedMessage id="FORM_LABEL_COMMENT" /> *
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    className="form-textarea"
                                    rows={4}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-button">
                                <FormattedMessage id="BUTTON_SEND" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductQuestion;
