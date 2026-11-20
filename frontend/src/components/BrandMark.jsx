import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from "../config/brand";

export default function BrandMark({ compact = false, light = false }) {
  return (
    <div className="brand">
      <div className="brand-mark">S</div>
      <div className="brand-text">
        <div className={`brand-name${light ? " text-white" : ""}`}>{compact ? BRAND_SHORT : BRAND_NAME}</div>
        <div className={`brand-tagline${light ? " text-white-50" : ""}`}>{BRAND_TAGLINE}</div>
      </div>
    </div>
  );
}
