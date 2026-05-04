import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Data & Results Slide
 * Cream/beige background, chart panel left + text right
 * No chart data & no image → full width text
 * Props: slide.title, slide.content, slide.chart_data[{label, value, percent}]
 */
export default function DataResultsSlide({ slide, imageUrl }) {
  const chartData = slide.chart_data || [];
  const hasChart = chartData.length > 0;
  const hasImage = !!imageUrl;
  const hasLeftContent = hasChart || hasImage;

  return (
    <div className="bw bw-data">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      {/* Left — chart or image (only if content exists) */}
      {hasLeftContent && (
        <div className="bw-data__chart-side">
          <div className="bw-data__chart-panel">
            {hasChart ? (
              <div className="bw-data__barchart">
                {chartData.map((item, i) => (
                  <div key={i} className="bw-data__bar-item">
                    <span className="bw-data__bar-label">{item.label}</span>
                    <div className="bw-data__bar-wrap">
                      <div
                        className={`bw-data__bar-fill ${i % 2 === 0 ? "bw-data__bar-fill--dark" : "bw-data__bar-fill--light"}`}
                        style={{ width: `${item.percent || 50}%` }}
                      />
                    </div>
                    <span className="bw-data__bar-value">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={slide.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                onError={e => { e.target.parentElement.style.display = "none"; }}
              />
            )}
          </div>
        </div>
      )}

      {/* Right — title + description */}
      <div className="bw-data__text-side" style={!hasLeftContent ? { width: "100%", alignItems: "center", textAlign: "center" } : undefined}>
        <h2 className="bw-heading bw-heading--lg bw-heading--dark">
          {slide.title}
        </h2>
        <div className="bw-diamond-divider" style={hasLeftContent ? { justifyContent: "flex-start" } : undefined}>
          <div className="bw-diamond-divider__line" />
          <div className="bw-diamond-divider__dot" style={{ background: "#4a4035" }} />
          <div className="bw-diamond-divider__line" />
        </div>
        {slide.content && (
          <p className="bw-body bw-body--dark" style={!hasLeftContent ? { maxWidth: 560 } : undefined}>{slide.content}</p>
        )}
      </div>

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer" style={{ color: "#6a5d4a" }}>
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
