"use client";
import dotenv from 'dotenv';
dotenv.config();

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);
}