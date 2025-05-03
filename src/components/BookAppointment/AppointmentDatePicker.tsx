interface Props {
    value: string;
    onChange: (value: string) => void;
  }
  
  export const AppointmentDatePicker = ({ value, onChange }: Props) => {
    return (
      <div className="form-control">
        <label className="label">Select Date</label>
        <input
          type="date"
          className="input input-bordered"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };
  