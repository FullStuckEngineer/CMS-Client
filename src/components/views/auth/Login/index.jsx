"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { AuthContext } from "@/app/layout";

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target;
    const data = {
      email: form.email.value,
      password: form.password.value,
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setIsLoading(false);
        form.reset();
        sessionStorage.setItem("token", result.accessToken);
        setIsLoggedIn(true);
        router.push('/');
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
      {error && <p>{error}</p>}
    </AuthLayout>
  );
};

export default LoginView;