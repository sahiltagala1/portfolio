/** The four readings a visitor can ask about, in session order. Fictional data. */
export const PICKS = [
  {
    minute: 24,
    note: "Power jumps to 8.6 kW, above the charger's 7.4 kW rating. The breach of the rating does most of the work here.",
  },
  {
    minute: 40,
    note: "Power looks healthy, so the line gives nothing away. The connector is running about 22 °C hotter than it should, and that alone is enough.",
  },
  {
    minute: 52,
    note: "Power falls from about 7.2 kW to 2.9 kW in one minute. Two features agree: the reading is far from the expected curve, and it got there suddenly.",
  },
  {
    minute: 78,
    note: "Power is lower here than during the dip at minute 52, and the reading is still normal. This is the taper at the end of a session, where low power is expected, so nothing pushes toward a flag.",
  },
] as const;

export const DEFAULT_PICK = 2;
