import {
  HeaderBlock, IntroBlock, TimelineBlock, StatsBlock,
  QuoteBlock, ComparisonBlock, GalleryBlock, KeyFiguresBlock,
  FooterBlock, OuttroBlock,
} from "./template1";

import {
  HeaderBlock as T2HeaderBlock, IntroBlock as T2IntroBlock,
  TimelineBlock as T2TimelineBlock, StatsBlock as T2StatsBlock,
  QuoteBlock as T2QuoteBlock, ComparisonBlock as T2ComparisonBlock,
  GalleryBlock as T2GalleryBlock, KeyFiguresBlock as T2KeyFiguresBlock,
  FooterBlock as T2FooterBlock, OuttroBlock as T2OuttroBlock,
} from "./template2";

import {
  HeaderBlock as T3HeaderBlock, IntroBlock as T3IntroBlock,
  TimelineBlock as T3TimelineBlock, StatsBlock as T3StatsBlock,
  QuoteBlock as T3QuoteBlock, ComparisonBlock as T3ComparisonBlock,
  GalleryBlock as T3GalleryBlock, KeyFiguresBlock as T3KeyFiguresBlock,
  FooterBlock as T3FooterBlock, OuttroBlock as T3OuttroBlock,
} from "./template3";

import "../../styles/Infographic.css";
import "../../styles/InfographicTemplate2.css";
import "../../styles/InfographicTemplate3.css";

const BLOCK_TYPES = ["header","intro","timeline","stats","quote","comparison","gallery","key_figures","footer","outtro"];

function buildMap(modules) {
  const map = {};
  BLOCK_TYPES.forEach((type, i) => { map[type] = modules[i]; });
  return map;
}

const T1_MAP = buildMap([HeaderBlock, IntroBlock, TimelineBlock, StatsBlock, QuoteBlock, ComparisonBlock, GalleryBlock, KeyFiguresBlock, FooterBlock, OuttroBlock]);
const T2_MAP = buildMap([T2HeaderBlock, T2IntroBlock, T2TimelineBlock, T2StatsBlock, T2QuoteBlock, T2ComparisonBlock, T2GalleryBlock, T2KeyFiguresBlock, T2FooterBlock, T2OuttroBlock]);
const T3_MAP = buildMap([T3HeaderBlock, T3IntroBlock, T3TimelineBlock, T3StatsBlock, T3QuoteBlock, T3ComparisonBlock, T3GalleryBlock, T3KeyFiguresBlock, T3FooterBlock, T3OuttroBlock]);

const TEMPLATE_MAPS = { template1: T1_MAP, template2: T2_MAP, template3: T3_MAP };
const TEMPLATE_CLASSES = { template1: "", template2: "infographic--template2", template3: "infographic--template3" };

export default function InfographicRenderer({ blocks, rendererRef, template = "template1" }) {
  const map = TEMPLATE_MAPS[template] || T1_MAP;
  const cls = TEMPLATE_CLASSES[template] || "";

  return (
    <div className={`infographic ${cls}`} ref={rendererRef}>
      {blocks.map((block) => {
        const BlockComp = map[block.block_type];
        if (!BlockComp) return null;
        return <BlockComp key={block.block_order} data={block} />;
      })}
    </div>
  );
}
