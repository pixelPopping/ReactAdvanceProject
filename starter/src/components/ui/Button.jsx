export const Button = () => {
  return (
    <div>
      <button
        className="button"
        onClick={() => (window.location.href = "/FormPage/")}
      >
        Add Event
      </button>
    </div>
  );
};
