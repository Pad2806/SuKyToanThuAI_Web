import { FaQuoteLeft, FaBook } from "react-icons/fa";

export default function QuoteSlide({ slide }) {
  return (
    <div className="s s-quote-slide">
      <div className="s-heading">
        <div className="s-heading__bar" />
        <h2 className="s-heading__text">{slide.title}</h2>
      </div>

      <div className="s-quote-slide__body">
        <div className="s-quote-slide__icon">
          <FaQuoteLeft size={24} />
        </div>
        <p className="s-quote-slide__text">
          {slide.quote_text || slide.content}
        </p>
        {slide.quote_author && (
          <p className="s-quote-slide__author">
            — {slide.quote_author}
          </p>
        )}
        {slide.quote_context && (
          <p className="s-quote-slide__context">{slide.quote_context}</p>
        )}
      </div>

      <div className="s-footer">
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
