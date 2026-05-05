// ── Classic template ──
import ClassicTitleSlide from "./slides/Classic/TitleSlide";
import ClassicContentSlide from "./slides/Classic/ContentSlide";
import ClassicTwoColumnSlide from "./slides/Classic/TwoColumnSlide";
import ClassicTimelineSlide from "./slides/Classic/TimelineSlide";
import ClassicSummarySlide from "./slides/Classic/SummarySlide";
import ClassicQuoteSlide from "./slides/Classic/QuoteSlide";
import ClassicTableSlide from "./slides/Classic/TableSlide";
import ClassicSectionDividerSlide from "./slides/Classic/SectionDividerSlide";
import ClassicImageSourcesSlide from "./slides/Classic/ImageSourcesSlide";

// ── BlackWhiteModel template ──
import BWTitleSlide from "./slides/BlackWhiteModel/TitleSlide";
import BWIntroductionSlide from "./slides/BlackWhiteModel/IntroductionSlide";
import BWContentSlide from "./slides/BlackWhiteModel/ContentSlide";
import BWTwoColumnSlide from "./slides/BlackWhiteModel/TwoColumnSlide";
import BWTimelineSlide from "./slides/BlackWhiteModel/TimelineSlide";
import BWSummarySlide from "./slides/BlackWhiteModel/SummarySlide";
import BWQuoteSlide from "./slides/BlackWhiteModel/QuoteSlide";
import BWTableSlide from "./slides/BlackWhiteModel/TableSlide";
import BWDataResultsSlide from "./slides/BlackWhiteModel/DataResultsSlide";
import BWSectionDividerSlide from "./slides/BlackWhiteModel/SectionDividerSlide";
import BWEndingSlide from "./slides/BlackWhiteModel/EndingSlide";
import BWImageSourcesSlide from "./slides/BlackWhiteModel/ImageSourcesSlide";

// ── VintageElegance template ──
import VETitleSlide from "./slides/VintageElegance/TitleSlide";
import VEIntroductionSlide from "./slides/VintageElegance/IntroductionSlide";
import VEContentSlide from "./slides/VintageElegance/ContentSlide";
import VETwoColumnSlide from "./slides/VintageElegance/TwoColumnSlide";
import VETimelineSlide from "./slides/VintageElegance/TimelineSlide";
import VESummarySlide from "./slides/VintageElegance/SummarySlide";
import VEQuoteSlide from "./slides/VintageElegance/QuoteSlide";
import VETableSlide from "./slides/VintageElegance/TableSlide";
import VEDataResultsSlide from "./slides/VintageElegance/DataResultsSlide";
import VESectionDividerSlide from "./slides/VintageElegance/SectionDividerSlide";
import VEEndingSlide from "./slides/VintageElegance/EndingSlide";
import VEImageSourcesSlide from "./slides/VintageElegance/ImageSourcesSlide";

import "../styles/SlideTemplates.css";
import "../styles/BlackWhiteModel.css";
import "../styles/VintageElegance.css";

// ── Template maps ──
const CLASSIC_MAP = {
  title: ClassicTitleSlide,
  content: ClassicContentSlide,
  two_column: ClassicTwoColumnSlide,
  timeline: ClassicTimelineSlide,
  summary: ClassicSummarySlide,
  quote: ClassicQuoteSlide,
  table: ClassicTableSlide,
  section_divider: ClassicSectionDividerSlide,
  image_sources: ClassicImageSourcesSlide,
};

const BW_MAP = {
  title: BWTitleSlide,
  introduction: BWIntroductionSlide,
  content: BWContentSlide,
  two_column: BWTwoColumnSlide,
  timeline: BWTimelineSlide,
  summary: BWSummarySlide,
  quote: BWQuoteSlide,
  table: BWTableSlide,
  data_results: BWDataResultsSlide,
  section_divider: BWSectionDividerSlide,
  ending: BWEndingSlide,
  image_sources: BWImageSourcesSlide,
};

const VE_MAP = {
  title: VETitleSlide,
  introduction: VEIntroductionSlide,
  content: VEContentSlide,
  two_column: VETwoColumnSlide,
  timeline: VETimelineSlide,
  summary: VESummarySlide,
  quote: VEQuoteSlide,
  table: VETableSlide,
  data_results: VEDataResultsSlide,
  section_divider: VESectionDividerSlide,
  ending: VEEndingSlide,
  image_sources: VEImageSourcesSlide,
};

const TEMPLATE_MAPS = {
  Classic: CLASSIC_MAP,
  BlackWhiteModel: BW_MAP,
  VintageElegance: VE_MAP,
};

export default function SlidePreview({
  slide, asset, slideIndex, totalSlides,
  onRegenerate, isRegenerating = false,
  onClick, isSelected = false,
  template = "Classic",
}) {
  const imageUrl = asset?.source !== "fallback" ? asset?.image_url : null;
  const layout = slide.layout_type || "content";

  function renderSlideContent() {
    const map = TEMPLATE_MAPS[template] || CLASSIC_MAP;
    const SlideComponent = map[layout] || map["content"] || ClassicContentSlide;
    return <SlideComponent slide={slide} imageUrl={imageUrl} />;
  }

  return (
    <div
      className={`slide-preview ${isSelected ? "slide-preview--editing" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {renderSlideContent()}
      <div className="slide-preview__num">{slideIndex} / {totalSlides}</div>
      {onRegenerate && (
        <button
          onClick={(e) => { e.stopPropagation(); onRegenerate(slide, asset); }}
          disabled={isRegenerating}
          className="slide-regen-btn"
        >
          {isRegenerating ? "Đang tìm..." : "Đổi ảnh"}
        </button>
      )}
    </div>
  );
}
