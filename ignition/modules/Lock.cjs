const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Kickstarter", (m) => {
  const kickstarter = m.contract("CrowdFunding", ["Kickstarter"]);

  return { kickstarter }
})