"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AuthLayout from "@/components/layouts/AuthLayout";

const RegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: "admin",
    };

    try {
      console.log("Base URL API", process.env.NEXT_PUBLIC_BASE_URL_API);
      const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.ok) {
        form.reset();
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="Name" name="name" type="text" placeholder="Name" />
        <Input label="Email" name="email" type="email" placeholder="Email" />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
        />

        <Button
          type="submit"
          className="w-full rounded-lg h-10 bg-color-green hover:bg-color-greenhover text-color-primary my-2"
        >
          {isLoading ? "Loading..." : "Register"}
        </Button>
        <p className="text-color-dark font-normal text-[12px] text-center my-1">
          Dengan mendaftar, saya menyetujui Syarat dan Ketentuan serta Kebijakan
          Privasi
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
