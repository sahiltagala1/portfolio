/**
 * Short engineering notes. DRAFTS: written from a summary of Sahil's work and
 * from general facts about SHAP and OCPI. Review every sentence before
 * publishing, and add a `date` once each note is approved.
 */
export type Note = {
  slug: string;
  title: string;
  summary: string;
  date?: string;
  body: string[];
  demo: { label: string; href: string };
};

export const notes: Note[] = [
  {
    slug: "a-test-set-should-look-like-tomorrow",
    title: "A test set should look like tomorrow",
    summary: "Why I split my dissertation data by garage as well as by date.",
    body: [
      "With time series, the usual advice is to split by date: train on the past, test on the future. It stops the model from seeing answers it should not have yet.",
      "My dissertation data came from several garages, and the mix of garages changed over time. A split by date alone meant the model trained on one mix and was tested on another. The score then measured two things at once: how good the model was, and how different the garages were.",
      "The fix was to keep the rule about time and apply it inside each garage. Every garage gives its earlier sessions to training and its later sessions to testing. The test data still comes from the future, and both sets hold the same mix of garages.",
      "The lesson I took from it: before trusting a score, check that the test set resembles the data the model will meet next. If it does not, the number is answering a different question.",
    ],
    demo: { label: "See both splits side by side", href: "/playground/#split" },
  },
  {
    slug: "what-a-shap-value-says",
    title: "What a SHAP value says, and what it doesn't",
    summary: "An explanation of a prediction is not an explanation of the world.",
    body: [
      "SHAP takes one prediction and shares it out among the input features. Each feature gets a number: how far it pushed this prediction up or down from the model's average output. Add the numbers to that average and you get the prediction back exactly.",
      "That last property is why I chose it for anomaly detection. A flag on a charging session stops being a bare verdict. It becomes a short list: this measurement pushed hardest, this one pushed a little, these two argued against.",
      "It is easy to read more into the numbers than they hold. A SHAP value describes the model. It says which inputs the model leaned on, and it does not say what went wrong with the charger. If the model has learned a shortcut, SHAP will report the shortcut faithfully.",
      "So I treat the explanation as a starting point for a person. It tells an operator where to look first, and it tells me when the model is leaning on something it should not.",
    ],
    demo: { label: "Explain a flag yourself", href: "/playground/#flag" },
  },
  {
    slug: "decide-who-is-trusted-before-the-network-goes-down",
    title: "Decide who is trusted before the network goes down",
    summary: "What OCPI's whitelist setting taught me about designing for outages.",
    body: [
      "Roaming lets a driver with a card from one company charge at a station run by another. The two companies talk over a protocol called OCPI, which I worked with at Numocity.",
      "Every card carries a whitelist setting, chosen by the company that issued it. The setting tells the station operator how far to trust its stored copy of the card. Always trust it. Trust it if you like. Ask first, and trust the copy only if we cannot be reached. Never trust it, always ask.",
      "What I like about this design is when the decision gets made. Nobody has to improvise during an outage, because the question of who is trusted without a live answer was settled in advance, card by card.",
      "I now look for the same thing in any system that depends on another one. If the other side stops answering, what happens, and who chose that?",
    ],
    demo: { label: "Try the eight cases", href: "/playground/#roaming" },
  },
];
