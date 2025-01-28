import React from "react";

export const TextInput = ({ id, value, onChange, placeholder }) => (
  <div className="input-container">
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange} // Use the parent-provided onChange function
      placeholder={placeholder}
      className="text-input"
    />
  </div>
);

export default TextInput;
