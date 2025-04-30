"use client";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/app/api/admin";
import { toast, Toaster } from "react-hot-toast";

interface ProfileDataType {
  nama: string;
  nis: string;
  sekolah: string;
  kelas: string;
  jurusan: string;
  tanggalLahir: string;
  alamat: string;
  agama: string;
  jenisKelamin: string;
  noTelp: string;
  email: string;
  namaAyah: string;
  namaIbu: string;
  noTelpAyah: string;
  noTelpIbu: string;
  namaWali: string;
  noTelpWali: string;
  foto: string;
  pendidikanSebelumnya: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  jalanOrtu: string;
  kelurahanOrtu: string;
  kecamatanOrtu: string;
  kabupatenOrtu: string;
  provinsiOrtu: string;
  pekerjaanWali: string;
  alamatWali: string;
  [key: string]: string;
}

const ProfileStudents = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileDataType>({
    nama: "",
    nis: "",
    sekolah: "",
    kelas: "",
    jurusan: "",
    tanggalLahir: "",
    alamat: "",
    agama: "",
    jenisKelamin: "",
    noTelp: "",
    email: "",
    namaAyah: "",
    namaIbu: "",
    noTelpAyah: "",
    noTelpIbu: "",
    namaWali: "",
    noTelpWali: "",
    foto: "",
    pendidikanSebelumnya: "",
    pekerjaanAyah: "",
    pekerjaanIbu: "",
    jalanOrtu: "",
    kelurahanOrtu: "",
    kecamatanOrtu: "",
    kabupatenOrtu: "",
    provinsiOrtu: "",
    pekerjaanWali: "",
    alamatWali: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      console.log("📥 Fetching Current User...");
      const user = await getCurrentUser();
      console.log("✅ User Data:", user);

      if (user?.data?.studentProfil) {
        const student = user.data.studentProfil;

        setProfileData({
          nama: student.nama || "-",
          nis: student.noIndukSiswa || "-",
          sekolah: student.sekolah || "-",
          kelas: student.kelas || "-",
          jurusan: student.jurusanId ? `Jurusan ID: ${student.jurusanId}` : "-",
          tanggalLahir: student.ttl || "-",
          alamat: student.alamat || "-",
          agama: student.agama || "-",
          jenisKelamin: student.jenisKelamin || "-",
          noTelp: student.noTelp || "-",
          email: student.email || "-",
          namaAyah: student.namaAyah || "-",
          namaIbu: student.namaIbu || "-",
          noTelpAyah: student.noTelpAyah || "-",
          noTelpIbu: student.noTelpIbu || "-",
          namaWali: student.namaWali || "-",
          noTelpWali: student.noTelpWali || "-",
          foto: student.foto || "/foto.png",
          pendidikanSebelumnya: student.pendidikanSebelumnya || "-",
          pekerjaanAyah: student.pekerjaanAyah || "-",
          pekerjaanIbu: student.pekerjaanIbu || "-",
          jalanOrtu: student.jalanOrtu || "-",
          kelurahanOrtu: student.kelurahanOrtu || "-",
          kecamatanOrtu: student.kecamatanOrtu || "-",
          kabupatenOrtu: student.kabupatenOrtu || "-",
          provinsiOrtu: student.provinsiOrtu || "-",
          pekerjaanWali: student.pekerjaanWali || "-",
          alamatWali: student.alamatWali || "-",
        });
      } else {
        console.warn("⚠️ Data siswa tidak ditemukan.");
        toast.error("Data siswa tidak ditemukan");
      }
    } catch (error) {
      console.error("❌ Gagal mengambil data user:", error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Bagian Header */}
        <div className="bg-yellow-500 p-6">
          <h1 className="text-2xl font-bold text-black">Data Profil Siswa</h1>
        </div>

        {/* Data Profil Siswa */}
        <div className="p-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading data...</p>
          ) : (
            <div className="space-y-6">
              {/* Informasi Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField label="Nama Lengkap" value={profileData.nama} />
                <ProfileField label="NIS" value={profileData.nis} />
                <ProfileField label="Sekolah" value={profileData.sekolah} />
                <ProfileField label="Kelas" value={profileData.kelas} />
                <ProfileField label="Jurusan" value={profileData.jurusan} />
                <ProfileField
                  label="Jenis Kelamin"
                  value={profileData.jenisKelamin}
                />
                <ProfileField
                  label="Tanggal Lahir"
                  value={profileData.tanggalLahir}
                />
                <ProfileField label="Agama" value={profileData.agama} />
                <ProfileField
                  label="Pendidikan Sebelumnya"
                  value={profileData.pendidikanSebelumnya}
                />
                <ProfileField label="Alamat" value={profileData.alamat} />
              </div>

              {/* Kontak */}
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="No. Telepon"
                    value={profileData.noTelp}
                  />
                  <ProfileField label="Email" value={profileData.email} />
                </div>
              </div>

              {/* Informasi Keluarga */}
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">
                  Informasi Keluarga
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    label="Nama Ayah"
                    value={profileData.namaAyah}
                  />
                  <ProfileField
                    label="No. Telepon Ayah"
                    value={profileData.noTelpAyah}
                  />
                  <ProfileField
                    label="Pekerjaan Ayah"
                    value={profileData.pekerjaanIbu}
                  />
                  <ProfileField
                    label="Nama Ibu"
                    value={profileData.pekerjaanAyah}
                  />
                  <ProfileField
                    label="No. Telepon Ibu"
                    value={profileData.noTelpIbu}
                  />
                  <ProfileField
                    label="Pekerjaan Ibu"
                    value={profileData.pekerjaanIbu}
                  />
                  <ProfileField
                    label="No. Telepon Ibu"
                    value={profileData.noTelpIbu}
                  />
                  <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-4">
                      Alamat Orang Tua
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileField
                        label="Jalan"
                        value={profileData.jalanOrtu}
                      />
                      <ProfileField
                        label="Kelurahan/ Desa"
                        value={profileData.kelurahanOrtu}
                      />
                      <ProfileField
                        label="Kecamatan"
                        value={profileData.kecamatanOrtu}
                      />
                      <ProfileField
                        label="Kabupaten/ Kota"
                        value={profileData.kabupatenOrtu}
                      />
                      <ProfileField
                        label="Provinsi"
                        value={profileData.provinsiOrtu}
                      />
                    </div>
                  </div>
                  <ProfileField
                    label="Nama Wali"
                    value={profileData.namaWali}
                  />
                  <ProfileField
                    label="No. Telepon Wali"
                    value={profileData.noTelpWali}
                  />
                  <ProfileField
                    label="Pekerjaan Wali"
                    value={profileData.pekerjaanWali}
                  />
                  <ProfileField
                    label="Alamat Wali"
                    value={profileData.alamatWali}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Komponen untuk field profil yang hanya bisa dibaca
const ProfileField = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) => (
  <div className={`${fullWidth ? "col-span-full" : ""}`}>
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700">{label}</label>
      <div className="p-2 bg-gray-50 border rounded-md text-gray-800 mt-1">
        {value}
      </div>
    </div>
  </div>
);

export default ProfileStudents;
