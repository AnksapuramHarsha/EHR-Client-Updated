interface Props {
    visitReason: string;
    priorityLevel: string;
    onChange: (field: 'visitReason' | 'priorityLevel', value: string) => void;
  }
  
  export const VisitDetailsForm = ({ visitReason, priorityLevel, onChange }: Props) => {
    return (
      <div className="form-control space-y-4">
        <div>
          <label className="label">Visit Reason</label>
          <input
            type="text"
            className="input input-bordered"
            value={visitReason}
            onChange={(e) => onChange('visitReason', e.target.value)}
            placeholder="e.g. Checkup, Pain, Injury"
          />
        </div>
  
        <div>
          <label className="label">Priority</label>
          <select
            className="select select-bordered"
            value={priorityLevel}
            onChange={(e) => onChange('priorityLevel', e.target.value)}
          >
            <option disabled value="">Select Priority</option>
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
    );
  };
  