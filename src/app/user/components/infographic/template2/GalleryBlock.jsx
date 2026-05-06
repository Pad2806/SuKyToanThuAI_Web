export default function GalleryBlock({ data }) {
  const images = data.images || [];
  if (images.length === 0) return null;

  return (
    <div className="ig2-block ig2-gallery">
      {data.title && <h2 className="ig2-section-title">{data.title}</h2>}
      <div className="ig2-gallery__grid">
        {images.map((img, i) => (
          <div key={i} className="ig2-gallery__item">
            <div className="ig2-gallery__frame">
              <img src={img.url} alt={img.caption} onError={e => { e.target.parentElement.style.display = "none"; }} />
            </div>
            {img.caption && <span className="ig2-gallery__caption">{img.caption}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
