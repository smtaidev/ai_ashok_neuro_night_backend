
import signalModel from "../Signal/signal.model";
import { CompanyModel } from "../../../company/company.model";

(async () => {

  const acme = await CompanyModel.create({
    name: "Acme Corp",
    domain: "acme.com",
    ticker: "ACME",
  });
  await signalModel.insertMany([
    {
      companyId: acme._id,
      source: "job_postings",
      title: "Sr AIEngineer",
      url: "https://adzuna.com/jobs/123",
      capturedAt: new Date(),
    },
    {
      companyId: acme._id,
      source: "news",
      title: "Acme expands intoAPAC",
      url: "https://news/site/abc",
      capturedAt: new Date(),
    },
  ]);
  console.log("Seeded");
  process.exit(0);
})();

// export async function saveSignals(companyId: string, items: any[]) {
//  for (const s of items) {
//  try {
//  await Signal.updateOne(
//  { companyId, source: s.source, url: s.url || 
// `${s.source}:${s.title}:${s.capturedAt}` },
//  { $setOnInsert: { ...s, companyId } },
//  { upsert: true }
//  );
//  } catch (e) {
//  // duplicate or validation errors → ignore; log if needed
//  }
//  }
