"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import profilPlaceholder from "@/assets/images/profile-placeholder.jpg";
import { SignOut } from "@phosphor-icons/react";
import { AuthContext } from "@/app/layout";
import axios from "axios";
import jwtDecode from "jwt-decode";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState("Admin");
  const [userImage, setUserImage] = useState(profilPlaceholder);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = response.data.data;

        setUserName(userData.name ? userData.name : "Admin");
        setUserImage(
          userData.photo
            ? `${process.env.NEXT_PUBLIC_BACKEND_PATH}/${userData.photo}`
            : profilPlaceholder
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message || error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  const isAuthRoute = pathname.startsWith("/auth");

  return (
    <header className="fixed top-0 left-0 right-0 md:px-20 px-2 bg-color-primary z-10 navbar-border w-full shadow-md">
      {isLoggedIn ? (
        <div className="flex md:flex-row flex-col justify-end md:items-center p-4 gap-2">
          <div className="flex md:flex-row flex-col justify-left md:items-center md:gap-8 gap-4">
            <div className="flex sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={userImage}
                  alt="User"
                  className="rounded-full w-10 h-10"
                  width={40}
                  height={40}
                />
                <span className="font-bold text-color-green">{userName}</span>
              </div>
              <Button
                onClick={handleSignOut}
                className="text-green rounded-lg h-10"
              >
                <SignOut className="w-10 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col justify-between md:items-center p-4 gap-2">
          <Link
            href="/"
            className="font-bold text-color-green hover:text-color-greenhover text-2xl"
          >
            BabyBoo
          </Link>
          {!isAuthRoute && (
            <div className="flex md:flex-row flex-col justify-left md:items-center md:gap-8 gap-4">
              <Link href="/auth/login">
                <Button className="border border-color-green hover:border-color-greenhover hover:text-color-greenhover text-color-green rounded-lg h-10 md:w-32 w-40">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-32 w-40">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
