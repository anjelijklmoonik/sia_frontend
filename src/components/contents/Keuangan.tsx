// "use client";

// import { useState, useEffect } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { searchStudent, getKeuangan, postKeuangan } from "@/app/api/admin";
// import { Loader } from "lucide-react";

// interface Siswa {
//   id: number;
//   nama: string;
//   noIndukSiswa: string;
// }

// interface Keuangan {
//   id?: number;
//   studentProfilId: number;
//   keterangan: string;
//   tanggal: string;
//   jumlah: number;
//   namaSiswa?: string;
// }

// export default function ManajemenKeuangan() {
//   const [nisInput, setNisInput] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState<Siswa | null>(null);
//   const [searchResults, setSearchResults] = useState<Siswa[]>([]);
//   const [form, setForm] = useState<Omit<Keuangan, "id" | "namaSiswa">>({
//     amount: 0,
//     referensi: "",
//     noJurnal: "",
//     type: "DEBIT",
//     deskripsi: "",
//     transDate: "",
//     keuanganId: undefined,
//   });
//   const [loading, setLoading] = useState(false);
//   const [financeList, setFinanceList] = useState<Keuangan[]>([]);

//   useEffect(() => {
//     fetchFinanceData();
//   }, []);

//   const fetchFinanceData = async () => {
//     const data = await getKeuangan();
//     setFinanceList(data || []);
//   };

//   const handleSearchStudent = async () => {
//     if (!nisInput.trim()) {
//       toast.error("❌ Masukkan Nomor Induk Siswa (NIS)!");
//       return;
//     }

//     setSearchLoading(true);
//     try {
//       const data = await searchStudent(nisInput);
//       if (data && data.length > 0) {
//         setSearchResults(data);
//         if (data.length === 1) {
//           handleSelectStudent(data[0]);
//         }
//       } else {
//         toast.error("❌ Siswa tidak ditemukan!");
//         setSearchResults([]);
//       }
//     } catch (error) {
//       console.error("Gagal mencari siswa:", error);
//       toast.error("❌ Terjadi kesalahan saat mencari siswa.");
//       setSearchResults([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleSelectStudent = (student: Siswa) => {
//     setSelectedStudent(student);
//     setForm((prev) => ({
//       ...prev,
//       studentProfilId: student.id,
//     }));
//     setSearchResults([]);
//     toast.success(`✅ Siswa ${student.nama} dipilih!`);
//   };

//   const handleNisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNisInput(e.target.value);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: name === "jumlah" ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.deskripsi || !form.transDate || form.amount <= 0) {
//       toast.error("❌ Semua kolom wajib diisi!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formattedDate = new Date(
//         form.tanggal + "T00:00:00.000Z"
//       ).toISOString();

//       const payload = {
//         ...form,
//         tanggal: formattedDate,
//       };

//       await postKeuangan(payload);
//       toast.success("✅ Transaksi berhasil ditambahkan!");
//       fetchFinanceData();

//       // Reset form
//       setForm({
//         amount: 0,
//         referensi: "",
//         noJurnal: "",
//         type: "DEBIT",
//         deskripsi: "",
//         transDate: "",
//       });
//       setSelectedStudent(null);
//       setNisInput("");
//     } catch (error) {
//       console.error("Gagal tambah transaksi:", error);
//       toast.error("❌ Gagal menambahkan transaksi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <Toaster position="top-right" />
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold mb-4">Manajemen Keuangan Siswa</h1>

//         {/* 🔍 Cari Siswa */}
//         <div className="mb-6 bg-yellow-50 p-4 rounded border border-yellow-200">
//           <h2 className="text-lg font-semibold mb-2">
//             Cari Siswa Berdasarkan NIS
//           </h2>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               value={nisInput}
//               onChange={handleNisChange}
//               placeholder="Masukkan NIS"
//               className="flex-1 border p-2 rounded"
//             />
//             <button
//               onClick={handleSearchStudent}
//               disabled={searchLoading}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
//             >
//               {searchLoading ? "Mencari..." : "Cari"}
//             </button>
//           </div>

//           {searchResults.length > 0 && (
//             <div className="mt-2 bg-white border rounded p-2 max-h-40 overflow-y-auto">
//               {searchResults.map((siswa) => (
//                 <div key={siswa.id} className="mb-1">
//                   <button
//                     onClick={() => handleSelectStudent(siswa)}
//                     className="w-full text-left p-1 hover:bg-gray-100 rounded"
//                   >
//                     {siswa.nama} (NIS: {siswa.noIndukSiswa})
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {selectedStudent && (
//             <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
//               <p className="text-sm">
//                 Siswa Terpilih: <strong>{selectedStudent.nama}</strong> (NIS:{" "}
//                 {selectedStudent.noIndukSiswa})
//               </p>
//             </div>
//           )}
//         </div>

//         {/* 🧾 Form Tambah Transaksi */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
//         >
//           <div>
//             <label className="text-gray-700 font-semibold">Tanggal:</label>
//             <input
//               type="date"
//               name="transDate"
//               value={form.transDate}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="text-gray-700 font-semibold">Deskripsi:</label>
//             <textarea
//               name="deskripsi"
//               value={form.deskripsi}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="text-gray-700 font-semibold">Jumlah (Rp):</label>
//             <input
//               type="number"
//               name="amount"
//               value={form.amount || ""}
//               onChange={handleChange}
//               min="1" // Mencegah nilai 0 atau negatif
//               className="w-full p-2 border rounded-md"
//               placeholder="Masukkan jumlah"
//               onKeyDown={(e) => {
//                 if (e.key === "-" || e.key === "e") {
//                   e.preventDefault(); // Mencegah input angka negatif dan huruf eksponensial
//                 }
//               }}
//             />
//           </div>

//           <div>
//             <label className="text-gray-700 font-semibold">Tipe:</label>
//             <select
//               name="type"
//               value={form.type}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="DEBIT">DEBIT</option>
//               <option value="KREDIT">KREDIT</option>
//             </select>
//           </div>

//           <div>
//             <label className="text-gray-700 font-semibold">Referensi:</label>
//             <input
//               type="text"
//               name="referensi"
//               value={form.referensi}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div>
//             <label className="text-gray-700 font-semibold">No Jurnal:</label>
//             <input
//               type="text"
//               name="noJurnal"
//               value={form.noJurnal}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>
//           <div className="flex justify-center md:col-span-2">
//             <button
//               type="submit"
//               className={`bg-yellow-500 text-white px-4 py-2 rounded-lg font
//     hover:bg-yellow-600 transition flex items-center justify-center gap-2 ${
//       loading ? "opacity-50 cursor-not-allowed" : ""
//     }`}
//               disabled={loading} // ✅ Mencegah klik saat loading
//             >
//               {loading ? (
//                 <Loader className="animate-spin w-5 h-5" />
//               ) : (
//                 "Tambah Transaksi"
//               )}
//             </button>
//           </div>
//         </form>

//         {/* 📊 Tabel Data Transaksi */}
//         <div>
//           <h2 className="text-lg font-semibold mb-2">
//             Daftar Transaksi Keuangan
//           </h2>
//           <table className="w-full bg-gray-50 border rounded shadow">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="p-2 text-left">Nama Siswa</th>
//                 <th className="p-2 text-left">Keterangan</th>
//                 <th className="p-2 text-left">Tanggal</th>
//                 <th className="p-2 text-left">Jumlah</th>
//               </tr>
//             </thead>
//             <tbody>
//               {financeList.length > 0 ? (
//                 financeList.map((item) => (
//                   <tr key={item.id} className="border-t">
//                     <td className="p-2">
//                       {item.namaSiswa || "Tidak diketahui"}
//                     </td>
//                     <td className="p-2">{item.keterangan}</td>
//                     <td className="p-2">
//                       {new Date(item.tanggal).toLocaleDateString("id-ID")}
//                     </td>
//                     <td className="p-2">
//                       Rp {item.jumlah.toLocaleString("id-ID")}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center text-gray-500 p-4">
//                     Belum ada data transaksi
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { getAllStudents, getKeuangan, postKeuangan } from "@/app/api/admin";
import { toast, Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

interface TransaksiKeuangan {
  id?: number;
  amount: number;
  referensi: string;
  noJurnal: string;
  type: string;
  deskripsi: string;
  transDate: string;
  keuanganId?: number; // Tambahkan di sini
}

interface Siswa {
  id: number;
  nama: string;
  Keuangan: {
    id: number;
  };
}

export default function Keuangan() {
  const [transaksi, setTransaksi] = useState<TransaksiKeuangan[]>([]);
  const [students, setStudents] = useState<Siswa[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [keuanganId, setKeuanganId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [newTransaksi, setNewTransaksi] = useState<TransaksiKeuangan>({
    amount: 0,
    referensi: "",
    noJurnal: "",
    type: "DEBIT",
    deskripsi: "",
    transDate: "",
    keuanganId: undefined,
  });

  useEffect(() => {
    fetchStudents(); // Fetch daftar siswa saat halaman dimuat
    fetchTransaksi(); // Fetch riwayat transaksi
  }, []);

  const fetchStudents = async () => {
    let allStudents: Siswa[] = []; // Initialize an empty array to store all students
    let currentPage = 1;
    const totalPages = 2; // Get this value dynamically from your API response, or set a default

    try {
      // Loop through all pages until we fetch all students
      while (currentPage <= totalPages) {
        const data = await getAllStudents(currentPage); // Fetch data for the current page
        if (Array.isArray(data?.data)) {
          allStudents = [...allStudents, ...data?.data]; // Append new students to the array
        }
        currentPage += 1; // Move to the next page
      }

      setStudents(allStudents); // Set all students to the state
    } catch (error) {
      console.error("❌ Gagal mengambil data siswa:", error);
      setStudents([]);
    }
  };

  // 🔹 Fetch Riwayat Transaksi Keuangan dari Backend
  const fetchTransaksi = async () => {
    try {
      const data = await getKeuangan();
      setTransaksi(data || []);
    } catch (error) {
      console.error("❌ Gagal mengambil data transaksi:", error);
    }
  };

  // 🔹 Handle Perubahan Input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTransaksi((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;

    if (!studentId) {
      setSelectedStudent(null);
      setKeuanganId(null);
      return;
    }

    const student = students.find((s) => s.id.toString() === studentId);

    console.log("📌 Student Selected:", student);
    console.log("📌 Keuangan ID:", student?.Keuangan?.id);

    if (student && student.Keuangan) {
      setSelectedStudent(studentId);
      setKeuanganId(student.Keuangan.id);
    } else {
      setKeuanganId(null);
      toast.error("Siswa ini belum memiliki data keuangan!");
    }
  };

  // 🔹 Kirim Data Keuangan ke Backend
  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !keuanganId) {
      toast.error("Harap pilih siswa yang memiliki data keuangan!");
      return;
    }

    if (
      !newTransaksi.deskripsi ||
      !newTransaksi.transDate ||
      newTransaksi.amount <= 0
    ) {
      toast.error("Harap isi semua data transaksi dengan benar!");
      return;
    }

    setLoading(true); // ✅ Mulai loading
    try {
      // 🕒 Konversi `transDate` ke format `YYYY-MM-DDTHH:mm:ss.SSSZ`
      const formattedDate = new Date(
        newTransaksi.transDate + "T11:00:00.000Z"
      ).toISOString();

      const transaksiData = {
        keuanganId,
        amount: newTransaksi.amount,
        referensi: newTransaksi.referensi || "-",
        noJurnal: newTransaksi.noJurnal || "-",
        type: newTransaksi.type,
        deskripsi: newTransaksi.deskripsi,
        transDate: formattedDate, // ✅ Gunakan format ISO
      };

      console.log("📤 Mengirim transaksi:", transaksiData);
      const response = await postKeuangan(transaksiData);
      console.log("✅ Transaksi Berhasil:", response);

      fetchTransaksi(); // 🔹 Perbarui daftar transaksi setelah submit

      // Reset Form
      setNewTransaksi({
        amount: 0,
        referensi: "",
        noJurnal: "",
        type: "DEBIT",
        deskripsi: "",
        transDate: "",
      });

      toast.success("Transaksi berhasil ditambahkan!");
    } catch (error) {
      console.error("❌ Gagal menambahkan transaksi:", error);
      toast.error("Terjadi kesalahan saat menambahkan transaksi.");
    } finally {
      setLoading(false); // ✅ Selesai loading
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Manajemen Keuangan
        </h1>
        <div>
          <label className="text-gray-700 font-semibold">Pilih Siswa:</label>
          <select
            name="studentId"
            onChange={handleStudentChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Pilih Siswa --</option>
            {students.length > 0 ? (
              students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.nama}
                </option>
              ))
            ) : (
              <option disabled>Data siswa tidak tersedia</option>
            )}
          </select>
        </div>
        {/* Form Tambah Transaksi */}
        <form
          onSubmit={submitTransaction}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label className="text-gray-700 font-semibold">Tanggal:</label>
            <input
              type="date"
              name="transDate"
              value={newTransaksi.transDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Deskripsi:</label>
            <textarea
              name="deskripsi"
              value={newTransaksi.deskripsi}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Jumlah (Rp):</label>
            <input
              type="number"
              name="amount"
              value={newTransaksi.amount || ""}
              onChange={handleChange}
              min="1" // Mencegah nilai 0 atau negatif
              className="w-full p-2 border rounded-md"
              placeholder="Masukkan jumlah"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault(); // Mencegah input angka negatif dan huruf eksponensial
                }
              }}
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Tipe:</label>
            <select
              name="type"
              value={newTransaksi.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="DEBIT">DEBIT</option>
              <option value="KREDIT">KREDIT</option>
            </select>
          </div>

          <div>
            <label className="text-gray-700 font-semibold">Referensi:</label>
            <input
              type="text"
              name="referensi"
              value={newTransaksi.referensi}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold">No Jurnal:</label>
            <input
              type="text"
              name="noJurnal"
              value={newTransaksi.noJurnal}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-center md:col-span-2">
            <button
              type="submit"
              className={`bg-yellow-500 text-white px-4 py-2 rounded-lg font
    hover:bg-yellow-600 transition flex items-center justify-center gap-2 ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
              disabled={loading} // ✅ Mencegah klik saat loading
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                "Tambah Transaksi"
              )}
            </button>
          </div>
        </form>

        {/* Tabel Keuangan */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Riwayat Transaksi
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Tanggal</th>
                <th className="border border-gray-300 px-4 py-2">Deskripsi</th>
                <th className="border border-gray-300 px-4 py-2">Tipe</th>
                <th className="border border-gray-300 px-4 py-2">
                  Jumlah (Rp)
                </th>
                <th className="border border-gray-300 px-4 py-2">Referensi</th>
                <th className="border border-gray-300 px-4 py-2">No Jurnal</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border border-gray-300"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(item.transDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.deskripsi}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-semibold ${
                      item.type === "DEBIT" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.referensi || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.noJurnal || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
