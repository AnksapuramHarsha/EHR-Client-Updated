import { useEffect, useState } from 'react';
import { Slot } from '../../types/Appointment';
import { fetchConsultantSlots } from '../../apis/slotApi';

interface Props {
  consultantId: string;
  date: string;
  selectedSlotId: number | null;
  onSelect: (slot: Slot) => void;
}

export const SlotSelector = ({ consultantId, date, selectedSlotId, onSelect }: Props) => {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (!consultantId || !date) return;
    fetchConsultantSlots(consultantId, date)
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [consultantId, date]);

  return (
    <div>
      <label className="label">Available Time Slots</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.slotNumber}
            type="button"
            className={`btn btn-sm ${
              slot.slotNumber === selectedSlotId
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
            onClick={() => onSelect(slot)}
          >
            {slot.startTime} - {slot.endTime}
          </button>
        ))}
        {slots.length === 0 && (
          <p className="col-span-full text-sm text-gray-500">No slots available</p>
        )}
      </div>
    </div>
  );
};
