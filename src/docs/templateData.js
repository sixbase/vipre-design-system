/* ----------------------------------------------------------------------------
   Shared demo data for the Template pages. Realistic Vipre-flavored numbers —
   customers, devices, policies, products — so every template demo tells the
   same story. Demo-only: nothing here ships in the library bundles.
   -------------------------------------------------------------------------- */

/* Product glyphs — SVG path strings drawn on the ProductTile's 32×32 grid.
   In a real app these ship with your product config, not the design system. */
export const GLYPHS = {
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
  sat: 'M17 26.2115L8.25 21.3558V11.6443L17 6.7885L25.75 11.6443V21.3558L17 26.2115ZM14.148 14.0578C14.5122 13.6449 14.941 13.3238 15.4345 13.0943C15.9282 12.8648 16.45 12.75 17 12.75C17.55 12.75 18.0718 12.8648 18.5655 13.0943C19.059 13.3238 19.4878 13.6449 19.852 14.0578L23.4098 12.075L17 8.5115L10.5903 12.075L14.148 14.0578ZM16.25 24.073V20.1828C15.3692 19.9878 14.649 19.548 14.0895 18.8635C13.5298 18.1788 13.25 17.391 13.25 16.5C13.25 16.2975 13.2632 16.1074 13.2895 15.9298C13.3157 15.7523 13.3602 15.5705 13.423 15.3845L9.75 13.327V20.4693L16.25 24.073ZM18.5953 18.0953C19.0318 17.6588 19.25 17.127 19.25 16.5C19.25 15.873 19.0318 15.3413 18.5953 14.9048C18.1588 14.4683 17.627 14.25 17 14.25C16.373 14.25 15.8413 14.4683 15.4048 14.9048C14.9683 15.3413 14.75 15.873 14.75 16.5C14.75 17.127 14.9683 17.6588 15.4048 18.0953C15.8413 18.5318 16.373 18.75 17 18.75C17.627 18.75 18.1588 18.5318 18.5953 18.0953ZM17.75 24.073L24.25 20.4693V13.327L20.577 15.3845C20.6398 15.5705 20.6843 15.7523 20.7105 15.9298C20.7368 16.1074 20.75 16.2975 20.75 16.5C20.75 17.391 20.4702 18.1788 19.9105 18.8635C19.351 19.548 18.6308 19.9878 17.75 20.1828V24.073Z',
}

/* ---- Customer directory ---------------------------------------------------- */

export const CUSTOMER_TYPE = {
  distributor: { label: 'Distributor', tone: 'purple' },
  reseller: { label: 'Reseller', tone: 'azure' },
  customer: { label: 'Customer', tone: 'neutral' },
}

export const CUSTOMER_STATUS = {
  active: { label: 'Active', tone: 'success' },
  trial: { label: 'Trial', tone: 'info' },
  suspended: { label: 'Suspended', tone: 'warning' },
}

export const CUSTOMERS = [
  { id: 'acme', name: 'Acme Corp', type: 'customer', status: 'active', devices: 214, seats: 240, seatsUsed: 214, threats: 342, adoption: [58, 61, 64, 70, 74, 79, 85, 89], contact: 'it@acme.example', added: 'Mar 2024', products: ['IES', 'EDR', 'SAT'] },
  { id: 'borealis', name: 'Borealis Health', type: 'customer', status: 'active', devices: 356, seats: 380, seatsUsed: 356, threats: 518, adoption: [72, 74, 73, 78, 81, 84, 88, 91], contact: 'secops@borealis.example', added: 'Nov 2023', products: ['IES', 'EDR', 'SafeSend'] },
  { id: 'cobalt', name: 'Cobalt Logistics', type: 'customer', status: 'trial', devices: 48, seats: 100, seatsUsed: 48, threats: 27, adoption: [4, 9, 16, 24, 31, 38, 44, 48], contact: 'ops@cobalt.example', added: 'Jun 2026', products: ['IES'] },
  { id: 'dunmore', name: 'Dunmore Legal', type: 'customer', status: 'active', devices: 92, seats: 95, seatsUsed: 92, threats: 168, adoption: [60, 66, 71, 77, 82, 88, 93, 97], contact: 'admin@dunmore.example', added: 'Jan 2025', products: ['IES', 'SafeSend', 'Archive'] },
  { id: 'northwind', name: 'Northwind Partners', type: 'reseller', status: 'active', devices: 486, seats: 540, seatsUsed: 486, threats: 730, adoption: [64, 66, 70, 72, 76, 81, 86, 90], contact: 'msp@northwind.example', added: 'Aug 2023', products: ['IES', 'EDR', 'SAT', 'Archive'] },
  { id: 'eastgate', name: 'Eastgate Schools', type: 'customer', status: 'suspended', devices: 130, seats: 150, seatsUsed: 130, threats: 89, adoption: [55, 52, 48, 45, 41, 38, 35, 33], contact: 'tech@eastgate.example', added: 'Feb 2024', products: ['IES', 'SAT'] },
  { id: 'ferro', name: 'Ferro Manufacturing', type: 'customer', status: 'active', devices: 268, seats: 300, seatsUsed: 268, threats: 411, adoption: [50, 54, 59, 63, 69, 74, 80, 87], contact: 'it@ferro.example', added: 'Sep 2024', products: ['IES', 'EDR'] },
  { id: 'meridian', name: 'Meridian Distribution', type: 'distributor', status: 'active', devices: 1120, seats: 1200, seatsUsed: 1120, threats: 1604, adoption: [70, 71, 74, 77, 80, 82, 85, 88], contact: 'partners@meridian.example', added: 'May 2023', products: ['IES', 'EDR', 'SafeSend', 'SAT', 'Archive'] },
]

/* ---- Device list ------------------------------------------------------------ */

export const DEVICE_RISK = {
  low: { label: 'Low', tone: 'success' },
  medium: { label: 'Medium', tone: 'warning' },
  high: { label: 'High', tone: 'danger' },
}

export const DEVICES = [
  { id: 'd1', hostname: 'WKS-ACME-0142', customer: 'Acme Corp', os: 'Windows 11 Pro', platform: 'Windows', kind: 'Desktop', agent: '5.2.1', risk: 'low', lastScan: '12m ago', compliance: 98 },
  { id: 'd2', hostname: 'LAPTOP-BREN-07', customer: 'Borealis Health', os: 'macOS 15.3', platform: 'macOS', kind: 'Laptop', agent: '5.2.1', risk: 'low', lastScan: '38m ago', compliance: 95 },
  { id: 'd3', hostname: 'SERVER-SQL-01', customer: 'Acme Corp', os: 'Windows Server 2022', platform: 'Windows', kind: 'Server', agent: '5.1.8', risk: 'medium', lastScan: '3h ago', compliance: 82 },
  { id: 'd4', hostname: 'WKS-DUN-0033', customer: 'Dunmore Legal', os: 'Windows 11 Pro', platform: 'Windows', kind: 'Desktop', agent: '5.2.1', risk: 'low', lastScan: '55m ago', compliance: 97 },
  { id: 'd5', hostname: 'LAPTOP-FER-19', customer: 'Ferro Manufacturing', os: 'Windows 10 Pro', platform: 'Windows', kind: 'Laptop', agent: '4.9.2', risk: 'high', lastScan: '4d ago', compliance: 41 },
  { id: 'd6', hostname: 'SERVER-WEB-02', customer: 'Northwind Partners', os: 'Ubuntu 24.04 LTS', platform: 'Linux', kind: 'Server', agent: '5.2.0', risk: 'low', lastScan: '1h ago', compliance: 93 },
  { id: 'd7', hostname: 'LAPTOP-COB-04', customer: 'Cobalt Logistics', os: 'macOS 14.7', platform: 'macOS', kind: 'Laptop', agent: '5.0.3', risk: 'medium', lastScan: '9h ago', compliance: 74 },
  { id: 'd8', hostname: 'WKS-EAST-0210', customer: 'Eastgate Schools', os: 'Windows 10 Pro', platform: 'Windows', kind: 'Desktop', agent: '4.8.5', risk: 'high', lastScan: '6d ago', compliance: 35 },
  { id: 'd9', hostname: 'WKS-BOR-0087', customer: 'Borealis Health', os: 'Windows 11 Pro', platform: 'Windows', kind: 'Desktop', agent: '5.2.1', risk: 'low', lastScan: '20m ago', compliance: 99 },
]

/* ---- Policy list ------------------------------------------------------------ */

export const POLICY_STATUS = {
  active: { label: 'Active', tone: 'success' },
  disabled: { label: 'Disabled', tone: 'neutral' },
  draft: { label: 'Draft', tone: 'warning' },
}

export const POLICY_TYPE_TONE = {
  Protection: 'azure',
  Threat: 'rose',
  Device: 'orchid',
  Web: 'harbor',
  Firewall: 'clay',
  Encryption: 'emerald',
}

export const POLICIES = [
  { id: 'pol-001', name: 'Default Endpoint Protection', type: 'Protection', scope: 'inherited', assigned: 12, status: 'active', updated: '2 days ago', createdBy: 'Meridian Distribution', description: 'Real-time scanning, behavior monitoring, and exploit prevention for every endpoint. This is the safety net — every device gets it unless a local policy says otherwise.' },
  { id: 'pol-002', name: 'Ransomware Shield', type: 'Threat', scope: 'inherited', assigned: 12, status: 'active', updated: '1 week ago', createdBy: 'Meridian Distribution', description: 'Canary files, volume shadow copy protection, and automatic rollback if ransomware slips through.' },
  { id: 'pol-003', name: 'USB & Removable Media Control', type: 'Device', scope: 'local', assigned: 6, status: 'active', updated: '3 days ago', createdBy: 'You', description: 'Blocks USB storage and portable media on high-risk endpoints. Read-only mode for finance and legal teams.' },
  { id: 'pol-004', name: 'Web Content Filtering', type: 'Web', scope: 'inherited', assigned: 12, status: 'active', updated: '2 weeks ago', createdBy: 'Meridian Distribution', description: 'Blocks malicious, phishing, and policy-violating web categories at DNS level.' },
  { id: 'pol-005', name: 'Firewall — Strict Mode', type: 'Firewall', scope: 'local', assigned: 0, status: 'disabled', updated: '1 month ago', createdBy: 'You', description: 'Deny-all inbound with explicit allow rules. For high-security network segments only — not assigned anywhere yet.' },
  { id: 'pol-006', name: 'Full Disk Encryption', type: 'Encryption', scope: 'local', assigned: 0, status: 'draft', updated: 'Yesterday', createdBy: 'You', description: 'Enforce BitLocker on Windows and FileVault on macOS, with key escrow to the management console.' },
]

/* ---- Products (Entity Detail) ----------------------------------------------- */

export const PRODUCTS = [
  { id: 'ies', name: 'IES', full: 'Integrated Email Security', seats: 240, used: 214, adoption: 89, trend: [58, 61, 64, 70, 74, 79, 85, 89] },
  { id: 'edr', name: 'EDR', full: 'Endpoint Detection & Response', seats: 240, used: 198, adoption: 83, trend: [40, 48, 55, 62, 68, 73, 79, 83] },
  { id: 'sat', name: 'SAT', full: 'Security Awareness Training', seats: 240, used: 151, adoption: 63, trend: [12, 20, 29, 37, 45, 52, 58, 63] },
]
