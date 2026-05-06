export default function IntroBlock({ data }) {
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-intro">
      <div className="ig-ornament">☬ ═══════════════ ☬</div>

      {imageUrl && (
        <div className="ig-block__image-frame ig-block__image-frame--rounded">
          <img src={imageUrl} alt="Giới thiệu" onError={e => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}

      <p className="ig-intro__text">{data.content}</p>
    </div>
  );
}
