import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Export infographic as a single-page PDF that fits the content exactly.
 * No page breaks, no extra white space at the bottom.
 *
 * Strategy: capture the full element → create a PDF with custom page size
 * matching the exact aspect ratio of the content (A4 width, variable height).
 *
 * @param {HTMLElement} element   DOM node to capture (the .infographic container)
 * @param {string}      fileName  Base name for the downloaded file (no extension)
 */
export async function exportInfographicPDF(element, fileName) {
  if (!element) throw new Error("No element provided for PDF export");

  const A4_WIDTH_MM = 210;
  const SCALE = 2;

  // ── 1. Capture toàn bộ infographic ─────────────────────────────────
  const canvas = await html2canvas(element, {
    scale: SCALE,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  // ── 2. Tính chiều cao PDF theo tỷ lệ nội dung ─────────────────────
  const imgWidthPx = canvas.width;
  const imgHeightPx = canvas.height;
  const pageHeightMM = (imgHeightPx * A4_WIDTH_MM) / imgWidthPx;

  // ── 3. Tạo PDF với kích thước vừa khít nội dung ───────────────────
  const pdf = new jsPDF({
    orientation: pageHeightMM > A4_WIDTH_MM ? "portrait" : "landscape",
    unit: "mm",
    format: [A4_WIDTH_MM, pageHeightMM],
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, pageHeightMM);

  // ── 4. Download ────────────────────────────────────────────────────
  const safeName = fileName.replace(/[<>:"/\\|?*]+/g, "_");
  pdf.save(`${safeName}.pdf`);
}
