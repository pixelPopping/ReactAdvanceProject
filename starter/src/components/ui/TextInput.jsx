export const TextInput = ({ id, value, changeFn, placeholder }) => (
  <input
    id={id}
    type="text"
    value={value}
    onChange={changeFn}
    placeholder={placeholder}
  />
);
