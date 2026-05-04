import { FaBook, FaImage } from "react-icons/fa";

/**
 * BlackWhiteModel — Image Sources Slide
 * Dark themed list of image sources
 * Props: slide.title, slide.sources[{name, url, thumb_url}]
 */
export default function ImageSourcesSlide({ slide }) {
  const sources = slide.sources || [];

  return (
    <div className="bw bw-sources">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <div className="bw-sources__title">
        <h2 className="bw-heading bw-heading--lg bw-heading--cream">
          {slide.title || "Nguồn ảnh"}
        </h2>
        <div className="bw-diamond-divider">
          <div className="bw-diamond-divider__line" />
          <div className="bw-diamond-divider__dot" />
          <div className="bw-diamond-divider__line" />
        </div>
      </div>

      <div className="bw-sources__list">
        {sources.map((src, i) => (
          <div key={i} className="bw-sources__item">
            <div className="bw-sources__thumb">
              {src.thumb_url ? (
                <img src={src.thumb_url} alt={src.name} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <div className="bw-sources__thumb-placeholder">
                  <FaImage size={12} />
                </div>
              )}
            </div>
            <div className="bw-sources__info">
              <p className="bw-sources__name">{src.name}</p>
              <p className="bw-sources__url">{src.url || "Wikimedia Commons"}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
