"use client";
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/layout";
import RegisterView from "@/components/views/auth/Register";

const RegisterPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      if (isLoggedIn) {
          router.push("/dashboard");
      }
  }, [isLoggedIn, router]);

  return (
    <>
      <RegisterView />
    </>
  );
};

export default RegisterPage;
