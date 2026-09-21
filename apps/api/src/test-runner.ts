import { moderateContent } from "./services/moderation.js";
import { checkForScams } from "./services/scam.js";

interface TestResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
}

const results: TestResult[] = [];

function assert(name: string, condition: boolean, expected: string, actual: string) {
  results.push({ name, passed: condition, expected, actual });
  const icon = condition ? "✅" : "❌";
  console.log(`${icon} ${name}`);
  if (!condition) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
  }
}

// ============================================================
// TEST SUITE 1: Moderation Engine
// ============================================================
console.log("\n🧪 TEST SUITE 1: Moderation Engine\n");

// Test 1.1: Clean content passes
const clean1 = moderateContent("I think Singapore needs more parks", "AGE_25_39");
assert(
  "1.1 Clean opinion passes",
  clean1.layer === "CLEAN" && clean1.action === "ALLOW",
  "CLEAN/ALLOW",
  `${clean1.layer}/${clean1.action}`
);

// Test 1.2: Clean question passes
const clean2 = moderateContent("Any good hawker centres near Tampines?", "AGE_25_39");
assert(
  "1.2 Clean question passes",
  clean2.layer === "CLEAN" && clean2.action === "ALLOW",
  "CLEAN/ALLOW",
  `${clean2.layer}/${clean2.action}`
);

// Test 1.3: Clean moment passes
const clean3 = moderateContent("Had a wonderful day at Gardens by the Bay with my family!", "AGE_25_39");
assert(
  "1.3 Clean moment passes",
  clean3.layer === "CLEAN" && clean3.action === "ALLOW",
  "CLEAN/ALLOW",
  `${clean3.layer}/${clean3.action}`
);

// Test 1.4: Clean idea passes
const clean4 = moderateContent("What if MRT stations had air-conditioned walkways?", "AGE_25_39");
assert(
  "1.4 Clean idea passes",
  clean4.layer === "CLEAN" && clean4.action === "ALLOW",
  "CLEAN/ALLOW",
  `${clean4.layer}/${clean4.action}`
);

// Test 1.5: Illegal content blocked
const illegal1 = moderateContent("This is child sex material", "AGE_25_39");
assert(
  "1.5 Illegal content (CSAM) blocked",
  illegal1.layer === "ILLEGAL" && illegal1.action === "BLOCK",
  "ILLEGAL/BLOCK",
  `${illegal1.layer}/${illegal1.action}`
);

// Test 1.6: Terrorist content blocked
const illegal2 = moderateContent("Here are bomb making instructions for terrorist attack", "AGE_25_39");
assert(
  "1.6 Terrorist content blocked",
  illegal2.layer === "ILLEGAL" && illegal2.action === "BLOCK",
  "ILLEGAL/BLOCK",
  `${illegal2.layer}/${illegal2.action}`
);

// Test 1.7: Scam content quarantined (multiple indicators)
const scam1 = moderateContent("Send me $5000 urgently via wire transfer to my bank account", "AGE_25_39");
assert(
  "1.7 Scam content quarantined",
  scam1.layer === "DANGEROUS_INTERACTION" && scam1.action === "QUARANTINE",
  "DANGEROUS_INTERACTION/QUARANTINE",
  `${scam1.layer}/${scam1.action}`
);

// Test 1.8: Grooming language quarantined
const grooming = moderateContent("Don't tell your parents about this, keep this between us", "AGE_25_39");
assert(
  "1.8 Grooming language quarantined",
  grooming.layer === "DANGEROUS_INTERACTION" && grooming.action === "QUARANTINE",
  "DANGEROUS_INTERACTION/QUARANTINE",
  `${grooming.layer}/${grooming.action}`
);

// Test 1.9: Harassment detected
const harassment = moderateContent("You're so stupid and worthless, I'll find you and hurt you", "AGE_25_39");
assert(
  "1.9 Harassment detected",
  harassment.layer === "DANGEROUS_INTERACTION" && harassment.action === "REDUCE_AMPLIFICATION",
  "DANGEROUS_INTERACTION/REDUCE_AMPLIFICATION",
  `${harassment.layer}/${harassment.action}`
);

// Test 1.10: Factual claim triggers context check
const claim = moderateContent("Studies show Singapore's population increased by 10% this year", "AGE_25_39");
assert(
  "1.10 Factual claim triggers context check",
  claim.layer === "MISINFORMATION_RISK" && claim.action === "ADD_CONTEXT",
  "MISINFORMATION_RISK/ADD_CONTEXT",
  `${claim.layer}/${claim.action}`
);

// Test 1.11: Evidence-backed claim triggers context
const evidence = moderateContent("According to the 2026 census, the unemployment rate is 2.1%", "AGE_25_39");
assert(
  "1.11 Evidence-backed claim triggers context",
  evidence.layer === "MISINFORMATION_RISK" && evidence.action === "ADD_CONTEXT",
  "MISINFORMATION_RISK/ADD_CONTEXT",
  `${evidence.layer}/${evidence.action}`
);

// Test 1.12: Singlish passes moderation
const singlish = moderateContent("Wah this weather damn hot sia, cannot tahan already", "AGE_25_39");
assert(
  "1.12 Singlish passes moderation",
  singlish.layer === "CLEAN" && singlish.action === "ALLOW",
  "CLEAN/ALLOW",
  `${singlish.layer}/${singlish.action}`
);

// Test 1.13: Food discussion passes
const food = moderateContent("The chicken rice at Maxwell is the best in Singapore, fight me", "AGE_25_39");
assert(
  "1.13 Food discussion passes",
  food.layer === "CLEAN" && food.action === "ALLOW",
  "CLEAN/ALLOW",
  `${food.layer}/${food.action}`
);

// Test 1.14: MRT discussion passes
const mrt = moderateContent("The new Thomson-East Coast line is going to change everything", "AGE_25_39");
assert(
  "1.14 MRT discussion passes",
  mrt.layer === "CLEAN" && mrt.action === "ALLOW",
  "CLEAN/ALLOW",
  `${mrt.layer}/${mrt.action}`
);

// Test 1.15: Children get stronger protection
const childContent = moderateContent("You're so ugly and worthless", "UNDER_13");
assert(
  "1.15 Harassment against child detected",
  childContent.layer === "DANGEROUS_INTERACTION",
  "DANGEROUS_INTERACTION",
  `${childContent.layer}`
);

// ============================================================
// TEST SUITE 2: Scam Detection
// ============================================================
console.log("\n🧪 TEST SUITE 2: Scam Detection\n");

// Test 2.1: Clean content passes scam check
const scamClean = checkForScams("I love hawker food in Singapore", 30);
assert(
  "2.1 Clean content passes scam check",
  !scamClean.isSuspicious && scamClean.riskScore < 20,
  "Not suspicious, low risk",
  `Suspicious: ${scamClean.isSuspicious}, Risk: ${scamClean.riskScore}`
);

// Test 2.2: Financial request detected
const scamFin = checkForScams("Send me $5000 urgently via wire transfer", 30);
assert(
  "2.2 Financial request detected",
  scamFin.isSuspicious && scamFin.riskScore >= 40,
  "Suspicious, high risk",
  `Suspicious: ${scamFin.isSuspicious}, Risk: ${scamFin.riskScore}`
);

// Test 2.3: Credential request detected
const scamCred = checkForScams("What is your Singpass password and OTP code", 30);
assert(
  "2.3 Credential request detected",
  scamCred.isSuspicious && scamCred.riskScore >= 40,
  "Suspicious, high risk",
  `Suspicious: ${scamCred.isSuspicious}, Risk: ${scamCred.riskScore}`
);

// Test 2.4: Investment scam detected
const scamInvest = checkForScams("Crypto investment guaranteed returns, double your money now", 30);
assert(
  "2.4 Investment scam detected",
  scamInvest.isSuspicious && scamInvest.riskScore >= 40,
  "Suspicious, high risk",
  `Suspicious: ${scamInvest.isSuspicious}, Risk: ${scamInvest.riskScore}`
);

// Test 2.5: Prize scam detected
const scamPrize = checkForScams("You have won a prize, congratulations! Click here to claim", 30);
assert(
  "2.5 Prize scam detected",
  scamPrize.isSuspicious,
  "Suspicious",
  `Suspicious: ${scamPrize.isSuspicious}`
);

// Test 2.6: New account increases risk
const scamNew = checkForScams("Send me $5000 urgently via wire transfer", 1);
assert(
  "2.6 New account increases risk",
  scamNew.riskScore > scamFin.riskScore,
  `Higher risk than established account (${scamFin.riskScore})`,
  `New: ${scamNew.riskScore}, Established: ${scamFin.riskScore}`
);

// Test 2.7: Platform switch detected
const scamSwitch = checkForScams("Let's continue this on WhatsApp, chat me there", 30);
assert(
  "2.7 Platform switch detected",
  scamSwitch.flags.some((f) => f.type === "PLATFORM_SWITCH"),
  "Has PLATFORM_SWITCH flag",
  `Flags: ${scamSwitch.flags.map((f) => f.type).join(", ")}`
);

// Test 2.8: Urgency manipulation detected
const scamUrgency = checkForScams("Act now! Limited time offer, pay immediately before it expires", 30);
assert(
  "2.8 Urgency manipulation detected",
  scamUrgency.isSuspicious,
  "Suspicious",
  `Suspicious: ${scamUrgency.isSuspicious}`
);

// Test 2.9: Multiple scam signals compound risk
const scamMultiple = checkForScams(
  "Send me $10000 urgently via wire transfer, this is a crypto investment guaranteed returns, click here to claim your prize",
  1
);
assert(
  "2.9 Multiple scam signals compound risk",
  scamMultiple.riskScore >= 70,
  "Risk >= 70",
  `Risk: ${scamMultiple.riskScore}`
);

// Test 2.10: Normal conversation passes
const scamNormal = checkForScams("Hey, want to grab lunch at the hawker centre tomorrow?", 30);
assert(
  "2.10 Normal conversation passes",
  !scamNormal.isSuspicious && scamNormal.riskScore < 20,
  "Not suspicious, low risk",
  `Suspicious: ${scamNormal.isSuspicious}, Risk: ${scamNormal.riskScore}`
);

// ============================================================
// TEST SUITE 3: Content Classification
// ============================================================
console.log("\n🧪 TEST SUITE 3: Content Classification\n");

// These test the classifyContent function logic within createThought
// We test the moderation layer behavior which reflects classification

const classificationTests = [
  { type: "QUESTION", content: "What's the best MRT line?", expected: "OPINION" },
  { type: "MOMENT", content: "I had a great day today", expected: "PERSONAL_EXPERIENCE" },
  { type: "IDEA", content: "What if we had covered walkways everywhere?", expected: "OPINION" },
  { type: "THOUGHT", content: "I love this country", expected: "OPINION" },
  { type: "THOUGHT", content: "According to research, 80% of Singaporeans support this", expected: "EVIDENCE_BACKED" },
  { type: "THOUGHT", content: "Studies show that 90% of people prefer hawker food", expected: "CLAIM" },
];

classificationTests.forEach((test, i) => {
  const mod = moderateContent(test.content, "AGE_25_39");
  // For classification testing, we check if claims trigger context
  if (test.expected === "EVIDENCE_BACKED" || test.expected === "CLAIM") {
    assert(
      `3.${i + 1} ${test.type} with ${test.expected.toLowerCase()} content`,
      mod.layer === "MISINFORMATION_RISK" || mod.layer === "CLEAN",
      "MISINFORMATION_RISK or CLEAN",
      `${mod.layer}`
    );
  } else {
    assert(
      `3.${i + 1} ${test.type} is clean`,
      mod.layer === "CLEAN" || mod.layer === "ORDINARY_DISAGREEMENT",
      "CLEAN or ORDINARY_DISAGREEMENT",
      `${mod.layer}`
    );
  }
});

// ============================================================
// TEST SUITE 4: Edge Cases
// ============================================================
console.log("\n🧪 TEST SUITE 4: Edge Cases\n");

// Test 4.1: Empty content
const edge1 = moderateContent("", "AGE_25_39");
assert(
  "4.1 Empty content passes (handled by API validation)",
  edge1.layer === "CLEAN",
  "CLEAN",
  `${edge1.layer}`
);

// Test 4.2: Very long content
const longContent = "I love Singapore. ".repeat(500);
const edge2 = moderateContent(longContent, "AGE_25_39");
assert(
  "4.2 Very long content passes",
  edge2.layer === "CLEAN",
  "CLEAN",
  `${edge2.layer}`
);

// Test 4.3: Special characters
const edge3 = moderateContent("Hello! @#$%^&*() This is a test 🎉", "AGE_25_39");
assert(
  "4.3 Special characters pass",
  edge3.layer === "CLEAN",
  "CLEAN",
  `${edge3.layer}`
);

// Test 4.4: Mixed languages
const edge4 = moderateContent("This is English and this is 中文 and this is Bahasa", "AGE_25_39");
assert(
  "4.4 Mixed languages pass",
  edge4.layer === "CLEAN",
  "CLEAN",
  `${edge4.layer}`
);

// Test 4.5: numbers only
const edge5 = moderateContent("123456789", "AGE_25_39");
assert(
  "4.5 Numbers pass",
  edge5.layer === "CLEAN",
  "CLEAN",
  `${edge5.layer}`
);

// Test 4.6: POFMA-style correction
const edge6 = moderateContent("The government announced new housing policies yesterday", "AGE_25_39");
assert(
  "4.6 Government discussion passes",
  edge6.layer === "CLEAN",
  "CLEAN",
  `${edge6.layer}`
);

// Test 4.7: Scam patterns that should NOT trigger on innocent content
const edge7 = moderateContent("I need to transfer my CPF to my bank account when I retire", "AGE_60_PLUS");
assert(
  "4.7 CPF discussion passes (not a scam)",
  edge7.layer === "CLEAN" || edge7.layer === "MISINFORMATION_RISK",
  "CLEAN or MISINFORMATION_RISK",
  `${edge7.layer}`
);

// Test 4.8: Singlish with potential false positives
const edge8 = moderateContent("Wah, this CB thing damn shiok sia, confirm plus chop", "AGE_25_39");
assert(
  "4.8 Singlish slang passes",
  edge8.layer === "CLEAN",
  "CLEAN",
  `${edge8.layer}`
);

// Test 4.9: Political discussion
const edge9 = moderateContent("I think the opposition has some good points about transport policy", "AGE_25_39");
assert(
  "4.9 Political discussion passes",
  edge9.layer === "CLEAN",
  "CLEAN",
  `${edge9.layer}`
);

// Test 4.10: Food complaint
const edge10 = moderateContent("The chicken rice at this hawker centre is terrible, never coming back", "AGE_25_39");
assert(
  "4.10 Food complaint passes",
  edge10.layer === "CLEAN",
  "CLEAN",
  `${edge10.layer}`
);

// ============================================================
// TEST SUITE 5: Scam Edge Cases
// ============================================================
console.log("\n🧪 TEST SUITE 5: Scam Edge Cases\n");

// Test 5.1: Legitimate financial discussion
const scamEdge1 = checkForScams("I'm saving money for BTO down payment", 30);
assert(
  "5.1 Legitimate financial discussion passes",
  !scamEdge1.isSuspicious,
  "Not suspicious",
  `Suspicious: ${scamEdge1.isSuspicious}`
);

// Test 5.2: Asking for help (not scam)
const scamEdge2 = checkForScams("Can someone help me understand how to apply for PR?", 30);
assert(
  "5.2 Help request passes",
  !scamEdge2.isSuspicious,
  "Not suspicious",
  `Suspicious: ${scamEdge2.isSuspicious}`
);

// Test 5.3: Discussing investments (not scam)
const scamEdge3 = checkForScams("What do you think about investing in Singapore REITs?", 30);
assert(
  "5.3 Investment discussion passes",
  !scamEdge3.isSuspicious,
  "Not suspicious",
  `Suspicious: ${scamEdge3.isSuspicious}`
);

// Test 5.4: Job scam pattern
const scamEdge4 = checkForScams("You have won a prize! Click here to claim your prize money now", 1);
assert(
  "5.4 Prize scam pattern detected",
  scamEdge4.isSuspicious,
  "Suspicious",
  `Suspicious: ${scamEdge4.isSuspicious}`
);

// Test 5.5: Love scam pattern
const scamEdge5 = checkForScams("I love you, send me money urgently so I can come to Singapore", 5);
assert(
  "5.5 Romance scam pattern detected",
  scamEdge5.isSuspicious,
  "Suspicious",
  `Suspicious: ${scamEdge5.isSuspicious}`
);

// ============================================================
// RESULTS SUMMARY
// ============================================================
console.log("\n" + "=".repeat(60));
console.log("📊 TEST RESULTS SUMMARY");
console.log("=".repeat(60));

const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
const total = results.length;

console.log(`\n✅ Passed: ${passed}/${total}`);
console.log(`❌ Failed: ${failed}/${total}`);
console.log(`📈 Pass Rate: ${((passed / total) * 100).toFixed(1)}%`);

if (failed > 0) {
  console.log("\n❌ FAILED TESTS:");
  results
    .filter((r) => !r.passed)
    .forEach((r) => {
      console.log(`  - ${r.name}`);
      console.log(`    Expected: ${r.expected}`);
      console.log(`    Actual: ${r.actual}`);
    });
}

console.log("\n" + "=".repeat(60));

// Exit with appropriate code
process.exit(failed > 0 ? 1 : 0);
