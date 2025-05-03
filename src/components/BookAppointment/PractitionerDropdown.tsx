import { useEffect, useState } from 'react';
import { Consultant } from '../../types/ConsultantConfig';
import { fetchConsultants } from '../../apis/consultantApi';

interface Props {
  selectedId: string;
  onSelect: (consultant: Consultant) => void;
}

export const PractitionerDropdown = ({ selectedId, onSelect }: Props) => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);

  useEffect(() => {
    fetchConsultants()
      .then(setConsultants)
      .catch(err => console.error('Error fetching consultants:', err));
  }, []);

  return (
    <div className="form-control">
      <label className="label">Select Practitioner</label>
      <select
        className="select select-bordered"
        value={selectedId}
        onChange={(e) => {
          const selected = consultants.find(c => c.id === e.target.value);
          if (selected) onSelect(selected);
        }}
      >
        <option disabled value="">Choose Consultant</option>
        {consultants.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.speciality.name})
          </option>
        ))}
      </select>
    </div>
  );
};
