"use client";

import { useEffect, useState } from "react";
import { getNilaiParents, getAbsenParents } from "@/app/api/parents";
import { getCurrentUser } from "@/app/api/admin";
import { Toaster, toast } from "react-hot-toast";

const NilaiParents = () => {
  const [loading, setLoading] = useState(true);
  const [nilaiStudent, setNilaiStudent] = useState<{
    [mapel: string]: { skor: number; capaianKompetensi?: string };
  }>({});
  const [studentData, setStudentData] = useState({
    nama: "",
    nis: "",
    sekolah: "",
    kelas: "",
    semester: "",
  });
  const [absenData, setAbsenData] = useState({
    sakit: 0,
    izin: 0,
    alpa: 0,
  });

  // 🔹 Fetch all necessary data
  useEffect(() => {
    Promise.all([fetchNilai(), fetchUserData(), fetchAbsensi()]);
  }, []);

  const fetchNilai = async () => {
    try {
      console.log("📥 Fetching Nilai Student...");
      const response = await getNilaiParents();
      console.log("✅ Nilai Student Data:", response);

      if (response?.data) {
        setNilaiStudent(response.data);
      } else {
        console.warn("⚠️ Data nilai tidak ditemukan.");
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data nilai:", error);
      toast.error("Gagal memuat data nilai");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const user = await getCurrentUser();
      console.log("✅ User Data:", user);

      if (user?.data?.studentProfil) {
        const student = user.data.studentProfil;
        setStudentData({
          nama: student.nama || "",
          nis: student.noIndukSiswa || "",
          sekolah: student.sekolah
            ? `${student.sekolah} Advent Klabat Manado`
            : "SMA Advent Klabat Manado",
          kelas: student.kelas || "",
          semester:
            (student.MemberKelas && student.MemberKelas[0]?.Kelas?.semester) ||
            "GANJIL",
        });
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data siswa:", error);
    }
  };

  const fetchAbsensi = async () => {
    try {
      const response = await getAbsenParents();
      console.log("✅ Absensi Data:", response);

      if (response?.data) {
        // Hitung total ketidakhadiran
        let sakit = 0;
        let izin = 0;
        let alpa = 0;

        // Loop melalui setiap mapel dalam data absensi
        Object.values(response.data).forEach((mapelData: any) => {
          sakit += mapelData["Sakit"] || 0;
          izin += mapelData["Izin"] || 0;
          alpa += mapelData["Alfa"] || mapelData["Alpa"] || 0;
        });

        setAbsenData({ sakit, izin, alpa });
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data absensi:", error);
    }
  };

  // 🔹 Menghitung total skor dan rata-rata nilai
  const nilaiArray = Object.values(nilaiStudent).map((item) => item.skor);
  const totalNilai = nilaiArray.reduce((acc, skor) => acc + skor, 0);
  const rataRata =
    nilaiArray.length > 0 ? (totalNilai / nilaiArray.length).toFixed(2) : "0";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-300">
        {/* Header - Rapor */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase">
          Laporan Hasil Belajar
          <p className="text-xl font-bold">(Rapor)</p>
        </h1>

        {/* Informasi Siswa */}
        <div className="mb-6 grid grid-cols-2 gap-x-8">
          <div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">Nama Peserta Didik</div>
              <div className="w-4 text-center">:</div>
              <div>{studentData.nama}</div>
            </div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">NISN</div>
              <div className="w-4 text-center">:</div>
              <div>{studentData.nis}</div>
            </div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">Sekolah</div>
              <div className="w-4 text-center">:</div>
              <div>{studentData.sekolah}</div>
            </div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">Alamat</div>
              <div className="w-4 text-center">:</div>
              <div>Jl. Daan Mogot 11</div>
            </div>
          </div>
          <div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">Kelas</div>
              <div className="w-4 text-center">:</div>
              <div>{studentData.kelas}</div>
            </div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">Semester</div>
              <div className="w-4 text-center">:</div>
              <div>{studentData.semester}</div>
            </div>
            <div className="flex mb-2">
              <div className="w-44 font-semibold">Tahun Pelajaran</div>
              <div className="w-4 text-center">:</div>
              <div>2024-2025</div>
            </div>
          </div>
        </div>

        {/* Tabel Nilai */}
        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg mb-6">
              <thead className="bg-gray-200 text-gray-700">
                <tr className="text-left text-lg">
                  <th className="border border-gray-300 px-4 py-3 text-center w-10">
                    No
                  </th>
                  <th className="border border-gray-300 px-6 py-3">
                    Muatan Pelajaran
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-center w-24">
                    Nilai Akhir
                  </th>
                  <th className="border border-gray-300 px-6 py-3">
                    Capaian Kompetensi
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(nilaiStudent).length > 0 ? (
                  Object.entries(nilaiStudent).map(([mapel, nilai], index) => (
                    <tr key={mapel} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-3 py-3 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {mapel}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                        {nilai.skor}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        {nilai.capaianKompetensi || ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-300 px-4 py-3 text-center text-gray-500"
                    >
                      Tidak ada data nilai
                    </td>
                  </tr>
                )}
              </tbody>
              {/* Total rata-rata */}
              <tfoot className="bg-gray-100">
                <tr className="font-bold">
                  <td
                    className="border border-gray-300 px-4 py-3 text-right"
                    colSpan={2}
                  >
                    Rata-rata
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {rataRata}
                  </td>
                  <td className="border border-gray-300 px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>

            {/* Ketidakhadiran */}
            <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-200 text-center font-semibold py-2 border-b border-gray-300">
                Ketidakhadiran
              </div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="border-b border-gray-300 px-6 py-2">
                      Sakit
                    </td>
                    <td className="border-b border-gray-300 px-6 py-2 text-center">
                      {absenData.sakit}
                    </td>
                    <td className="border-b border-gray-300 px-6 py-2">hari</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-300 px-6 py-2">Izin</td>
                    <td className="border-b border-gray-300 px-6 py-2 text-center">
                      {absenData.izin}
                    </td>
                    <td className="border-b border-gray-300 px-6 py-2">hari</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-2">Tanpa Keterangan</td>
                    <td className="px-6 py-2 text-center">{absenData.alpa}</td>
                    <td className="px-6 py-2">hari</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NilaiParents;
