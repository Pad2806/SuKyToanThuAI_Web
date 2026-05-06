export default function OuttroBlock({ data }) {
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-intro">
      <div className="ig-ornament">☬ ═══════════════ ☬</div>

      {data.title && <h2 className="ig-block__title">{data.title}</h2>}

      {imageUrl && (
        <div className="ig-block__image-frame ig-block__image-frame--rounded">
          <img src={imageUrl} alt={data.title || "Ý nghĩa lịch sử"} onError={e => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}

      <p className="ig-intro__text">{data.content}</p>
    </div>
  );
}
