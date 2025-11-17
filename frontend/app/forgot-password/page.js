"use client";

import { useState } from "react";
import axios from "axios";
import { 
  AuthContainer, 
  BackToLogin, 
  ForgotPasswordForm, 
  ForgotPasswordSuccess 
} from "@/components/auth";

const API_URL = "http://localhost:5001/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim email reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      {success ? (
        <ForgotPasswordSuccess email={email} />
      ) : (
        <>
          <BackToLogin />
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </AuthContainer>
  );
}
