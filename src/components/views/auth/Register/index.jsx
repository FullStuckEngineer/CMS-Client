"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/layouts/AuthLayout";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

const RegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    const form = event.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: "admin",
    };

    try {
      console.log("Base URL API", process.env.NEXT_PUBLIC_BASE_URL_API);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (result.ok) {
        form.reset();
        setSuccessMessage(
          result.data.message || "Login successful. Redirecting..."
        );
        router.push("/auth/login");
      } else {
        setIsLoading(false);
        setError("Email is already registered");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <AuthLayout
      title="Register"
      link="/auth/login"
      linkText="Sudah punya akun? "
      linkName="Login"
    >
      {successMessage && (
        <p className="flex gap-2 items-center border border-color-green rounded-md p-3 mb-5 text-color-green text-xs bg-color-green bg-opacity-10">
          <CheckCircle size={20} />
          {successMessage}
        </p>
      )}
      {error && (
        <p className="flex gap-2 items-center border rounded-md border-color-red p-3 mb-5 text-color-red text-xs bg-color-red bg-opacity-10">
          <XCircle size={20} /> {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="Name" name="name" type="text" placeholder="Name" />
        <Input label="Email" name="email" type="email" placeholder="Email" />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
        />

        {isLoading ? (
          <Button
            disabled
            type="button"
            className="w-full rounded-lg h-10 bg-color-green hover:bg-color-greenhover text-color-primary"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full rounded-lg h-10 bg-color-green hover:bg-color-greenhover text-color-primary"
          >
            Register
          </Button>
        )}
        <p className="text-color-dark font-normal text-[12px] text-center my-1">
          Dengan mendaftar, saya menyetujui Syarat dan Ketentuan serta Kebijakan
          Privasi
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
