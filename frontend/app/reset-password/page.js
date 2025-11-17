"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {
  AuthContainer,
  BackToLogin,
  ResetPasswordForm,
  ResetPasswordSuccess,
  InvalidTokenMessage
} from "@/components/auth";

const API_URL = "http://localhost:5001/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthContainer>
        <InvalidTokenMessage />
      </AuthContainer>
    );
  }

  if (success) {
    return (
      <AuthContainer>
        <ResetPasswordSuccess />
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <BackToLogin />
      <ResetPasswordForm
        formData={formData}
        setFormData={setFormData}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </AuthContainer>
  );
}
