import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Data & Results Slide
 * Props: slide.title, slide.content, slide.chart_data[{label, value, percent}]
 */
export default function DataResultsSlide({ slide, imageUrl }) {
  const chartData = slide.chart_data || [];
  const hasChart = chartData.length > 0;
  const hasImage = !!imageUrl;
  const hasLeft = hasChart || hasImage;

  return (
    <div className="ve ve-data">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      {hasLeft && (
        <div className="ve-data__chart-side">
          <div className="ve-data__chart-panel">
            {hasChart ? (
              <div className="ve-data__barchart">
                {chartData.map((item, i) => (
                  <div key={i} className="ve-data__bar-item">
                    <span className="ve-data__bar-label">{item.label}</span>
                    <div className="ve-data__bar-wrap">
                      <div
                        className={`ve-data__bar-fill ${i % 2 === 0 ? "ve-data__bar-fill--dark" : "ve-data__bar-fill--light"}`}
                        style={{ width: `${item.percent || 50}%` }}
                      />
                    </div>
                    <span className="ve-data__bar-value">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <img src={imageUrl} alt={slide.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} onError={e => { e.target.parentElement.style.display = "none"; }} />
            )}
          </div>
        </div>
      )}

      <div className="ve-data__text-side" style={!hasLeft ? { width: "100%", alignItems: "center", textAlign: "center" } : undefined}>
        <h2 className="ve-heading ve-heading--lg">{slide.title}</h2>
        <div className="ve-ornate-divider" style={hasLeft ? { justifyContent: "flex-start" } : undefined}>
          <div className="ve-ornate-divider__line" />
          <div className="ve-ornate-divider__flourish">✦</div>
          <div className="ve-ornate-divider__line" />
        </div>
        {slide.content && <p className="ve-body" style={!hasLeft ? { maxWidth: 560 } : undefined}>{slide.content}</p>}
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
