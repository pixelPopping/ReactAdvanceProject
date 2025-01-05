export const BackButton = () => {
  return (
    <div>
      <button className="button" onClick={() => (window.location.href = "/")}>
        Back to events
      </button>
    </div>
  );
};
