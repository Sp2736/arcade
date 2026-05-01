import { useState, useEffect } from 'react';

export default function ResourceUploadForm() {
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsLoading(true);
        // Fetch Subjects
        const subjectRes = await fetch('/api/subjects');
        const subjectData = await subjectRes.json();
        
        // Fetch Faculties (Assuming your user route can filter by role)
        const facultyRes = await fetch('/api/user?role=faculty'); 
        const facultyData = await facultyRes.json();

        if (subjectRes.ok) setSubjects(subjectData.subjects || subjectData);
        if (facultyRes.ok) setFaculties(facultyData.users || facultyData);
      } catch (error) {
        console.error("Failed to load dropdown data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  return (
    <form>
      {/* Subject Dropdown */}
      <select 
        value={selectedSubject} 
        onChange={(e) => setSelectedSubject(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Subject</option>
        {subjects.map((sub: any) => (
          <option key={sub._id || sub.id} value={sub._id || sub.id}>
            {sub.name}
          </option>
        ))}
      </select>

      {/* Faculty Dropdown */}
      <select 
        value={selectedFaculty} 
        onChange={(e) => setSelectedFaculty(e.target.value)}
        disabled={isLoading}
        className="w-full p-2 border rounded mt-4"
      >
        <option value="">Select Faculty</option>
        {faculties.map((fac: any) => (
          <option key={fac._id || fac.id} value={fac._id || fac.id}>
            {fac.name}
          </option>
        ))}
      </select>
    </form>
  );
}