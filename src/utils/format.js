/**
 * Format currency utility for AutoPremium
 * Tỷ giá quy đổi ước tính: 1 USD ~ 25,400 VNĐ
 */
export function formatVndPrice(usdPrice) {
  const num = Number(usdPrice) || 0;
  const billion = (num * 25400 / 1_000_000_000).toFixed(1);
  return `~ ${billion} tỷ VNĐ`;
}

export function formatVndInstallment(monthlyUsd) {
  const num = Number(monthlyUsd) || 0;
  const million = Math.round(num * 25400 / 1_000_000);
  return `~ ${million} tr VNĐ/tháng`;
}
