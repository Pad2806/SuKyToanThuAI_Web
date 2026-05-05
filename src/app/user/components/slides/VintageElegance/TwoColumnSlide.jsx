import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Two Column Slide
 * Title top center + two warm panels with ornate divider
 * Props: slide.title, slide.columns[{heading, text}]
 */
export default function TwoColumnSlide({ slide }) {
  const columns = slide.columns || [];
  const col1 = columns[0] || {};
  const col2 = columns[1] || {};

  return (
    <div className="ve ve-twocol">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <div className="ve-twocol__title">
        <h2 className="ve-heading ve-heading--lg">
          {slide.title}
        </h2>
      </div>

      <div className="ve-twocol__columns">
        <div className="ve-twocol__col">
          <div className="ve-panel">
            {col1.heading && (
              <h3 className="ve-heading ve-heading--sm" style={{ marginBottom: 8 }}>
                {col1.heading}
              </h3>
            )}
            <p className="ve-body">{col1.text}</p>
          </div>
        </div>

        <div className="ve-twocol__divider">
          <div className="ve-twocol__divider-ornament">❧</div>
        </div>

        <div className="ve-twocol__col">
          <div className="ve-panel">
            {col2.heading && (
              <h3 className="ve-heading ve-heading--sm" style={{ marginBottom: 8 }}>
                {col2.heading}
              </h3>
            )}
            <p className="ve-body">{col2.text}</p>
          </div>
        </div>
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
