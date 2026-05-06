import {
  HeaderBlock,
  IntroBlock,
  TimelineBlock,
  StatsBlock,
  QuoteBlock,
  ComparisonBlock,
  GalleryBlock,
  KeyFiguresBlock,
  FooterBlock,
} from "./template1";

const BLOCK_MAP = {
  header: HeaderBlock,
  intro: IntroBlock,
  timeline: TimelineBlock,
  stats: StatsBlock,
  quote: QuoteBlock,
  comparison: ComparisonBlock,
  gallery: GalleryBlock,
  key_figures: KeyFiguresBlock,
  footer: FooterBlock,
};

export default function InfographicRenderer({ blocks, rendererRef }) {
  return (
    <div className="infographic" ref={rendererRef}>
      {blocks.map((block) => {
        const BlockComp = BLOCK_MAP[block.block_type];
        if (!BlockComp) return null;
        return <BlockComp key={block.block_order} data={block} />;
      })}
    </div>
  );
}
