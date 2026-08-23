export function TextField({ label, required, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label>{label}{required && " *"}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

export function TextAreaField({ label, required, value, onChange, placeholder }) {
  return (
    <div>
      <label>{label}{required && " *"}</label>
      <textarea placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}

export function SelectField({ label, required, value, onChange, options, placeholder = "Select" }) {
  return (
    <div>
      <label>{label}{required && " *"}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

export function RadioGroup({ label, required, value, onChange, options, name }) {
  return (
    <div>
      <label>{label}{required && " *"}</label>
      <div className="gender">
        {options.map((o) => (
          <label key={o}>
            <input type="radio" name={name} checked={value === o} onChange={() => onChange(o)} /> {o}
          </label>
        ))}
      </div>
    </div>
  );
}

export function FileDrop({ label, required, hint, fileName, onChange }) {
  return (
    <div>
      <label>{label}{required && " *"}</label>
      <div className={`file-drop ${fileName ? "has-file" : ""}`}>
        <div className="file-drop-icon">
          <i className={fileName ? "bi bi-check-circle" : "bi bi-cloud-arrow-up"}></i>
        </div>
        <div className="file-drop-text">
          <div className="file-drop-name">{fileName || "Choose file…"}</div>
          <div className="file-drop-hint">{hint}</div>
        </div>
        <input type="file" onChange={(e) => onChange(e.target.files?.[0]?.name || "")} />
      </div>
    </div>
  );
}
