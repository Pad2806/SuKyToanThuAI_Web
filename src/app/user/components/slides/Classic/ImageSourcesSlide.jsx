import { FaBook, FaImage } from "react-icons/fa";

export default function ImageSourcesSlide({ slide }) {
  const sources = slide.sources || [];

  return (
    <div className="s s-sources">
      <div className="s-heading">
        <div className="s-heading__bar" />
        <h2 className="s-heading__text">{slide.title || "Image Sources"}</h2>
      </div>

      <div className="s-sources__list">
        {sources.map((src, i) => (
          <div key={i} className="s-sources__item">
            <div className="s-sources__thumb">
              {src.thumb_url ? (
                <img src={src.thumb_url} alt={src.name} onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div className="s-sources__thumb-placeholder">
                  <FaImage size={14} />
                </div>
              )}
            </div>
            <div className="s-sources__info">
              <p className="s-sources__name">{src.name}</p>
              <p className="s-sources__url">{src.url || "Wikimedia Commons"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="s-footer">
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
