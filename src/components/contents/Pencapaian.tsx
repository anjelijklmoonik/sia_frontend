"use client";

import { useState, useEffect } from "react";
import {
  getAchievements,
  postAchivement,
  searchStudent,
} from "@/app/api/admin";
import { toast, Toaster } from "react-hot-toast";

interface Pencapaian {
  id?: number;
  studentProfilId: number;
  judul: string;
  tanggal: string;
  deskripsi: string;
  namaSiswa?: string;
}

interface Siswa {
  id: number;
  nama: string;
  noIndukSiswa: string;
}

export default function PencapaianSiswa() {
  const [pencapaianList, setPencapaianList] = useState<Pencapaian[]>([]);
  const [students, setStudents] = useState<Siswa[]>([]);
  const [nisInput, setNisInput] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Siswa | null>(null);
  const [searchResults, setSearchResults] = useState<Siswa[]>([]);
  const [form, setForm] = useState<Omit<Pencapaian, "id" | "namaSiswa">>({
    studentProfilId: 0,
    judul: "",
    tanggal: "",
    deskripsi: "",
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  // 🔹 Ambil data pencapaian dari API
  const fetchAchievements = async () => {
    const data = await getAchievements();
    console.log("📥 Data Pencapaian dari API:", data);
    setPencapaianList(data || []);
  };

  // 🔹 Cari siswa berdasarkan NIS - Simplified version
  const handleSearchStudent = async () => {
    if (!nisInput.trim()) {
      toast.error("❌ Masukkan Nomor Induk Siswa (NIS)!");
      return;
    }

    setSearchLoading(true);
    try {
      const data = await searchStudent(nisInput);
      console.log("🔍 Hasil pencarian (raw):", data);

      // Simply check if we got any results
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Ditemukan", data.length, "siswa");
        setSearchResults(data);

        if (data.length === 1) {
          handleSelectStudent({
            id: data[0].id,
            nama: data[0].nama,
            noIndukSiswa: data[0].noIndukSiswa,
          });
        }
      } else {
        console.log("❌ Tidak ada hasil");
        setSearchResults([]);
        toast.error("❌ Siswa tidak ditemukan!");
      }
    } catch (error) {
      console.error("❌ Gagal mencari siswa:", error);
      toast.error("❌ Terjadi kesalahan saat mencari siswa.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 🔹 Pilih siswa dari hasil pencarian
  const handleSelectStudent = (student: Siswa) => {
    setSelectedStudent(student);
    setForm((prev) => ({
      ...prev,
      studentProfilId: student.id,
    }));
    setSearchResults([]);
    toast.success(`✅ Siswa ${student.nama} dipilih!`);
  };

  // 🔹 Handle perubahan input form
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "studentProfilId" ? Number(value) : value,
    }));
  };

  // 🔹 Handle perubahan input NIS
  const handleNisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNisInput(e.target.value);
  };

  // 🔹 Kirim pencapaian ke backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.studentProfilId ||
      !form.judul ||
      !form.tanggal ||
      !form.deskripsi
    ) {
      toast.error("❌ Mohon isi semua kolom!");
      return;
    }

    setLoading(true);
    try {
      // 🕒 Format tanggal sesuai `YYYY-MM-DDTHH:mm:ss.SSSZ`
      const formattedDate = new Date(
        form.tanggal + "T13:00:00.000Z"
      ).toISOString();

      const dataToSend = {
        ...form,
        tanggal: formattedDate,
      };

      console.log("📤 Mengirim Data:", dataToSend); // ✅ Log data sebelum submit

      const response = await postAchivement(dataToSend);

      console.log("✅ Pencapaian berhasil ditambahkan:", response); // ✅ Log response dari API
      toast.success("✅ Pencapaian berhasil ditambahkan!");
      fetchAchievements(); // 🔹 Update daftar pencapaian

      // Reset form
      setForm({
        studentProfilId: 0,
        judul: "",
        tanggal: "",
        deskripsi: "",
      });
      setSelectedStudent(null);
      setNisInput("");
    } catch (error) {
      console.error("❌ Gagal menambahkan pencapaian:", error);
      toast.error("❌ Terjadi kesalahan saat menambahkan pencapaian.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Pencapaian Siswa
        </h1>

        {/* Form Tambah Pencapaian */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Tambah Pencapaian
          </h2>

          {/* Pencarian Siswa berdasarkan NIS */}
          <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <h3 className="text-md font-medium text-gray-700 mb-2">
              Cari Siswa
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Masukkan NIS Siswa"
                value={nisInput}
                onChange={handleNisChange}
                className="flex-1 p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={handleSearchStudent}
                disabled={searchLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
              >
                {searchLoading ? "Mencari..." : "Cari"}
              </button>
            </div>

            {/* Menampilkan hasil pencarian */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto bg-white rounded border p-2">
                <p className="text-sm text-gray-600 mb-1">Hasil pencarian:</p>
                <ul>
                  {searchResults.map((student) => (
                    <li
                      key={student.id}
                      className="p-1 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <button
                        onClick={() => handleSelectStudent(student)}
                        className="w-full text-left text-sm"
                      >
                        {student.nama} (NIS: {student.noIndukSiswa})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Menampilkan siswa yang dipilih */}
            {selectedStudent && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-medium">
                  Siswa terpilih:{" "}
                  <span className="font-bold">{selectedStudent.nama}</span>
                  <span className="ml-2 text-gray-600">
                    (NIS: {selectedStudent.noIndukSiswa})
                  </span>
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-gray-700 font-semibold">
                Judul Pencapaian:
              </label>
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold">Tanggal:</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-700 font-semibold">Deskripsi:</label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
                rows={3}
              ></textarea>
            </div>
            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={loading || !selectedStudent}
                className={`px-6 py-2 rounded-lg shadow-md transition ${
                  !selectedStudent
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                {loading ? "Menyimpan..." : "Tambah Pencapaian"}
              </button>
            </div>
          </form>
        </div>

        {/* Daftar Pencapaian */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Daftar Pencapaian:
          </h2>
          <table className="w-full bg-gray-50 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Nama</th>
                <th className="p-2">Judul</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {pencapaianList.length > 0 ? (
                pencapaianList.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2">{p.namaSiswa || "Tidak Diketahui"}</td>
                    <td className="p-2">{p.judul}</td>
                    <td className="p-2">
                      {new Date(p.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2">{p.deskripsi}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Belum ada data pencapaian
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
