const Loader = ({ inline = false, text }) => {
  if (inline) return <span className="loader-inline" title={text} />;

  return (
    <div className="loader-wrap">
      <div className="loader" role="status" aria-label={text || 'Loading'} />
    </div>
  );
};

export default Loader;
