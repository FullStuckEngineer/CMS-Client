"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import profilPlaceholder from "@/assets/images/profile-placeholder.jpg";
import { SignOut } from "@phosphor-icons/react";
import { AuthContext } from "@/app/layout";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:px-10 px-2 bg-white z-10 navbar-border w-full shadow-md">
      {isLoggedIn ? (
        <div className="flex md:flex-row flex-col justify-end md:items-center p-4 gap-2">
          <div className="flex md:flex-row flex-col justify-left md:items-center md:gap-8 gap-4">
            <div className="flex sm:flex-row justify-between items-center md:items-center gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={profilPlaceholder}
                  alt="User"
                  className="rounded-full w-10 h-10"
                  width={40}
                  height={40}
                />
                <span className="font-bold text-green">John Doe</span>
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
            href="/auth/login"
            className="font-bold text-color-green hover:text-color-greenhover text-2xl"
          >
            BabyBoo
          </Link>
          <div className="flex md:flex-row flex-col justify-left md:items-center md:gap-8 gap-4">
            <Link href="/auth/login">
              <Button className="border border-green hover:border-greenhover text-green rounded-lg h-10 md:w-32 w-40">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40">
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;