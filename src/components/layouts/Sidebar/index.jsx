"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
    { name: "Addresses", path: "/addresses" },
    { name: "Categories", path: "/categories" },
    { name: "Products", path: "/products" },
    { name: "Transactions", path: "/checkouts" },
    { name: "Cities", path: "/cities" },
    { name: "Courier", path: "/couriers" },
    { name: "Store Profile", path: "/stores" },
  ];

  return (
    <div className="fixed top-0 left-0 h-full bg-color-darkgreen text-color-primary w-64 py-6 px-4 z-20">
      <Link
        href="/"
        className="font-bold text-color-primary hover:text-color-gray-300 text-2xl p-4"
      >
        BabyBoo
      </Link>
      <nav className="mt-8">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`block py-2 px-4 rounded-md ${
                  pathname === item.path
                    ? "bg-color-greenhover"
                    : "hover:bg-color-greenhover"
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
