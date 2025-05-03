import { useState, useEffect } from 'react';
import { dropDownPatients } from '../../apis/patientApi';
import { PatientSearchItem } from '../../types/PatientSearch';

interface Props {
  onSelect: (patient: PatientSearchItem) => void;
}

export const PatientSearchDropdown = ({ onSelect }: Props) => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<PatientSearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (query.length < 2) {
        setPatients([]);
        return;
      }

      try {
        const data = await dropDownPatients(query);
        const items: PatientSearchItem[] = data.map((p: any) => ({
          id: Number(p.id), // ✅ force number
          name: `${p.firstname}`.trim(),
          abha: p.abha,
        }));

        setPatients(items);
        setShowDropdown(true);
      } catch (error) {
        console.error('Patient search error:', error);
        setPatients([]);
      }
    };

    const delayDebounce = setTimeout(fetch, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="form-control relative">
      <label className="label">Select Patient</label>
      <input
        type="text"
        className="input input-bordered"
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {showDropdown && patients.length > 0 && (
        <ul className="menu bg-base-200 rounded-box mt-1 shadow w-full z-10 absolute max-h-60 overflow-y-auto">
          {patients.map((patient) => (
            <li key={patient.id}>
              <button
                type="button"
                className="text-left w-full"
                onClick={() => {
                  setQuery(patient.name);   // ✅ sets name in input
                  onSelect(patient);        // ✅ passes { id, name } to form
                  setShowDropdown(false);   // ✅ close dropdown
                }}
              >
                {patient.name} —  ID: {patient.id} —  ABHA: {patient.abha}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
