"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import AuthLayout from "@/components/layouts/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const { push, query } = useRouter();

  // const callbackUrl = query.callbackUrl || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target;
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email.value,
        role: form.role.value,
        password: form.password.value,
        callbackUrl,
      });
      if (!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError("Email or password is incorrect");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Email or password is incorrect");
    }
  };

  return (
    <AuthLayout
      title="Login"
      link="/auth/register"
      linkText=" Belum punya akun? "
      linkName=" Register"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input label="Email" name="email" type="email" placeholder="Email" />
        <Input label="Role" name="role" type="text" placeholder="Role" />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
        />
        <Button
          type="submit"
          className="w-full rounded-lg h-10 bg-color-green hover:bg-color-greenhover text-color-primary mt-2 mb-8"
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginView;
