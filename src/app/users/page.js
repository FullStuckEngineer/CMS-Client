"use client";

import React, { useState } from "react";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";

const userData = [
  { id: 1, email: "user1@example.com", name: "User One", role: "Admin", phone_number: "123-456-7890" },
  { id: 2, email: "user2@example.com", name: "User Two", role: "User", phone_number: "123-456-7891" },
  // Add more users as needed
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const filteredUsers = userData.filter(user => {
    if (filterRole && user.role !== filterRole) return false;
    if (searchTerm && !Object.values(user).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="flex">
        <main className="p-4 mt-16">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-2 rounded ml-2"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">User</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Role</th>
                  <th className="px-4 py-2 border-b">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border-b">{user.id}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">{user.name}</td>
                    <td className="px-4 py-2 border-b">{user.role}</td>
                    <td className="px-4 py-2 border-b">{user.phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
  );
};

export default UsersPage;