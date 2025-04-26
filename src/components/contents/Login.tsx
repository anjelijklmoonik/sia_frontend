"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaLock } from "react-icons/fa";
import { Loader } from "lucide-react";

import { loginAdmin, loginParent, loginStudent } from "@/app/api/auth";
import { setSession } from "@/utils/cookies";

const Login = () => {
  const [role, setRole] = useState<"admin" | "parents" | "students">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (role === "admin") {
        response = await loginAdmin(username, password);
      } else if (role === "parents") {
        response = await loginParent(username, password);
      } else {
        response = await loginStudent(username, password);
      }

      if (response.token) {
        setSession(response.token, response.role);
        toast.success(
          `Login berhasil sebagai ${
            role === "admin"
              ? "Staff"
              : role === "parents"
              ? "Orang Tua"
              : "Siswa"
          }!`
        );
        router.push(`/${role}`);
      } else {
        toast.error(response.message || "Login gagal!");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image
              src="/logolagi.png"
              alt="Logo Sekolah"
              width={150}
              height={150}
              className="cursor-pointer"
            />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Masuk ke Akun{" "}
          {role === "admin"
            ? "Staff"
            : role === "parents"
            ? "Orang Tua"
            : "Siswa"}
        </h2>

        {/* Select Role */}
        <select
          className="w-full mb-4 border rounded-lg p-2"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "admin" | "parents" | "students")
          }
        >
          <option value="admin">Staff</option>
          <option value="students">Siswa</option>
          <option value="parents">Orang Tua</option>
        </select>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin mr-2" size={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import Image from "next/image";
// import Link from "next/link";
// import { FaUser, FaLock } from "react-icons/fa";
// import { Loader } from "lucide-react";

// import { loginUniversal } from "@/app/api/auth"; // fungsi universal login
// import { setSession } from "@/utils/cookies"; // untuk simpan token dan role

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await loginUniversal(username, password);

//       if (response.token && response.role) {
//         setSession(response.token, response.role);
//         toast.success(`Login berhasil sebagai ${response.role}!`);

//         switch (response.role.toLowerCase()) {
//           case "admin":
//             router.push("/admin");
//             break;
//           case "parents":
//             router.push("/parents");
//             break;
//           case "students":
//             router.push("/students");
//             break;
//           default:
//             router.push("/");
//         }
//       } else {
//         toast.error(response.message || "Login gagal!");
//       }
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Terjadi kesalahan saat login."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Toaster position="top-right" reverseOrder={false} />

//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
//         <div className="flex justify-center mb-4">
//           <Link href="/">
//             <Image
//               src="/logolagi.png"
//               alt="Logo Sekolah"
//               width={150}
//               height={150}
//               className="cursor-pointer"
//             />
//           </Link>
//         </div>

//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
//           Masuk ke Akun
//         </h2>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div className="relative">
//             <FaUser className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Username"
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               disabled={loading}
//               required
//             />
//           </div>

//           <div className="relative">
//             <FaLock className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold flex justify-center items-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <Loader className="animate-spin mr-2" size={20} />
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
