import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Export a DOM element as a multi-page A4 PDF.
 *
 * Strategy: capture the entire element with html2canvas at 2× resolution,
 * then slice the resulting canvas into A4-sized chunks and paint each
 * chunk onto a jsPDF page using JPEG (quality 0.95) to keep file size low.
 *
 * @param {HTMLElement} element   DOM node to capture (e.g. .infographic)
 * @param {string}      fileName  Base name for the downloaded file (no extension)
 * @returns {Promise<void>}
 */
export async function exportInfographicPDF(element, fileName) {
  if (!element) throw new Error("No element provided for PDF export");

  // ── 1. Capture DOM → canvas ──────────────────────────────────────────
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  // ── 2. Calculate pagination ──────────────────────────────────────────
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  const imgWidthPx = canvas.width;
  const imgHeightPx = canvas.height;

  // How many canvas-pixels fit into one A4 page height?
  const pageHeightPx = (imgWidthPx * A4_HEIGHT_MM) / A4_WIDTH_MM;
  const totalPages = Math.ceil(imgHeightPx / pageHeightPx);

  // ── 3. Build PDF ────────────────────────────────────────────────────
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    // Crop a slice of the source canvas
    const sliceY = page * pageHeightPx;
    const sliceH = Math.min(pageHeightPx, imgHeightPx - sliceY);

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = imgWidthPx;
    sliceCanvas.height = sliceH;

    const ctx = sliceCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0, sliceY,          // source x, y
      imgWidthPx, sliceH, // source w, h
      0, 0,               // dest x, y
      imgWidthPx, sliceH, // dest w, h
    );

    const sliceDataUrl = sliceCanvas.toDataURL("image/jpeg", 0.95);
    const sliceHeightMM = (sliceH * A4_WIDTH_MM) / imgWidthPx;

    pdf.addImage(sliceDataUrl, "JPEG", 0, 0, A4_WIDTH_MM, sliceHeightMM);
  }

  // ── 4. Download ─────────────────────────────────────────────────────
  const safeName = fileName.replace(/[<>:"/\\|?*]+/g, "_");
  pdf.save(`${safeName}.pdf`);
}
