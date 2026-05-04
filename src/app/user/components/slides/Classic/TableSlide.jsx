import { FaBook } from "react-icons/fa";

export default function TableSlide({ slide }) {
  const headers = slide.table_headers || [];
  const rows = slide.table_rows || [];

  return (
    <div className="s s-table-slide">
      <div className="s-heading">
        <div className="s-heading__bar" />
        <h2 className="s-heading__text">{slide.title}</h2>
      </div>

      <table className="s-table-slide__table">
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
        <p className="s-table-slide__footer">{slide.footer_text}</p>
      )}

      <div className="s-footer">
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
