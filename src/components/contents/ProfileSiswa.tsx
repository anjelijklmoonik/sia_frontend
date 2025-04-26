"use client";

import { useState, useEffect } from "react";
import { getAllClasses, postClassMember, postStudentProfile } from "@/app/api/admin";
import { toast, Toaster } from "react-hot-toast";

interface SiswaProfile {
  nama: string;
  noIndukSiswa: string;
  sekolah: "SMA" | "SMK";
  kelasId: number; // Changed from kelas string to kelasId number
  jurusanId?: number;
  alamat: string;
  ttl: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  noTelp?: string;
  email?: string;
  agama?: string;
  namaAyah?: string;
  namaIbu?: string;
  noTelpAyah?: string;
  noTelpIbu?: string;
  namaWali?: string;
  noTelpWali?: string;
}

interface KelasOption {
  id: number;
  noKelas: string;
  semester: string;
  jurusanId: number;
  academicYearId: number;
  jurusan?: {
    nama: string;
  }
  academicYear?: {
    year: number;
  }
}

const agamaOptions = [
  "Kristen",
  "Katholik",
  "Islam",
  "Hindu",
  "Buddha",
  "Konghucu"
];

const jurusanOptions = [
  { id: 2, name: "Layanan Kesehatan" },
  { id: 3, name: "Akuntasi Keuangan Lembaga" },
];

const initialProfile: SiswaProfile = {
  nama: "",
  noIndukSiswa: "",
  sekolah: "SMA",
  kelasId: 0, // Changed from kelas to kelasId
  jurusanId: undefined,
  alamat: "",
  ttl: "",
  jenisKelamin: "Laki-laki",
  noTelp: "",
  email: "",
  agama: "Kristen",
  namaAyah: "",
  namaIbu: "",
  noTelpAyah: "",
  noTelpIbu: "",
  namaWali: "",
  noTelpWali: "",
};

export default function ProfileSiswaForm() {
  const [profile, setProfile] = useState<SiswaProfile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<KelasOption[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<KelasOption[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("GANJIL");
  
  // Fetch all classes when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const allClasses = await getAllClasses();
        console.log("Fetched classes:", allClasses);
        setClasses(allClasses);
        
        // Initially filter classes based on SMA
        filterClassesBySelection("SMA", undefined, "GANJIL");
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        toast.error("Gagal memuat data kelas");
      }
    };
    
    fetchClasses();
  }, []);
  
  // Filter classes based on selected school, jurusan, and semester
  const filterClassesBySelection = (
    sekolah: string, 
    jurusanId: number | undefined, 
    semester: string
  ) => {
    // For SMA, jurusanId is 1, for SMK it's whatever is selected
    const targetJurusanId = sekolah === "SMA" ? 1 : jurusanId;
    
    // Filter classes by jurusanId and semester
    const filtered = classes.filter(kelas => 
      kelas.jurusanId === targetJurusanId && 
      kelas.semester === semester
    );
    
    console.log("Filtered classes:", filtered);
    setFilteredClasses(filtered);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === "jurusanId" ? Number(value) : value,
    }));
  };

  const handleSekolahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "SMA" | "SMK";
    const newJurusanId = value === "SMK" ? jurusanOptions[0].id : undefined;
    
    setProfile(prev => ({
      ...prev,
      sekolah: value,
      jurusanId: newJurusanId,
      kelasId: 0, // Reset kelasId when school changes
    }));
    
    // Filter classes when school changes
    filterClassesBySelection(value, newJurusanId, selectedSemester);
  };
  
  const handleJurusanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jurusanId = Number(e.target.value);
    
    setProfile(prev => ({
      ...prev,
      jurusanId,
      kelasId: 0, // Reset kelasId when jurusan changes
    }));
    
    // Filter classes when jurusan changes
    filterClassesBySelection(profile.sekolah, jurusanId, selectedSemester);
  };
  
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const semester = e.target.value;
    setSelectedSemester(semester);
    
    // Reset selected class when semester changes
    setProfile(prev => ({
      ...prev,
      kelasId: 0
    }));
    
    // Filter classes when semester changes
    filterClassesBySelection(profile.sekolah, profile.jurusanId, semester);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.kelasId) {
      toast.error("Silakan pilih kelas terlebih dahulu!");
      return;
    }
    
    setLoading(true);

    try {
      const selectedClass = filteredClasses.find(c => c.id === profile.kelasId);
      
      if (!selectedClass) {
        throw new Error("Kelas tidak ditemukan");
      }
      
      // Prepare data to send (convert kelasId to kelas for backend)
      const dataToSend = {
        ...profile,
        kelas: selectedClass.noKelas, // Add kelas string for backend compatibility
        jurusanId: profile.sekolah === "SMK" ? profile.jurusanId : 1, // default SMA jurusanId = 1
      };

      console.log("Sending data:", dataToSend);
      const savedStudent = await postStudentProfile(dataToSend);
      
      if (!savedStudent?.id) throw new Error("Student ID not returned");

      // Add student to class using the selected kelasId
      await postClassMember(profile.kelasId, savedStudent.id);
      toast.success("Siswa berhasil disimpan dan ditambahkan ke kelas!");

      // Reset form after success
      setTimeout(() => {
        setProfile(initialProfile);
      }, 500);

    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan data siswa.");
    } finally {
      setLoading(false);
    }
  };

  // Format class display for select element
  const formatClassOption = (kelas: KelasOption) => {
    const jurusanName = profile.sekolah === "SMK" 
      ? (jurusanOptions.find(j => j.id === kelas.jurusanId)?.name || "") 
      : "";
      
    return `${kelas.noKelas} ${jurusanName}`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Formulir Data Siswa</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nama" name="nama" value={profile.nama} onChange={handleChange} />
          <Input label="Nomor Induk Siswa (NIS)" name="noIndukSiswa" value={profile.noIndukSiswa} onChange={handleChange} />
          
          <div>
            <label className="font-semibold text-gray-700">Sekolah:</label>
            <select
              name="sekolah"
              value={profile.sekolah}
              onChange={handleSekolahChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="SMA">SMA</option>
              <option value="SMK">SMK</option>
            </select>
          </div>
          
          <div>
            <label className="font-semibold text-gray-700">Semester:</label>
            <select
              value={selectedSemester}
              onChange={handleSemesterChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="GANJIL">GANJIL</option>
              <option value="GENAP">GENAP</option>
            </select>
          </div>

          {profile.sekolah === "SMK" && (
            <div>
              <label className="font-semibold text-gray-700">Jurusan:</label>
              <select
                name="jurusanId"
                value={profile.jurusanId}
                onChange={handleJurusanChange}
                className="w-full p-2 border rounded-md"
              >
                {jurusanOptions.map((j) => (
                  <option key={j.id} value={j.id}>{j.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="font-semibold text-gray-700">Kelas:</label>
            <select
              name="kelasId"
              value={profile.kelasId}
              onChange={(e) => setProfile(prev => ({...prev, kelasId: Number(e.target.value)}))}
              className="w-full p-2 border rounded-md"
            >
              <option value="0">-- Pilih Kelas --</option>
              {filteredClasses.map(kelas => (
                <option key={kelas.id} value={kelas.id}>
                  {formatClassOption(kelas)}
                </option>
              ))}
            </select>
          </div>

          <Input label="Alamat" name="alamat" value={profile.alamat} onChange={handleChange} required />
          <Input label="Tanggal Lahir" name="ttl" type="date" value={profile.ttl} onChange={handleChange} required />
          <Select label="Jenis Kelamin" name="jenisKelamin" value={profile.jenisKelamin} onChange={handleChange} options={["Laki-laki", "Perempuan"]} />

          {/* Tambahan field baru */}
          <Select label="Agama" name="agama" value={profile.agama} onChange={handleChange} options={agamaOptions} />
          <Input label="No Telepon" name="noTelp" value={profile.noTelp} onChange={handleChange} type="tel" />
          <Input label="Email" name="email" value={profile.email} onChange={handleChange} type="email" />

          <div className="col-span-2 border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">Data Orang Tua/Wali (Opsional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nama Ayah" name="namaAyah" value={profile.namaAyah} onChange={handleChange} />
              <Input label="No Telepon Ayah" name="noTelpAyah" value={profile.noTelpAyah} onChange={handleChange} type="tel" />
              <Input label="Nama Ibu" name="namaIbu" value={profile.namaIbu} onChange={handleChange} />
              <Input label="No Telepon Ibu" name="noTelpIbu" value={profile.noTelpIbu} onChange={handleChange} type="tel" />
              <Input label="Nama Wali" name="namaWali" value={profile.namaWali} onChange={handleChange} />
              <Input label="No Telepon Wali" name="noTelpWali" value={profile.noTelpWali} onChange={handleChange} type="tel" />
            </div>
          </div>

          <div className="col-span-2 text-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
            >
              {loading ? "Menyimpan..." : "Simpan Data Siswa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen kecil (optional modular)
const Input = ({ label, name, value, onChange, type = "text" }: any) => (
  <div>
    <label className="font-semibold text-gray-700">{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full p-2 border rounded-md"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }: any) => (
  <div>
    <label className="font-semibold text-gray-700">{label}:</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);