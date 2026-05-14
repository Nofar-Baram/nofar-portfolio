const BCardCover = ({ p }) => {
  const cover = p.coverImage || null;
  if (cover) return <img src={cover} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />;
  return <div className="bcard-cover-fallback">0{p.id}</div>;
};

export default BCardCover;
