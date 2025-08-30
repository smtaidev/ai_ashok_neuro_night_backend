import OpenAI from "openai";
import insightModel from "./insight.model";
import signalModel from "../Signal/signal.model";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
export async function generateInsights(companyId: string) {
  const signals = await signalModel
    .find({ companyId })
    .sort({ capturedAt: -1 })
    .limit(120)
    .lean();
  const top = selectTopSignals(signals);
  const prompt = `You are an AI strategy analyst. Given the following
signals (JSON), produce up to 5 insights as JSON with keys: title,
context, implication, urgency (low|medium|high), confidence
(low|medium|high), sources[{type,url,capturedAt}].\nSignals:
${JSON.stringify(top)}`;
  const resp = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    temperature: 0.2,
  });
  const insights = JSON.parse((resp as any).output_text || "[]");
  for (const i of insights) {
    await insightModel.create({ companyId, ...i });
  }
  return insights;
}
function selectTopSignals(all: any[]) {
  const bySource: Record<string, any[]> = {};
  for (const s of all) (bySource[s.source] ||= []).push(s);
  // cap per source to keep tokens lean
  for (const k of Object.keys(bySource)) bySource[k] = bySource[k].slice(0, 20);
  return bySource;
}

// import OpenAI from "openai";
// import insightModel from "./insight.model";
// import signalModel from "../Signal/signal.model";

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// export async function generateInsights(companyId: string) {
//   const signals = await signalModel
//     .find({ companyId })
//     .sort({ capturedAt: -1 })
//     .limit(120)
//     .lean();

//   const top = selectTopSignals(signals);

//   const prompt = `You are an AI strategy analyst. Given the following
// signals (JSON), produce up to 5 insights as JSON with keys: title,
// context, implication, urgency (low|medium|high), confidence
// (low|medium|high), sources[{type,url,capturedAt}].\nSignals:
// ${JSON.stringify(top)}`;

//   const resp = await client.responses.create({
//     model: "gpt-4.1-mini",
//     input: prompt,
//     temperature: 0.2,
//     text_format: "json" // নতুন JSON mode
//   });

//   const outputText = resp.output_text ?? "[]";
//   const insights = JSON.parse(outputText);

//   for (const i of insights) {
//     await insightModel.create({ companyId, ...i });
//   }

//   return insights;
// }

// function selectTopSignals(all: any[]) {
//   const bySource: Record<string, any[]> = {};
//   for (const s of all) (bySource[s.source] ||= []).push(s);
//   for (const k of Object.keys(bySource)) bySource[k] = bySource[k].slice(0, 20);
//   return bySource;
// }
