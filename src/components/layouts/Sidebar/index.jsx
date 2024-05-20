"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Categories", path: "/categories" },
    { name: "Products", path: "/products" },
    { name: "Transactions", path: "/transactions" },
    { name: "Cities", path: "/cities" },
    { name: "Courier", path: "/courier" },
    { name: "Store Profile", path: "/store" },
  ];

  return (
    <div className="fixed top-0 left-0 h-full bg-green text-white w-64 py-6 px-4 z-20">
      <Link
        href="/"
        className="font-bold text-white hover:text-grey text-2xl p-4"
      >
        BabyBoo
      </Link>
      <nav className="mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}
                className={`block py-2 px-4 rounded-md ${
                  router.pathname === item.path
                    ? "bg-greenhover"
                    : "hover:bg-greenhover"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;