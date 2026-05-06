export default function GalleryBlock({ data }) {
  const images = data.images || [];
  if (images.length === 0) return null;

  return (
    <div className="ig-block ig-gallery">
      <div className="ig-ornament">☬ ─── ◆ ─── ☬</div>
      {data.title && <h2 className="ig-section-title">{data.title}</h2>}
      <div className="ig-gallery__grid">
        {images.map((img, i) => (
          <div key={i} className="ig-gallery__item">
            <img src={img.url} alt={img.caption} onError={e => { e.target.parentElement.style.display = "none"; }} />
            {img.caption && <span className="ig-gallery__caption">{img.caption}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
