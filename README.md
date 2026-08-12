# Custos — Autonomous RWA Verification Agent

Built for X Layer AI-RWA Hackathon Track

## The Problem

Real-world asset (RWA) tokenization is growing fast, but trust remains the biggest blocker to adoption. Users have no simple way to check, before interacting with a tokenized asset, whether:
- the issuer is actually verified/licensed
- the token is genuinely backed by the reserves it claims
- the underlying smart contract carries hidden risk (unaudited, upgradeable, freshly deployed)

Manual due diligence is slow, inconsistent, and inaccessible to most users. Custos automates it.

## What Custos Does

Custos is an autonomous agent that runs a three-part verification check on any RWA token address:

1. Issuer Verification — checks KYB/licensing status
2. Collateral Ratio — checks whether the token is fully backed
3. Contract Risk — flags audit status, contract age, and upgradeability risk

If any check fails, Custos automatically fires an alert summarizing the risk. If everything passes, it confirms the token is clean — no manual review needed.

## Architecture

Custos runs a deterministic verification pipeline (not left to LLM judgment) so results are consistent and auditable — the LLM layer is reserved for reasoning and future natural-language interaction, not decision-making on risk. This is a deliberate design choice: a compliance tool should never "vibe" a risk assessment.