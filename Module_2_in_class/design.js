// ME 493B — Shared Design System for Course Presentations
// Reconstructed from Session 1–4 specification

const pptxgen = require("pptxgenjs");

const C = {
  bg: "0F1B2D",
  bgLight: "162236",
  bgMid: "1A2940",
  accent: "00B4D8",
  accent2: "0891B2",
  accent3: "06D6A0",
  white: "FFFFFF",
  text: "E2ECF5",
  muted: "9BB0C7",
  warn: "F97316",
  pink: "E879F9",
  dark: "0A1220",
  ref: "7EA8C9",
};

const F = {
  head: "Trebuchet MS",
  body: "Calibri",
};

const COURSE_LABEL = "M E  4 9 3 B  |  A I  i n  P r o d u c t  D e v e l o p m e n t  |  S p r i n g  2 0 2 6";

// Factory function — NEVER share shadow objects (PptxGenJS mutates in place)
const cardShadow = () => ({
  type: "outer",
  blur: 8,
  offset: 3,
  angle: 135,
  color: "000000",
  opacity: 0.25,
});

function darkBg(slide) {
  slide.background = { color: C.bg };
}

function addFooter(slide, pres, text) {
  slide.addText(text, {
    x: 0.5, y: 5.15, w: 9, h: 0.35,
    fontSize: 9, fontFace: F.body, color: C.muted, align: "left", valign: "bottom",
  });
}

function addRefs(slide, refs) {
  const refText = refs.map((r, i) => `[${i + 1}] ${r}`).join("   ");
  slide.addText(refText, {
    x: 0.5, y: 4.85, w: 9, h: 0.3,
    fontSize: 7, fontFace: F.body, color: C.ref, align: "left", valign: "bottom",
  });
}

function imagePlaceholder(slide, pres, x, y, w, h, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.bgMid },
    line: { color: C.muted, width: 1.5, dashType: "dash" },
  });
  slide.addText(label, {
    x, y, w, h,
    fontSize: 10, fontFace: F.body, color: C.muted, align: "center", valign: "middle", italic: true,
  });
}

function titleSlide(pres, title, subtitle, sessionInfo) {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
  slide.addText(COURSE_LABEL, { x: 0.5, y: 0.4, w: 9, h: 0.4, fontSize: 10, fontFace: F.body, color: C.muted, charSpacing: 1.5 });
  slide.addText(title, { x: 0.5, y: 1.4, w: 9, h: 1.2, fontSize: 44, fontFace: F.head, color: C.white, bold: true, margin: 0 });
  if (subtitle) slide.addText(subtitle, { x: 0.5, y: 2.7, w: 9, h: 0.6, fontSize: 22, fontFace: F.body, color: C.accent, margin: 0 });
  if (sessionInfo) slide.addText(sessionInfo, { x: 0.5, y: 4.6, w: 9, h: 0.5, fontSize: 13, fontFace: F.body, color: C.muted });
  return slide;
}

function sectionSlide(pres, title, subtitle) {
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: 1.2, w: 0.08, h: 2.5, fill: { color: C.accent } });
  slide.addText(title, { x: 0.7, y: 1.3, w: 8.5, h: 1.0, fontSize: 40, fontFace: F.head, color: C.white, bold: true, margin: 0 });
  if (subtitle) slide.addText(subtitle, { x: 0.7, y: 2.5, w: 8.5, h: 0.6, fontSize: 18, fontFace: F.body, color: C.muted, margin: 0 });
  return slide;
}

function contentSlide(pres, title, footerText) {
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, fontFace: F.head, color: C.white, bold: true, margin: 0, valign: "top" });
  if (footerText) addFooter(slide, pres, footerText);
  return slide;
}

function twoCardSlide(pres, title, leftCard, rightCard, footerText) {
  const slide = contentSlide(pres, title, footerText);
  const cardW = 4.2, cardH = 3.6, leftX = 0.5, rightX = 5.3, cardY = 1.2;

  [{ card: leftCard, x: leftX }, { card: rightCard, x: rightX }].forEach(({ card, x }) => {
    slide.addShape(pres.shapes.RECTANGLE, { x, y: cardY, w: cardW, h: cardH, fill: { color: C.bgLight }, shadow: cardShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: cardY, w: cardW, h: 0.05, fill: { color: card.accentColor || C.accent } });
    slide.addText(card.title, { x: x + 0.2, y: cardY + 0.2, w: cardW - 0.4, h: 0.4, fontSize: 15, fontFace: F.head, color: card.accentColor || C.accent, bold: true, margin: 0 });
    const items = card.items.map((item, i) => ({
      text: item,
      options: { bullet: true, breakLine: i < card.items.length - 1, fontSize: 12, fontFace: F.body, color: C.text, paraSpaceAfter: 6 },
    }));
    slide.addText(items, { x: x + 0.2, y: cardY + 0.7, w: cardW - 0.4, h: cardH - 0.9, valign: "top" });
  });
  return slide;
}

function bulletSlide(pres, title, items, opts = {}) {
  const slide = contentSlide(pres, title, opts.footerText);
  const bulletItems = items.map((item, i) => ({
    text: item,
    options: { bullet: true, breakLine: i < items.length - 1, fontSize: opts.fontSize || 14, fontFace: F.body, color: C.text, paraSpaceAfter: 8 },
  }));
  slide.addText(bulletItems, { x: opts.x || 0.7, y: opts.y || 1.3, w: opts.w || 8.6, h: opts.h || 3.5, valign: "top" });
  return slide;
}

function statSlide(pres, title, stats, footerText) {
  const slide = contentSlide(pres, title, footerText);
  const count = stats.length;
  const cardW = count <= 2 ? 3.5 : 2.6;
  const totalW = count * cardW + (count - 1) * 0.3;
  let startX = (10 - totalW) / 2;
  stats.forEach((stat, i) => {
    const x = startX + i * (cardW + 0.3);
    slide.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: cardW, h: 2.8, fill: { color: C.bgLight }, shadow: cardShadow() });
    slide.addText(stat.value, { x, y: 1.7, w: cardW, h: 1.4, fontSize: 48, fontFace: F.head, color: stat.color || C.accent, bold: true, align: "center", valign: "middle" });
    slide.addText(stat.label, { x: x + 0.15, y: 3.2, w: cardW - 0.3, h: 0.9, fontSize: 12, fontFace: F.body, color: C.text, align: "center", valign: "top" });
  });
  return slide;
}

function addNotebookRef(slide, text) {
  slide.addText("NOTEBOOK  " + text, {
    x: 0.5, y: 4.5, w: 9, h: 0.35,
    fontSize: 9, fontFace: F.body, color: "F59E0B", fill: { color: "1F1A00" }, bold: true, margin: [0, 8, 0, 8],
  });
}

module.exports = {
  C, F, COURSE_LABEL, cardShadow, darkBg, addFooter, addRefs, imagePlaceholder,
  titleSlide, sectionSlide, contentSlide, twoCardSlide, bulletSlide, statSlide, addNotebookRef,
};
