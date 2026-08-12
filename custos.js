import ollama from "ollama";

// ============================================================
// CUSTOS — Autonomous RWA Verification Agent
// Built for X Layer AI-RWA Hackathon Track
// ============================================================
//
// Custos checks tokenized real-world assets (RWAs) across three
// dimensions before a user trusts/interacts with them:
//   1. Issuer verification (KYB/licensing)
//   2. Collateral backing ratio
//   3. Smart contract risk (audit status, age, upgradeability)
//
// NOTE ON DATA SOURCES:
// This build uses mock data for the hackathon demo. The architecture
// is designed to be "PoR-ready" — each function below is structured
// to be swapped for a live Chainlink Proof of Reserve / Data Feed call
// using the standard AggregatorV3Interface pattern, e.g.:
//
//   const feed = new ethers.Contract(feedAddress, aggregatorV3ABI, provider);
//   const [, answer] = await feed.latestRoundData();
//
// Once a confirmed live PoR feed is available for a given RWA token on
// X Layer, only the internals of these functions change — the agent
// loop, risk logic, and alert system stay the same.
// ============================================================

const tools = [
  {
    type: "function",
    function: {
      name: "check_issuer_verification",
      description: "Check if an RWA token issuer has verified KYB/licensing status",
      parameters: {
        type: "object",
        properties: { tokenAddress: { type: "string" } },
        required: ["tokenAddress"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_collateral_ratio",
      description: "Check the collateral backing ratio of an RWA token",
      parameters: {
        type: "object",
        properties: { tokenAddress: { type: "string" } },
        required: ["tokenAddress"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_contract_risk",
      description: "Check smart contract risk factors",
      parameters: {
        type: "object",
        properties: { tokenAddress: { type: "string" } },
        required: ["tokenAddress"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "send_alert",
      description: "Send a text alert to the user",
      parameters: {
        type: "object",
        properties: { message: { type: "string" } },
        required: ["message"]
      }
    }
  }
];

// --- Tool implementations ---

// TODO (post-hackathon): replace mock `verified` value with a real
// onchain attestation lookup (e.g. EAS - Ethereum Attestation Service)
async function check_issuer_verification({ tokenAddress }) {
  const data = { tokenAddress, verified: true, issuer: "Example Issuer Ltd", licenseJurisdiction: "Singapore" };
  return { ...data, riskLevel: data.verified ? "low" : "high" };
}

// TODO (post-hackathon): replace mock `collateralRatio` with a live
// Chainlink Proof of Reserve feed read via AggregatorV3Interface.latestRoundData()
async function check_collateral_ratio({ tokenAddress }) {
  const data = { tokenAddress, collateralRatio: 1.02, backingAsset: "US Treasuries" };
  return { ...data, riskLevel: data.collateralRatio >= 1.0 ? "low" : "high" };
}

// TODO (post-hackathon): replace mock contract metadata with a real
// block explorer API call (e.g. OKLink for X Layer) for audit status/age
async function check_contract_risk({ tokenAddress }) {
  const data = { tokenAddress, audited: true, contractAgeDays: 210, isUpgradeable: false };
  const riskFlags = [];
  if (!data.audited) riskFlags.push("not audited");
  if (data.contractAgeDays < 30) riskFlags.push("contract is very new (under 30 days)");
  if (data.isUpgradeable) riskFlags.push("contract is upgradeable (rug risk)");
  return { ...data, riskLevel: riskFlags.length === 0 ? "low" : "high", riskFlags };
}

async function send_alert({ message }) {
  console.log("🔔 ALERT:", message);
  return { sent: true };
}

// --- Core verification logic (deterministic, no LLM in the decision path) ---

async function runAgent(tokenAddress) {
  console.log(`🔍 Verifying ${tokenAddress}...\n`);

  const issuer = await check_issuer_verification({ tokenAddress });
  const collateral = await check_collateral_ratio({ tokenAddress });
  const risk = await check_contract_risk({ tokenAddress });

  const allChecks = [issuer, collateral, risk];
  const flagged = allChecks.filter(c => c.riskLevel === "high");

  console.log("📋 Results:", JSON.stringify(allChecks, null, 2));

  if (flagged.length > 0) {
    await send_alert({ message: "Token " + tokenAddress + " has risk flags: " + JSON.stringify(flagged) });
  } else {
    console.log("✅ No risk flags. Token looks clean.");
  }
}

// --- Entry point ---
const inputAddress = process.argv[2] || "0x1234567890abcdef";
runAgent(inputAddress);