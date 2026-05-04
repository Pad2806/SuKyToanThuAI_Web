import { FaQuoteLeft, FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Quote Slide
 * Centered quote with ornamental diamond dividers
 * Props: slide.title, slide.quote_text || slide.content,
 *        slide.quote_author, slide.quote_context
 */
export default function QuoteSlide({ slide }) {
  return (
    <div className="bw bw-quote">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <h2 className="bw-heading bw-heading--md bw-heading--cream" style={{ marginBottom: 12 }}>
        {slide.title}
      </h2>

      <div className="bw-diamond-divider">
        <div className="bw-diamond-divider__line" />
        <div className="bw-diamond-divider__dot" />
        <div className="bw-diamond-divider__line" />
      </div>

      <div className="bw-quote__icon">
        <FaQuoteLeft />
      </div>

      <p className="bw-quote__text">
        {slide.quote_text || slide.content}
      </p>

      {slide.quote_author && (
        <p className="bw-quote__author">— {slide.quote_author}</p>
      )}

      {slide.quote_context && (
        <p className="bw-quote__context">{slide.quote_context}</p>
      )}

      <div className="bw-diamond-divider" style={{ marginTop: 14 }}>
        <div className="bw-diamond-divider__line" />
        <div className="bw-diamond-divider__dot" />
        <div className="bw-diamond-divider__line" />
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
