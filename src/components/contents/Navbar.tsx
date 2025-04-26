"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavbarMobile from "./NavbarMobile";
import { clearSession, getSession } from "@/utils/cookies";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Ambil session saat komponen pertama kali dimuat
  useEffect(() => {
    const session = getSession();
    if (session?.token) {
      setIsLoggedIn(true);
      setUserRole(session.role ?? null);
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.reload(); // Reload halaman agar efek langsung terlihat
  };

  // Tentukan Dashboard Berdasarkan Role
  const getDashboardPath = () => {
    if (userRole === "ADMIN") return "/admin";
    if (userRole === "STUDENT") return "/students";
    if (userRole === "PARENT") return "/parents";
    return "/"; // Default jika tidak ada role
  };

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="bg-[#fcce7e] px-6 py-4 shadow-md hidden md:flex">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo dan Nama Sekolah */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/logolagi.png"
                alt="Logo 1"
                width={100}
                height={100}
              />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg font-medium">
                SMA-SMK ADVENT KLABAT MANADO
              </h1>
              <h1 className="text-lg font-medium">SMABAT SETIA</h1>
            </div>
          </div>

          {/* Login/Logout Section */}
          <div className="flex items-center space-x-4">
            <div className="h-6 w-px bg-gray-400"></div>
            {isLoggedIn ? (
              <>
                <Link href={getDashboardPath()}>
                  <Button
                    variant="ghost"
                    className="text-blue-700 text-[16px] font-semibold hover:text-blue-900"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-red-700 text-[16px] font-semibold hover:text-red-900"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-red-700 text-[16px] font-semibold hover:text-red-900"
                >
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Navbar Mobile */}
      <div className="md:hidden">
        <NavbarMobile />
      </div>
    </>
  );
};

export default Navbar;
