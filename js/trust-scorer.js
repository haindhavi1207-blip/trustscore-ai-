/* =========================================
   TrustScore AI – Core Scoring Logic
========================================= */

const scorer = {
    totalScore: 0,
    riskStatus: "",
    reasoning: "",
    scores: { url: 0, content: 0, behavior: 0 },
  
    trustedBrands: ["google", "amazon", "microsoft", "apple", "facebook"],
    trustedTLDs: ["com", "in", "org", "net", "edu", "gov"],
  
    reset() {
      this.totalScore = 0;
      this.riskStatus = "";
      this.reasoning = "";
      this.scores = { url: 0, content: 0, behavior: 0 };
    },
  
    getDomain(input) {
      const url = input.startsWith("http") ? input : "https://" + input;
      return new URL(url).hostname.toLowerCase();
    },
  
    isNumbersOnly(str) {
      return /^[0-9]+$/.test(str);
    },
  
    isKeyboardMash(str) {
      return str.length > 6 && !/[aeiou]/i.test(str);
    },
  
    calculateScore(input) {
      this.reset();
  
      let domain;
      try {
        domain = this.getDomain(input);
      } catch {
        this.totalScore = 20;
        this.riskStatus = "High";
        this.reasoning = "Invalid URL format.";
        return;
      }
  
      const name = domain.split(".")[0];
      const tld = domain.split(".").pop();
  
      /* URL TRUST (40) */
      if (this.trustedTLDs.includes(tld)) this.scores.url += 25;
      if (input.startsWith("https")) this.scores.url += 15;
  
      /* CONTENT TRUST (30) */
      if (this.trustedBrands.some(b => name.includes(b))) {
        this.scores.content = 30;
      } else if (this.isNumbersOnly(name)) {
        this.scores.content = 5;
      } else if (this.isKeyboardMash(name)) {
        this.scores.content = 12;
      } else {
        this.scores.content = 22;
      }
  
      /* BEHAVIOR TRUST (30) */
      if (this.isNumbersOnly(name)) {
        this.scores.behavior = 10;
      } else if (this.isKeyboardMash(name)) {
        this.scores.behavior = 15;
      } else if (domain.length < 18) {
        this.scores.behavior = 30;
      } else {
        this.scores.behavior = 20;
      }
  
      this.totalScore =
        this.scores.url +
        this.scores.content +
        this.scores.behavior;
  
      this.totalScore = Math.min(this.totalScore, 95);
  
      if (this.totalScore >= 75) {
        this.riskStatus = "Low";
        this.reasoning =
          "Website is reachable and shows strong structural trust signals.";
      } else if (this.totalScore >= 55) {
        this.riskStatus = "Medium";
        this.reasoning =
          "Website is reachable but shows mixed trust indicators.";
      } else {
        this.riskStatus = "High";
        this.reasoning =
          "Website structure appears suspicious or randomly generated.";
      }
    }
  };
  