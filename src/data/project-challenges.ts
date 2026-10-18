export type ProjectChallenge = {
  id: string;
  challenge: string;
  response: string;
  preview: {
    constraint: string;
    question: string;
  };
};

// Jagdamba-specific constraints and responses are not yet verified.
// Fill BOTH challenge and response with approved copy to publish a project record.
// Until then, the UI shows the explicitly general review prompts below.
// Preview subjects must never be treated as evidence of an actual project issue.
export const jagdambaProjectChallenges: readonly ProjectChallenge[] = [
  {
    id: "01",
    challenge: "",
    response: "",
    preview: {
      constraint: "Site conditions.",
      question: "What does the site require of the plant layout?",
    },
  },
  {
    id: "02",
    challenge: "",
    response: "",
    preview: {
      constraint: "Equipment interfaces.",
      question: "How should the equipment connect within the plant?",
    },
  },
  {
    id: "03",
    challenge: "",
    response: "",
    preview: {
      constraint: "Execution constraints.",
      question: "What practical conditions need to inform work on site?",
    },
  },
];
