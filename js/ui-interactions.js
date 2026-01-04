/* =========================================
   TrustScore AI – UI + Availability Check
========================================= */

/* REAL WEBSITE AVAILABILITY CHECK (NO SERVER) */
async function checkWebsiteAvailability(url) {
    try {
      const formattedUrl = url.startsWith("http")
        ? url
        : "https://" + url;
  
      const apiUrl =
        "https://api.allorigins.win/raw?url=" +
        encodeURIComponent(formattedUrl);
  
      const response = await fetch(apiUrl, { method: "GET" });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  /* EXAMPLE BUTTONS */
  function fillExample(url) {
    document.getElementById("url-input").value = url;
  }
  
  /* MAIN LOGIC */
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("url-input");
    const btn = document.getElementById("analyze-btn");
    const result = document.getElementById("result");
    const scoreValue = document.getElementById("score-value");
    const analyzedUrl = document.getElementById("analyzed-url");
    const progress = document.querySelector(".progress");
    const riskLabel = document.getElementById("risk-label");
  
    const viewBtn = document.querySelector(".primary");
    const explainBtn = document.querySelector(".secondary");
  
    /* SCORE COUNT ANIMATION */
    function animateScore(finalScore) {
      let current = 0;
      const interval = setInterval(() => {
        current++;
        scoreValue.textContent = current;
        if (current >= finalScore) clearInterval(interval);
      }, 15);
    }
  
    btn.addEventListener("click", async () => {
      const url = input.value.trim();
      if (!url) return;
  
      result.classList.remove("hidden");
      analyzedUrl.textContent = url;
  
      /* LOADING STATE */
      scoreValue.textContent = "Checking…";
      riskLabel.textContent = "Scanning";
      progress.style.strokeDashoffset = 565;
  
      /* STEP 1: AVAILABILITY CHECK */
      const isAvailable = await checkWebsiteAvailability(url);
  
      sessionStorage.setItem("analyzedUrl", url);
  
      if (!isAvailable) {
        scoreValue.textContent = "20";
        riskLabel.textContent = "High Risk";
        riskLabel.style.background = "#7f1d1d";
        progress.style.stroke = "#f87171";
        progress.style.strokeDashoffset =
          565 - (565 * 20) / 100;
  
        sessionStorage.setItem(
          "reason",
          "Website is unreachable or does not exist."
        );
        return;
      }
  
      /* STEP 2: NORMAL SCORING */
      scorer.calculateScore(url);
  
      sessionStorage.setItem("risk", scorer.riskStatus);
      sessionStorage.setItem("reason", scorer.reasoning);
  
      animateScore(scorer.totalScore);
  
      const offset =
        565 - (565 * scorer.totalScore) / 100;
      progress.style.strokeDashoffset = offset;
  
      if (scorer.riskStatus === "Low") {
        progress.style.stroke = "#34d399";
        riskLabel.textContent = "Safe";
        riskLabel.style.background = "#065f46";
      } else if (scorer.riskStatus === "Medium") {
        progress.style.stroke = "#facc15";
        riskLabel.textContent = "Caution";
        riskLabel.style.background = "#78350f";
      } else {
        progress.style.stroke = "#f87171";
        riskLabel.textContent = "High Risk";
        riskLabel.style.background = "#7f1d1d";
      }
    });
  
    /* NAVIGATION */
    if (viewBtn) {
      viewBtn.addEventListener("click", () => {
        window.location.href = "analysis.html";
      });
    }
  
    if (explainBtn) {
      explainBtn.addEventListener("click", () => {
        window.location.href = "explainable-ai.html";
      });
    }
  });
  