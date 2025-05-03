// import { useState, useEffect } from 'react';
// import { Consultant } from '../types/ConsultantConfig';
// import { SlotGenerationRequest } from '../types/SlotGeneration';
// import { fetchConsultants } from '../apis/consultantApi';
// import { generateSlots } from '../apis/slotApi';

// export const SlotGeneratorForm = () => {
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [consultantId, setConsultantId] = useState('');
//   const [payload, setPayload] = useState<SlotGenerationRequest>({ from: '', to: '' });
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchConsultants()
//       .then(setConsultants)
//       .catch(() => setMessage("Failed to load consultants."));
//   }, []);

//   const handleChange = (field: keyof SlotGenerationRequest, value: string) => {
//     setPayload(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       await generateSlots(consultantId, payload);
//       setMessage('✅ Slots generated successfully!');
//     } catch (error: any) {
//       if (error.response?.status === 400) {
//         setMessage('Please enter a valid date range configured for this consultant.');
//       } else {
//         setMessage('Error generating slots.');
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto space-y-4 bg-base-100 rounded-xl shadow-md">
//       <h2 className="text-xl font-bold">Generate Appointment Slots</h2>

//       <div className="form-control">
//         <label className="label">Consultant</label>
//         <select
//           className="select select-bordered"
//           value={consultantId}
//           onChange={(e) => setConsultantId(e.target.value)}
//         >
//           <option disabled value="">Select Consultant</option>
//           {consultants.map(c => (
//             <option key={c.id} value={c.id}>
//               {c.name} ({c.speciality.name})
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="form-control">
//         <label className="label">From Date</label>
//         <input
//           type="date"
//           className="input input-bordered"
//           value={payload.from}
//           onChange={(e) => handleChange('from', e.target.value)}
//         />
//       </div>

//       <div className="form-control">
//         <label className="label">To Date</label>
//         <input
//           type="date"
//           className="input input-bordered"
//           value={payload.to}
//           onChange={(e) => handleChange('to', e.target.value)}
//         />
//       </div>

//       <button type="submit" className="btn btn-primary w-full">Generate Slots</button>
//       {message && <div className="text-info mt-2">{message}</div>}
//     </form>
//   );
// };
import { useState, useEffect } from 'react';
import { Consultant } from '../types/ConsultantConfig';
import { SlotGenerationRequest } from '../types/SlotGeneration';
import { fetchConsultants } from '../apis/consultantApi';
import { generateSlots } from '../apis/slotApi';

export const SlotGeneratorForm = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [consultantId, setConsultantId] = useState('');
  const [payload, setPayload] = useState<SlotGenerationRequest>({ from: '', to: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConsultants()
      .then(setConsultants)
      .catch(() => setMessage("Failed to load consultants."));
  }, []);

  const handleChange = (field: keyof SlotGenerationRequest, value: string) => {
    setPayload(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await generateSlots(consultantId, payload);
      setMessage('✅ Slots generated successfully!');
    } catch (error: any) {
      if (error.response?.status === 400) {
        setMessage('Please enter a valid date range configured for this consultant.');
      } else {
        setMessage('Error generating slots.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 rounded-lg shadow max-w-3xl mx-auto space-y-6 text-sm"
    >
      <h2 className="text-xl font-semibold text-center">Generate Appointment Slots</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="consultant" className="label">
            <span className="label-text text-sm font-medium text-gray-600">Consultant *</span>
          </label>
          <select
            id="consultant"
            className="select select-bordered w-full"
            value={consultantId}
            onChange={(e) => setConsultantId(e.target.value)}
          >
            <option disabled value="">Select Consultant</option>
            {consultants.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.speciality.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="from" className="label">
            <span className="label-text text-sm font-medium text-gray-600">From Date *</span>
          </label>
          <input
            id="from"
            type="date"
            className="input input-bordered w-full"
            value={payload.from}
            onChange={(e) => handleChange('from', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="to" className="label">
            <span className="label-text text-sm font-medium text-gray-600">To Date *</span>
          </label>
          <input
            id="to"
            type="date"
            className="input input-bordered w-full"
            value={payload.to}
            onChange={(e) => handleChange('to', e.target.value)}
          />
        </div>
      </div>

      <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary w-full">
          Generate Slots
        </button>
      </div>

      {message && (
        <div className="text-info text-center mt-2 text-sm font-medium">{message}</div>
      )}
    </form>
  );
};
