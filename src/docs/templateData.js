/* ----------------------------------------------------------------------------
   Shared demo data for the Template pages. Realistic Vipre-flavored numbers —
   customers, devices, policies, products — so every template demo tells the
   same story. Demo-only: nothing here ships in the library bundles.
   -------------------------------------------------------------------------- */

/* Product glyphs — SVG path strings drawn on the ProductTile's 32×32 grid.
   In a real app these ship with your product config, not the design system. */
export const GLYPHS = {
  /* Material Symbols stacks-outline-rounded, on its NATIVE 24 grid where the product
     marks are drawn on 32. ProductTile measures the ink and centres it, so the two
     grids land at the same optical size. Not a product — it is the aggregate mark, the
     row that stands for all of them. It lived only in TablePage and PageFilterPage,
     each with its own copy, because this shared object did not have it. */
  stacks: 'M11.513 13.663q-.238-.063-.463-.188l-8.45-4.6q-.275-.15-.388-.375T2.1 8t.113-.5t.387-.375l8.45-4.6q.225-.125.463-.188T12 2.275t.488.063t.462.187l8.45 4.6q.275.15.388.375t.112.5t-.112.5t-.388.375l-8.45 4.6q-.225.125-.462.188t-.488.062t-.488-.062M12 11.725L18.825 8L12 4.275L5.175 8zm0 4l7.85-4.275q.05-.025.475-.125q.425 0 .713.288t.287.712q0 .275-.125.5t-.4.375l-7.85 4.275q-.225.125-.462.188t-.488.062t-.488-.062t-.462-.188L3.2 13.2q-.275-.15-.4-.375t-.125-.5q0-.425.288-.712t.712-.288q.125 0 .238.038t.237.087zm0 4l7.85-4.275q.05-.025.475-.125q.425 0 .713.288t.287.712q0 .275-.125.5t-.4.375l-7.85 4.275q-.225.125-.462.188t-.488.062t-.488-.062t-.462-.188L3.2 17.2q-.275-.15-.4-.375t-.125-.5q0-.425.288-.712t.712-.288q.125 0 .238.038t.237.087z',
  ies: 'M8.30775 23.5C7.80258 23.5 7.375 23.325 7.025 22.975C6.675 22.625 6.5 22.1974 6.5 21.6923V10.3077C6.5 9.80258 6.675 9.375 7.025 9.025C7.375 8.675 7.80258 8.5 8.30775 8.5H23.6923C24.1974 8.5 24.625 8.675 24.975 9.025C25.325 9.375 25.5 9.80258 25.5 10.3077V21.6923C25.5 22.1974 25.325 22.625 24.975 22.975C24.625 23.325 24.1974 23.5 23.6923 23.5H8.30775ZM16 16.5578L8 11.4423V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H23.6923C23.7821 22 23.8558 21.9712 23.9135 21.9135C23.9712 21.8558 24 21.7821 24 21.6923V11.4423L16 16.5578ZM16 15L23.8462 10H8.15375L16 15ZM8 11.4423V10V21.6923C8 21.7821 8.02883 21.8558 8.0865 21.9135C8.14417 21.9712 8.21792 22 8.30775 22H8V11.4423Z',
  safesend: 'M24.1838 6.6214C24.8147 6.25031 25.6311 6.76984 25.4826 7.51203L22.8108 23.5433C22.7366 24.137 22.1057 24.471 21.5862 24.2484L16.9846 22.2816L14.6096 25.1761C14.0901 25.8069 13.051 25.473 13.051 24.5823V21.5765L21.9573 10.7034C22.1428 10.4808 21.8459 10.221 21.6604 10.4066L11.01 19.7952L7.03929 18.1253C6.37132 17.8655 6.2971 16.9007 6.96507 16.5296L24.1838 6.6214Z',
  edr: 'M5.38475 24.2307V22.7307H26.6152V24.2307H5.38475ZM8.30775 21.7307C7.80258 21.7307 7.375 21.5557 7.025 21.2057C6.675 20.8557 6.5 20.4282 6.5 19.923V9.5385C6.5 9.03333 6.675 8.60575 7.025 8.25575C7.375 7.90575 7.80258 7.73075 8.30775 7.73075H23.6922C24.1974 7.73075 24.625 7.90575 24.975 8.25575C25.325 8.60575 25.5 9.03333 25.5 9.5385V19.923C25.5 20.4282 25.325 20.8557 24.975 21.2057C24.625 21.5557 24.1974 21.7307 23.6922 21.7307H8.30775ZM8.30775 20.2308H23.6922C23.7692 20.2308 23.8398 20.1988 23.9038 20.1348C23.9679 20.0706 24 20 24 19.923V9.5385C24 9.4615 23.9679 9.391 23.9038 9.327C23.8398 9.26283 23.7692 9.23075 23.6922 9.23075H8.30775C8.23075 9.23075 8.16025 9.26283 8.09625 9.327C8.03208 9.391 8 9.4615 8 9.5385V19.923C8 20 8.03208 20.0706 8.09625 20.1348C8.16025 20.1988 8.23075 20.2308 8.30775 20.2308Z',
  sat: 'M17 26.2115L8.25 21.3558V11.6443L17 6.7885L25.75 11.6443V21.3558L17 26.2115ZM14.148 14.0578C14.5122 13.6449 14.941 13.3238 15.4345 13.0943C15.9282 12.8648 16.45 12.75 17 12.75C17.55 12.75 18.0718 12.8648 18.5655 13.0943C19.059 13.3238 19.4878 13.6449 19.852 14.0578L23.4098 12.075L17 8.5115L10.5903 12.075L14.148 14.0578ZM16.25 24.073V20.1828C15.3692 19.9878 14.649 19.548 14.0895 18.8635C13.5298 18.1788 13.25 17.391 13.25 16.5C13.25 16.2975 13.2632 16.1074 13.2895 15.9298C13.3157 15.7523 13.3602 15.5705 13.423 15.3845L9.75 13.327V20.4693L16.25 24.073ZM18.5953 18.0953C19.0318 17.6588 19.25 17.127 19.25 16.5C19.25 15.873 19.0318 15.3413 18.5953 14.9048C18.1588 14.4683 17.627 14.25 17 14.25C16.373 14.25 15.8413 14.4683 15.4048 14.9048C14.9683 15.3413 14.75 15.873 14.75 16.5C14.75 17.127 14.9683 17.6588 15.4048 18.0953C15.8413 18.5318 16.373 18.75 17 18.75C17.627 18.75 18.1588 18.5318 18.5953 18.0953ZM17.75 24.073L24.25 20.4693V13.327L20.577 15.3845C20.6398 15.5705 20.6843 15.7523 20.7105 15.9298C20.7368 16.1074 20.75 16.2975 20.75 16.5C20.75 17.391 20.4702 18.1788 19.9105 18.8635C19.351 19.548 18.6308 19.9878 17.75 20.1828V24.073Z',
  /* Email archiving. Lived ONLY in the Gradient Explorer's local copy — the second
     glyph this shared object was missing, after `stacks`. Two of the six copies had
     grown a mark the canonical one did not have, which is the divergence the audit
     called a risk and which turns out to have already happened. */
  archive: 'M13.3125 25.251C12.1567 24.7517 11.1487 24.0718 10.2885 23.2115C9.42817 22.3513 8.74833 21.3433 8.249 20.1875C7.74967 19.0317 7.5 17.7999 7.5 16.4923C7.5 15.1846 7.74967 13.9554 8.249 12.8048C8.74833 11.6541 9.42817 10.6487 10.2885 9.7885C11.1487 8.92817 12.1567 8.24833 13.3125 7.749C14.4683 7.24967 15.7001 7 17.0078 7C18.3154 7 19.5446 7.24967 20.6953 7.749C21.8459 8.24833 22.8513 8.92817 23.7115 9.7885C24.5718 10.6487 25.2517 11.6541 25.751 12.8048C26.2503 13.9554 26.5 15.1846 26.5 16.4923C26.5 17.7999 26.2503 19.0317 25.751 20.1875C25.2517 21.3433 24.5718 22.3513 23.7115 23.2115C22.8513 24.0718 21.8459 24.7517 20.6953 25.251C19.5446 25.7503 18.3154 26 17.0078 26C15.7001 26 14.4683 25.7503 13.3125 25.251ZM17 24.4788C17.5103 23.8019 17.9398 23.1192 18.2885 22.4307C18.6372 21.7422 18.9212 20.9897 19.1405 20.173H14.8595C15.0917 21.0153 15.3789 21.7808 15.7213 22.4693C16.0634 23.1578 16.4897 23.8276 17 24.4788ZM15.0635 24.2038C14.6802 23.6538 14.3359 23.0285 14.0308 22.328C13.7256 21.6273 13.4884 20.909 13.3192 20.173H9.927C10.4552 21.2115 11.1635 22.084 12.052 22.7905C12.9405 23.4968 13.9443 23.9679 15.0635 24.2038ZM18.9365 24.2038C20.0557 23.9679 21.0595 23.4968 21.948 22.7905C22.8365 22.084 23.5448 21.2115 24.073 20.173H20.6807C20.4794 20.9153 20.2262 21.6368 19.921 22.3375C19.616 23.0382 19.2878 23.6603 18.9365 24.2038ZM9.298 18.673H13.0155C12.9527 18.3013 12.9071 17.9369 12.8787 17.5798C12.8506 17.2228 12.8365 16.8628 12.8365 16.5C12.8365 16.1372 12.8506 15.7773 12.8787 15.4203C12.9071 15.0631 12.9527 14.6987 13.0155 14.327H9.298C9.20183 14.6667 9.12817 15.0198 9.077 15.3865C9.02567 15.7532 9 16.1243 9 16.5C9 16.8757 9.02567 17.2468 9.077 17.6135C9.12817 17.9802 9.20183 18.3333 9.298 18.673ZM14.5152 18.673H19.4848C19.5474 18.3013 19.5929 17.9402 19.6212 17.5895C19.6494 17.2388 19.6635 16.8757 19.6635 16.5C19.6635 16.1243 19.6494 15.7612 19.6212 15.4105C19.5929 15.0598 19.5474 14.6987 19.4848 14.327H14.5152C14.4526 14.6987 14.4071 15.0598 14.3787 15.4105C14.3506 15.7612 14.3365 16.1243 14.3365 16.5C14.3365 16.8757 14.3506 17.2388 14.3787 17.5895C14.4071 17.9402 14.4526 18.3013 14.5152 18.673ZM20.9845 18.673H24.702C24.7982 18.3333 24.8718 17.9802 24.923 17.6135C24.9743 17.2468 25 16.8757 25 16.5C25 16.1243 24.9743 15.7532 24.923 15.3865C24.8718 15.0198 24.7982 14.6667 24.702 14.327H20.9845C21.0473 14.6987 21.0929 15.0631 21.1212 15.4203C21.1494 15.7773 21.1635 16.1372 21.1635 16.5C21.1635 16.8628 21.1494 17.2228 21.1212 17.5798C21.0929 17.9369 21.0473 18.3013 20.9845 18.673ZM20.6807 12.827H24.073C23.5385 11.7757 22.835 10.9032 21.9625 10.2095C21.09 9.516 20.0813 9.04167 18.9365 8.7865C19.3198 9.3685 19.6608 10.0051 19.9595 10.6962C20.2583 11.3872 20.4987 12.0975 20.6807 12.827ZM14.8595 12.827H19.1405C18.9083 11.991 18.6163 11.2208 18.2645 10.5163C17.9125 9.81175 17.491 9.14675 17 8.52125C16.509 9.14675 16.0875 9.81175 15.7355 10.5163C15.3837 11.2208 15.0917 11.991 14.8595 12.827ZM9.927 12.827H13.3192C13.5012 12.0975 13.7417 11.3872 14.0405 10.6962C14.3392 10.0051 14.6802 9.3685 15.0635 8.7865C13.9122 9.04167 12.9019 9.51767 12.0328 10.2145C11.1634 10.9112 10.4615 11.782 9.927 12.827Z',

  /* ---- ENTITY MARKS, on a 24 viewBox where the product marks are on 32 -------
     An account is not a product, but it is still a thing a row identifies, and a
     row that identifies its subject with a mark should not stop doing so because
     the subject changed kind. ProductTile measures the ink and centres it, so a
     24-grid glyph lands at the same optical size as the 32-grid product marks
     beside it. Lifted from the prototype's entityIcons.jsx (Figma 73:310). */
  customer: 'M10.156 10.9997C9.64302 10.4868 9.38652 9.86831 9.38652 9.14418C9.38652 8.42018 9.64302 7.80168 10.156 7.28868C10.669 6.77568 11.2875 6.51918 12.0115 6.51918C12.7355 6.51918 13.354 6.77568 13.867 7.28868C14.38 7.80168 14.6365 8.42018 14.6365 9.14418C14.6365 9.86831 14.38 10.4868 13.867 10.9997C13.354 11.5127 12.7355 11.7692 12.0115 11.7692C11.2875 11.7692 10.669 11.5127 10.156 10.9997ZM6.38652 17.4808V15.8134C6.38652 15.4461 6.48627 15.106 6.68577 14.793C6.88527 14.48 7.15189 14.2394 7.48564 14.0711C8.22689 13.7077 8.97471 13.4352 9.72908 13.2534C10.4835 13.0717 11.2443 12.9808 12.0115 12.9808C12.7788 12.9808 13.5396 13.0717 14.294 13.2534C15.0483 13.4352 15.7961 13.7077 16.5374 14.0711C16.8711 14.2394 17.1378 14.48 17.3373 14.793C17.5368 15.106 17.6365 15.4461 17.6365 15.8134V17.4808H6.38652ZM7.51152 16.3558H16.5115V15.8134C16.5115 15.6615 16.4675 15.5209 16.3795 15.3915C16.2915 15.2622 16.1721 15.1567 16.0212 15.075C15.375 14.7567 14.7161 14.5156 14.0446 14.3516C13.373 14.1877 12.6953 14.1058 12.0115 14.1058C11.3278 14.1058 10.6501 14.1877 9.97846 14.3516C9.30696 14.5156 8.64808 14.7567 8.00183 15.075C7.85096 15.1567 7.73152 15.2622 7.64352 15.3915C7.55552 15.5209 7.51152 15.6615 7.51152 15.8134V16.3558ZM13.0709 10.2036C13.3646 9.90981 13.5115 9.55668 13.5115 9.14418C13.5115 8.73168 13.3646 8.37856 13.0709 8.08481C12.7771 7.79106 12.424 7.64418 12.0115 7.64418C11.599 7.64418 11.2459 7.79106 10.9521 8.08481C10.6584 8.37856 10.5115 8.73168 10.5115 9.14418C10.5115 9.55668 10.6584 9.90981 10.9521 10.2036C11.2459 10.4973 11.599 10.6442 12.0115 10.6442C12.424 10.6442 12.7771 10.4973 13.0709 10.2036Z',
  reseller: 'M18.5185 11.2478V17.2247C18.5185 17.6036 18.3872 17.9243 18.1247 18.1868C17.8622 18.4493 17.5416 18.5805 17.1628 18.5805H6.74928C6.37053 18.5805 6.04991 18.4493 5.78741 18.1868C5.52491 17.9243 5.39366 17.6036 5.39366 17.2247V11.2333C5.09166 10.9853 4.86497 10.6635 4.7136 10.2677C4.5621 9.87208 4.55897 9.44495 4.70422 8.98633L5.46285 6.50833C5.56285 6.19295 5.73253 5.93864 5.97191 5.74539C6.21141 5.55214 6.49747 5.45551 6.8301 5.45551H17.0676C17.4003 5.45551 17.6845 5.54783 17.92 5.73245C18.1556 5.91708 18.3272 6.17095 18.4348 6.49408L19.2079 8.98633C19.3532 9.44495 19.35 9.87064 19.1985 10.2634C19.0472 10.6563 18.8205 10.9844 18.5185 11.2478ZM13.6062 10.7055C14.0158 10.7055 14.3237 10.5803 14.53 10.3298C14.7362 10.0793 14.8206 9.81026 14.7831 9.52276L14.3273 6.58051H12.5185V9.54301C12.5185 9.85839 12.6252 10.131 12.8387 10.3609C13.0522 10.5906 13.308 10.7055 13.6062 10.7055ZM10.2312 10.7055C10.5763 10.7055 10.8563 10.5906 11.0712 10.3609C11.2862 10.131 11.3937 9.85839 11.3937 9.54301V6.58051H9.58485L9.12922 9.55164C9.08872 9.81801 9.17235 10.077 9.3801 10.3285C9.58785 10.5798 9.87153 10.7055 10.2312 10.7055ZM6.89366 10.7055C7.17153 10.7055 7.41047 10.6086 7.61047 10.4149C7.81047 10.2211 7.93403 9.97764 7.98116 9.68439L8.42235 6.58051H6.8301C6.74835 6.58051 6.68347 6.59851 6.63547 6.63451C6.58735 6.67064 6.55128 6.72476 6.52728 6.79689L5.80597 9.2372C5.70697 9.55933 5.75366 9.88458 5.94603 10.213C6.13828 10.5413 6.45416 10.7055 6.89366 10.7055ZM17.0187 10.7055C17.4244 10.7055 17.735 10.5461 17.9503 10.2274C18.1657 9.90864 18.2177 9.57858 18.1062 9.2372L17.3473 6.78245C17.3233 6.71033 17.2873 6.65864 17.2393 6.62739C17.1912 6.59614 17.1263 6.58051 17.0445 6.58051H15.4898L15.931 9.68439C15.9781 9.97764 16.1017 10.2211 16.3017 10.4149C16.5017 10.6086 16.7407 10.7055 17.0187 10.7055ZM6.74928 17.4555H17.1628C17.2301 17.4555 17.2853 17.4339 17.3286 17.3906C17.372 17.3474 17.3937 17.2921 17.3937 17.2247V11.7641C17.3119 11.794 17.2436 11.8125 17.1887 11.8196C17.134 11.8269 17.0773 11.8305 17.0187 11.8305C16.6812 11.8305 16.3843 11.7695 16.128 11.6473C15.8718 11.5252 15.6234 11.3295 15.3829 11.0603C15.1724 11.2949 14.9234 11.482 14.6359 11.6215C14.3484 11.7608 14.0205 11.8305 13.6523 11.8305C13.334 11.8305 13.034 11.7644 12.7523 11.6321C12.4705 11.5 12.2052 11.3094 11.9562 11.0603C11.7244 11.3094 11.4619 11.5 11.1687 11.6321C10.8753 11.7644 10.5782 11.8305 10.2773 11.8305C9.93878 11.8305 9.62147 11.7692 9.32535 11.6466C9.02922 11.524 8.76866 11.3285 8.54366 11.0603C8.22816 11.3756 7.93747 11.5829 7.6716 11.682C7.40585 11.781 7.14653 11.8305 6.89366 11.8305C6.83491 11.8305 6.77428 11.8269 6.71178 11.8196C6.64928 11.8125 6.58485 11.794 6.51847 11.7641V17.2247C6.51847 17.2921 6.54016 17.3474 6.58353 17.3906C6.62678 17.4339 6.68203 17.4555 6.74928 17.4555Z',
  distributor: 'M4.78496 18.5625V5.4375H11.9098V8.4375H19.2367V18.5625H4.78496ZM5.90977 17.4375H10.785V15.5625H5.90977V17.4375ZM5.90977 14.4375H10.785V12.5625H5.90977V14.4375ZM5.90977 11.4375H10.785V9.5625H5.90977V11.4375ZM5.90977 8.4375H10.785V6.5625H5.90977V8.4375ZM11.9098 17.4375H18.1119V9.5625H11.9098V17.4375ZM13.5541 12.5625V11.4375H16.3233V12.5625H13.5541ZM13.5541 15.5625V14.4375H16.3233V15.5625H13.5541Z',
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
