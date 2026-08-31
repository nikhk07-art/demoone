export function formatINR(num: number | string): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactINR(num: number | string): string {
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "₹0";
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(value);
}

export type RoleType =
  | "Super Admin"
  | "Organization Admin"
  | "Chapter Admin"
  | "Member"
  | "Staff"
  | "Viewer";

export function canManageMembers(role: RoleType): boolean {
  return ["Super Admin", "Organization Admin", "Chapter Admin"].includes(role);
}

export function canOverrideCategoryCapacity(role: RoleType): boolean {
  return ["Super Admin", "Organization Admin"].includes(role);
}

export function canManageSettings(role: RoleType): boolean {
  return ["Super Admin", "Organization Admin"].includes(role);
}
