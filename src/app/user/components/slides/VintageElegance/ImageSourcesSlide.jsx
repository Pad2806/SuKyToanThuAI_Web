import { FaBook, FaImage } from "react-icons/fa";

/**
 * VintageElegance — Image Sources Slide
 * Props: slide.title, slide.sources[{name, url, thumb_url}]
 */
export default function ImageSourcesSlide({ slide }) {
  const sources = slide.sources || [];

  return (
    <div className="ve ve-sources">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <div className="ve-sources__title">
        <h2 className="ve-heading ve-heading--lg">{slide.title || "Nguồn ảnh"}</h2>
        <div className="ve-ornate-divider">
          <div className="ve-ornate-divider__line" />
          <div className="ve-ornate-divider__flourish">✦</div>
          <div className="ve-ornate-divider__line" />
        </div>
      </div>

      <div className="ve-sources__list">
        {sources.map((src, i) => (
          <div key={i} className="ve-sources__item">
            <div className="ve-sources__thumb">
              {src.thumb_url ? (
                <img src={src.thumb_url} alt={src.name} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <div className="ve-sources__thumb-placeholder"><FaImage size={12} /></div>
              )}
            </div>
            <div className="ve-sources__info">
              <p className="ve-sources__name">{src.name}</p>
              <p className="ve-sources__url">{src.url || "Wikimedia Commons"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
