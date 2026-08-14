import express from "express";

const app = express();
const port = process.env.PORT || 3000;

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
  result.riskLevel = flags.length === 0 ? "low" : "high";
  return result;
}

app.get("/", function (req, res) {
  res.send("Custos is live. Try /verify?token=0x123");
});

app.get("/verify", function (req, res) {
  var tokenAddress = req.query.token;

  if (!tokenAddress) {
    return res.status(400).json({ error: "Missing token query parameter" });
  }

  var issuer = checkIssuer(tokenAddress);
  var collateral = checkCollateral(tokenAddress);
  var risk = checkContractRisk(tokenAddress);

  var allChecks = [issuer, collateral, risk];
  var flagged = allChecks.filter(function (c) {
    return c.riskLevel === "high";
  });

  res.json({
    tokenAddress: tokenAddress,
    checks: allChecks,
    flagged: flagged,
    status: flagged.length > 0 ? "risk detected" : "clean"
  });
});

app.listen(port, function () {
  console.log("Custos server running on port " + port);
});