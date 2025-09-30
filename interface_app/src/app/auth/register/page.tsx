"use client";

import RegisterForm from "@/components/RegisterForm";
import React from "react";

const RegisterPage = () => {
  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
