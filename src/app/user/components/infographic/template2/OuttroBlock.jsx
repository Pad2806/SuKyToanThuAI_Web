export default function OuttroBlock({ data }) {
  const imageUrl = data.image_url || null;
  return (
    <div className="ig2-block ig2-outtro">
      {data.title && <h2 className="ig2-section-title">{data.title}</h2>}
      {imageUrl && (
        <div className="ig2-outtro__frame">
          <img src={imageUrl} alt={data.title || "Ý nghĩa"} onError={e => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}
      <p className="ig2-outtro__text">{data.content}</p>
    </div>
  );
}
