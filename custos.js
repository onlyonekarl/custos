import ollama from "ollama";

const tools = [
  {
    type: "function",
    function: {
      name: "check_issuer_verification",
      description: "Check if an RWA token issuer has verified KYB licensing status",
      parameters: {
        type: "object",
        properties: {
          tokenAddress: { type: "string" }
        },
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
        properties: {
          tokenAddress: { type: "string" }
        },
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
        properties: {
          tokenAddress: { type: "string" }
        },
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
        properties: {
          message: { type: "string" }
        },
        required: ["message"]
      }
    }
  }
];

function checkIssuer(tokenAddress) {
  var result = {};
  result.tokenAddress = tokenAddress;
  result.verified = true;
  result.issuer = "Example Issuer Ltd";
  result.licenseJurisdiction = "Singapore";
  result.riskLevel = "low";
  return result;
}

function checkCollateral(tokenAddress) {
  var result = {};
  result.tokenAddress = tokenAddress;
  result.collateralRatio = 1.02;
  result.backingAsset = "US Treasuries";
  result.riskLevel = "low";
  return result;
}

function checkContractRisk(tokenAddress) {
  var result = {};
  result.tokenAddress = tokenAddress;
  result.audited = true;
  result.contractAgeDays = 210;
  result.isUpgradeable = false;
  var flags = [];
  if (result.audited === false) {
    flags.push("not audited");
  }
  if (result.contractAgeDays < 30) {
    flags.push("contract is very new");
  }
  if (result.isUpgradeable === true) {
    flags.push("contract is upgradeable");
  }
  result.riskFlags = flags;
  if (flags.length === 0) {
    result.riskLevel = "low";
  } else {
    result.riskLevel = "high";
  }
  return result;
}

function sendAlert(message) {
  console.log("ALERT: " + message);
}

function runAgent(tokenAddress) {
  if (!tokenAddress) {
    console.log("Error: no token address given");
    return;
  }

  console.log("Verifying " + tokenAddress);
  console.log("");

  var issuer = checkIssuer(tokenAddress);
  var collateral = checkCollateral(tokenAddress);
  var risk = checkContractRisk(tokenAddress);

  var allChecks = [issuer, collateral, risk];
  var flagged = [];
  for (var i = 0; i < allChecks.length; i++) {
    if (allChecks[i].riskLevel === "high") {
      flagged.push(allChecks[i]);
    }
  }

  console.log("Results:");
  console.log(JSON.stringify(allChecks, null, 2));

  if (flagged.length > 0) {
    sendAlert("Token " + tokenAddress + " has risk flags: " + JSON.stringify(flagged));
  } else {
    console.log("No risk flags. Token looks clean.");
  }
}

var inputAddress = process.argv[2];
if (inputAddress === undefined) {
  inputAddress = "0x1234567890abcdef";
}

runAgent(inputAddress);