"use client";

import { useState } from 'react';
import Layout from "../../components/Layout";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleBadgeSubmit = async () => {
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/submitBadge', { method: 'POST' });
      // First read the response as text then parse if possible.
      const text = await response.text();
      let data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        // Convert the error object to a string for display.
        setMessage(`Error: ${JSON.stringify(data.error) || 'Submission failed.'}`);
      } else {
        setMessage('Badge submitted successfully!');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div>
        <h1>Contact</h1>
        <p>Contact Us</p>
      </div>
    </Layout>
  );
}
