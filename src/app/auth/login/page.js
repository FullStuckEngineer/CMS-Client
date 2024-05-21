"use client";
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/layout";
import LoginView from "@/components/views/auth/Login";;

const LoginPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
      if (isLoggedIn) {
          router.push("/dashboard");
      }
  }, [isLoggedIn, router]);

  return (
    <div>
      <LoginView />
    </div>
  );
};

export default LoginPage;