import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Table Slide
 * Warm parchment themed table with ornamental borders
 * Props: slide.title, slide.table_headers[], slide.table_rows[][],
 *        slide.footer_text
 */
export default function TableSlide({ slide }) {
  const headers = slide.table_headers || [];
  const rows = slide.table_rows || [];

  return (
    <div className="ve ve-table">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <div className="ve-table__title">
        <h2 className="ve-heading ve-heading--lg">
          {slide.title}
        </h2>
        <div className="ve-ornate-divider">
          <div className="ve-ornate-divider__line" />
          <div className="ve-ornate-divider__flourish">✦</div>
          <div className="ve-ornate-divider__line" />
        </div>
      </div>

      <table className="ve-table__grid">
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
        <p className="ve-table__footer-text">{slide.footer_text}</p>
      )}

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
