import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Table Slide
 * Dark themed table with ornamental borders
 * Props: slide.title, slide.table_headers[], slide.table_rows[][],
 *        slide.footer_text
 */
export default function TableSlide({ slide }) {
  const headers = slide.table_headers || [];
  const rows = slide.table_rows || [];

  return (
    <div className="bw bw-table">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <div className="bw-table__title">
        <h2 className="bw-heading bw-heading--lg bw-heading--cream">
          {slide.title}
        </h2>
        <div className="bw-diamond-divider">
          <div className="bw-diamond-divider__line" />
          <div className="bw-diamond-divider__dot" />
          <div className="bw-diamond-divider__line" />
        </div>
      </div>

      <table className="bw-table__grid">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {slide.footer_text && (
        <p className="bw-table__footer-text">{slide.footer_text}</p>
      )}

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
