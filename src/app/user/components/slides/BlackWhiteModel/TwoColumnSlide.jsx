import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Two Column Slide
 * Title top center + two dark panels with diamond divider
 * Props: slide.title, slide.columns[{heading, text}]
 */
export default function TwoColumnSlide({ slide }) {
  const columns = slide.columns || [];
  const col1 = columns[0] || {};
  const col2 = columns[1] || {};

  return (
    <div className="bw bw-twocol">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <div className="bw-twocol__title">
        <h2 className="bw-heading bw-heading--lg bw-heading--cream">
          {slide.title}
        </h2>
      </div>

      <div className="bw-twocol__columns">
        <div className="bw-twocol__col">
          <div className="bw-panel">
            {col1.heading && (
              <h3 className="bw-heading bw-heading--sm" style={{ marginBottom: 8 }}>
                {col1.heading}
              </h3>
            )}
            <p className="bw-body">{col1.text}</p>
          </div>
        </div>

        <div className="bw-twocol__divider">
          <div className="bw-twocol__divider-diamond" />
        </div>

        <div className="bw-twocol__col">
          <div className="bw-panel">
            {col2.heading && (
              <h3 className="bw-heading bw-heading--sm" style={{ marginBottom: 8 }}>
                {col2.heading}
              </h3>
            )}
            <p className="bw-body">{col2.text}</p>
          </div>
        </div>
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
