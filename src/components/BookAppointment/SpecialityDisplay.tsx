import { Speciality } from '../../types/ConsultantConfig';

interface Props {
  speciality: Speciality | null;
}

export const SpecialityDisplay = ({ speciality }: Props) => {
  if (!speciality) return null;

  return (
    <div className="p-3 bg-base-200 rounded text-sm space-y-1">
      <p><strong>Speciality:</strong> {speciality.name}</p>
      <p className="text-gray-500">{speciality.description}</p>
    </div>
  );
};
