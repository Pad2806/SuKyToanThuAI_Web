import { FaQuoteLeft, FaBook } from "react-icons/fa";

/**
 * VintageElegance — Quote Slide
 * Centered quote with ornamental flourish dividers
 * Props: slide.title, slide.quote_text || slide.content,
 *        slide.quote_author, slide.quote_context
 */
export default function QuoteSlide({ slide }) {
  return (
    <div className="ve ve-quote">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <h2 className="ve-heading ve-heading--md" style={{ marginBottom: 12 }}>
        {slide.title}
      </h2>

      <div className="ve-ornate-divider">
        <div className="ve-ornate-divider__line" />
        <div className="ve-ornate-divider__flourish">✦</div>
        <div className="ve-ornate-divider__line" />
      </div>

      <div className="ve-quote__icon">
        <FaQuoteLeft />
      </div>

      <p className="ve-quote__text">
        {slide.quote_text || slide.content}
      </p>

      {slide.quote_author && (
        <p className="ve-quote__author">— {slide.quote_author}</p>
      )}

      {slide.quote_context && (
        <p className="ve-quote__context">{slide.quote_context}</p>
      )}

      <div className="ve-ornate-divider" style={{ marginTop: 14 }}>
        <div className="ve-ornate-divider__line" />
        <div className="ve-ornate-divider__flourish">✦</div>
        <div className="ve-ornate-divider__line" />
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
