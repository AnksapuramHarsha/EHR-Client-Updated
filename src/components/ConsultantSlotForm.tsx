// import { useEffect, useState } from 'react';
// import { ConsultantSlotConfig, Consultant } from '../types/ConsultantConfig';
// import { fetchConsultants } from '../apis/consultantApi';
// import { postConsultantSlotConfig } from '../apis/consultantConfigApi';

// const allDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// export const ConsultantSlotForm = () => {
//   const [config, setConfig] = useState<ConsultantSlotConfig>({
//     consultantId: '',
//     daysOfWeek: [],
//     startTime: '',
//     endTime: '',
//     slotDuration: 30,
//     effectiveFrom: '',
//     effectiveTo: '',
//   });

//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchConsultants()
//       .then(setConsultants)
//       .catch(() => setMessage("Failed to load consultants."));
//   }, []);

//   const handleChange = (field: keyof ConsultantSlotConfig, value: any) => {
//     setConfig(prev => ({ ...prev, [field]: value }));
//   };

//   const toggleDay = (day: string) => {
//     setConfig(prev => ({
//       ...prev,
//       daysOfWeek: prev.daysOfWeek.includes(day)
//         ? prev.daysOfWeek.filter(d => d !== day)
//         : [...prev.daysOfWeek, day],
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await postConsultantSlotConfig(config);
//       setMessage('✅ Configuration saved successfully!');
//     } catch (error) {
//       console.error(error);
//       setMessage('❌ Failed to save configuration.');
//     }
//   };

//   const selectedConsultant = consultants.find(c => c.id === config.consultantId);

//   return (
//     <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto space-y-4 bg-base-100 rounded-xl shadow-md">
//       <h2 className="text-xl font-bold">Consultant Slot Configuration</h2>

//       {/* Consultant Selection */}
//       <div className="form-control">
//         <label className="label">Consultant</label>
//         <select
//           className="select select-bordered"
//           value={config.consultantId}
//           onChange={(e) => handleChange('consultantId', e.target.value)}
//         >
//           <option disabled value="">Select Consultant</option>
//           {consultants.map((consultant) => (
//             <option key={consultant.id} value={consultant.id}>
//               {consultant.name} ({consultant.speciality.name})
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Show Consultant Details */}
//       {selectedConsultant && (
//         <div className="p-2 bg-base-200 rounded text-sm space-y-1">
//           <p><strong>Name:</strong> {selectedConsultant.name}</p>
//           <p><strong>Specialty:</strong> {selectedConsultant.speciality.name}</p>
//           <p><strong>Email:</strong> {selectedConsultant.email}</p>
//           <p><strong>Phone:</strong> {selectedConsultant.phone}</p>
//         </div>
//       )}

//       {/* Days of the Week */}
//       <div className="form-control">
//         <label className="label">Days of the Week</label>
//         <div className="flex flex-wrap gap-2">
//           {allDays.map((day) => (
//             <label key={day} className="btn btn-sm btn-outline cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="checkbox checkbox-sm mr-2"
//                 checked={config.daysOfWeek.includes(day)}
//                 onChange={() => toggleDay(day)}
//               />
//               {day}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Time Inputs */}
//       <div className="form-control">
//         <label className="label">Start Time</label>
//         <input
//           type="time"
//           className="input input-bordered"
//           value={config.startTime}
//           onChange={(e) => handleChange('startTime', e.target.value)}
//         />
//       </div>

//       <div className="form-control">
//         <label className="label">End Time</label>
//         <input
//           type="time"
//           className="input input-bordered"
//           value={config.endTime}
//           onChange={(e) => handleChange('endTime', e.target.value)}
//         />
//       </div>

//       {/* Slot Duration */}
//       <div className="form-control">
//         <label className="label">Slot Duration (minutes)</label>
//         <input
//           type="number"
//           className="input input-bordered"
//           value={config.slotDuration}
//           onChange={(e) => handleChange('slotDuration', Number(e.target.value))}
//         />
//       </div>

//       {/* Date Inputs */}
//       <div className="form-control">
//         <label className="label">Effective From</label>
//         <input
//           type="date"
//           className="input input-bordered"
//           value={config.effectiveFrom}
//           onChange={(e) => handleChange('effectiveFrom', e.target.value)}
//         />
//       </div>

//       <div className="form-control">
//         <label className="label">Effective To</label>
//         <input
//           type="date"
//           className="input input-bordered"
//           value={config.effectiveTo}
//           onChange={(e) => handleChange('effectiveTo', e.target.value)}
//         />
//       </div>

//       {/* Submit */}
//       <button type="submit" className="btn btn-primary w-full">Save Configuration</button>
//       {message && <div className="text-info mt-2">{message}</div>}
//     </form>
//   );
// };
import { useEffect, useState } from 'react';
import { ConsultantSlotConfig, Consultant } from '../types/ConsultantConfig';
import { fetchConsultants } from '../apis/consultantApi';
import { postConsultantSlotConfig } from '../apis/consultantConfigApi';

const allDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const ConsultantSlotForm = () => {
  const [config, setConfig] = useState<ConsultantSlotConfig>({
    consultantId: '',
    daysOfWeek: [],
    startTime: '',
    endTime: '',
    slotDuration: 30,
    effectiveFrom: '',
    effectiveTo: '',
  });

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConsultants()
      .then(setConsultants)
      .catch(() => setMessage("Failed to load consultants."));
  }, []);

  const handleChange = (field: keyof ConsultantSlotConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setConfig(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postConsultantSlotConfig(config);
      setMessage('✅ Configuration saved successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to save configuration.');
    }
  };

  const selectedConsultant = consultants.find(c => c.id === config.consultantId);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 rounded-lg shadow max-w-4xl mx-auto space-y-6 text-sm"
    >
      {/* <h2 className="text-xl font-semibold text-center">Consultant Slot Configuration</h2> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Consultant Selection */}
        <div>
          <label htmlFor="consultant" className="label">
            <span className="label-text text-sm font-medium text-gray-600">Consultant *</span>
          </label>
          <select
            id="consultant"
            className="select select-bordered w-full"
            value={config.consultantId}
            onChange={(e) => handleChange('consultantId', e.target.value)}
          >
            <option disabled value="">Select Consultant</option>
            {consultants.map((consultant) => (
              <option key={consultant.id} value={consultant.id}>
                {consultant.name} ({consultant.speciality.name})
              </option>
            ))}
          </select>
        </div>

        {/* Slot Duration */}
        <div>
          <label htmlFor="slotDuration" className="label">
            <span className="label-text text-sm font-medium text-gray-600">Slot Duration (minutes)</span>
          </label>
          <input
            id="slotDuration"
            type="number"
            className="input input-bordered w-full"
            value={config.slotDuration}
            onChange={(e) => handleChange('slotDuration', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Consultant Details */}
      {selectedConsultant && (
        <div className="p-4 bg-base-200 rounded text-sm space-y-1">
          <p><strong>Name:</strong> {selectedConsultant.name}</p>
          <p><strong>Specialty:</strong> {selectedConsultant.speciality.name}</p>
          <p><strong>Email:</strong> {selectedConsultant.email}</p>
          <p><strong>Phone:</strong> {selectedConsultant.phone}</p>
        </div>
      )}

      {/* Days of the Week */}
      <div>
        <label className="label">
          <span className="label-text text-sm font-medium text-gray-600">Days of the Week</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {allDays.map((day) => (
            <label key={day} className="btn btn-sm btn-outline cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mr-2"
                checked={config.daysOfWeek.includes(day)}
                onChange={() => toggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="label">
            <span className="label-text text-sm font-medium text-gray-600">Start Time *</span>
          </label>
          <input
            id="startTime"
            type="time"
            className="input input-bordered w-full"
            value={config.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="label">
            <span className="label-text text-sm font-medium text-gray-600">End Time *</span>
          </label>
          <input
            id="endTime"
            type="time"
            className="input input-bordered w-full"
            value={config.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
          />
        </div>
      </div>

      {/* Effective Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="effectiveFrom" className="label">
            <span className="label-text text-sm font-medium text-gray-600">Effective From *</span>
          </label>
          <input
            id="effectiveFrom"
            type="date"
            className="input input-bordered w-full"
            value={config.effectiveFrom}
            onChange={(e) => handleChange('effectiveFrom', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="effectiveTo" className="label">
            <span className="label-text text-sm font-medium text-gray-600">Effective To *</span>
          </label>
          <input
            id="effectiveTo"
            type="date"
            className="input input-bordered w-full"
            value={config.effectiveTo}
            onChange={(e) => handleChange('effectiveTo', e.target.value)}
          />
        </div>
      </div>

      <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary w-full">
          Save Configuration
        </button>
      </div>

      {message && (
        <div className="text-info text-center mt-2 text-sm font-medium">{message}</div>
      )}
    </form>
  );
};
