// react
import React, { useState } from 'react';
// third-party
import { FormattedMessage, useIntl } from 'react-intl';

function BlockNewsletter() {
    const intl = useIntl();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setMessage({
                type: 'error',
                text: intl.formatMessage({ id: 'ERROR_EMAIL_REQUIRED' }),
            });
            return;
        }

        setLoading(true);
        setMessage(null);

        // Simulate API call
        setTimeout(() => {
            setMessage({
                type: 'success',
                text: intl.formatMessage({ id: 'SUCCESS_NEWSLETTER_SUBSCRIBED' }),
            });
            setEmail('');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="block-newsletter">
            <div className="block-newsletter__overlay" />
            <div className="block-newsletter__inner">
                <div className="container">
                    <div className="block-newsletter__content">
                        <h2 className="block-newsletter__title">
                            <FormattedMessage id="HEADER_NEWSLETTER" />
                        </h2>
                        <p className="block-newsletter__subtitle">
                            <FormattedMessage id="TEXT_NEWSLETTER_SUBTITLE" />
                        </p>
                        <form className="block-newsletter__form" onSubmit={handleSubmit}>
                            <div className="block-newsletter__form-inner">
                                <input
                                    type="email"
                                    className="block-newsletter__input"
                                    placeholder={intl.formatMessage({ id: 'INPUT_EMAIL_PLACEHOLDER' })}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className="block-newsletter__button"
                                    disabled={loading}
                                >
                                    <FormattedMessage id="BUTTON_SUBSCRIBE" />
                                </button>
                            </div>
                            {message && (
                                <div className={`block-newsletter__message block-newsletter__message--${message.type}`}>
                                    {message.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlockNewsletter;

