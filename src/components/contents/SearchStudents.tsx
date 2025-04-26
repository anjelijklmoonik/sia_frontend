import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchStudent = ({
  setSelectedStudent,
}: {
  setSelectedStudent: Function;
}) => {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]); // Menyimpan hasil pencarian siswa
  const [loading, setLoading] = useState(false);

  // Fungsi untuk menangani pencarian siswa
  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    try {
      // Mengganti URL API sesuai dengan endpoint yang dimaksud
      const response = await axios.get(`admin/search-student?query=${query}`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error searching student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-l-lg focus:outline-none"
          placeholder="Cari berdasarkan nama atau NISN"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-yellow-500 text-white rounded-r-lg"
          disabled={loading}
        >
          <FaSearch />
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="mt-2 max-h-60 overflow-auto">
        {students.length > 0 && (
          <ul className="bg-white shadow-lg rounded-lg max-h-60 overflow-auto">
            {students.map((student) => (
              <li
                key={student.id}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                {student.name} - {student.nisn}
              </li>
            ))}
          </ul>
        )}
        {students.length === 0 && query && <p>Tidak ada hasil ditemukan</p>}
      </div>
    </div>
  );
};

export default SearchStudent;
