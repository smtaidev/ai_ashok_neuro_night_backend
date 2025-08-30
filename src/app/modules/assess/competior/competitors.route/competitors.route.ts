import { Router } from "express";

import mongoose from "mongoose";
import signalModel from "../Signal/signal.model";
import insightModel from "../Insight/insight.model";
import { companyModels } from "../company/company.model";
const r = Router();

r.post("/", async (req, res) => {
  try {
    const { name, domain, ticker } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const newCompany = await companyModels.create({
      name,
      domain,
      ticker,
      createdAt: new Date(),
    });

    res.status(201).json(newCompany);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create company" });
  }
});
// 1) Raw signals (grouped)
r.get("/:id/signals", async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.params.id);
    const signals = await signalModel
      .find({ companyId })
      .sort({ capturedAt: -1 })
      .lean();
    const grouped: Record<string, any[]> = {};
    for (const s of signals) (grouped[s.source] ||= []).push(s);
    const latest = (src: string) => grouped[src]?.[0]?.capturedAt || null;
    const freshness = {
      job_postings: latest("job_postings"),
      patents: latest("patents"),
      filings: latest("filings"),
      reviews: latest("reviews"),
      news: latest("news"),
    };
    res.json({ competitorId: companyId, signals: grouped, freshness });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetchsignals" });
  }
});
// 2) Insights
r.get("/:id/insights", async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.params.id);
    const insights = await insightModel
      .find({ companyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    res.json({ competitorId: companyId, insights });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetchinsights" });
  }
});
// 3) Compare Mode (up to 3)
r.get("/compare", async (req, res) => {
  try {
    const ids = (req.query.ids as string)
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id));
    const hiringAgg = await signalModel.aggregate([
      {
        $match: {
          companyId: { $in: ids },
          source: "job_postings",
          capturedAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) },
        },
      },
      { $group: { _id: "$companyId", count: { $sum: 1 } } },
    ]);
    const patentsAgg = await signalModel.aggregate([
      {
        $match: {
          companyId: { $in: ids },
          source: "patents",
          capturedAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60) },
        },
      },
      { $group: { _id: "$companyId", count: { $sum: 1 } } },
    ]);
    const filingsAgg = await signalModel.aggregate([
      {
        $match: {
          companyId: { $in: ids },
          source: "filings",
          capturedAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90) },
        },
      },
      {
        $group: {
          _id: "$companyId",
          items: { $push: "$title" },
          count: { $sum: 1 },
        },
      },
    ]);
    const reviewsDelta: Record<string, number> = {}; // compute QoQdeltas in your jobs layer; placeholder here
    const metrics: any[] = [
      { metric: "hiring_spike_30d" },
      { metric: "patents_60d" },
      { metric: "sec_filings_qtr" },
      { metric: "glassdoor_delta_qoq" },
    ];
    const idStr = (o: any) => String(o._id);
    for (const m of metrics) for (const id of ids) (m as any)[String(id)] = "—";
    for (const h of hiringAgg)
      metrics[0][idStr(h)] = `+${h.count}
roles`;
    for (const p of patentsAgg) metrics[1][idStr(p)] = p.count;
    for (const f of filingsAgg)
      metrics[2][idStr(f)] = f.count ? `${f.count} filing(s)` : "None";
    for (const id of ids)
      metrics[3][String(id)] = reviewsDelta[String(id)] ?? 0;
    res.json({ metrics });
  } catch (e) {
    res.status(500).json({ error: "Failed tocompare" });
  }
});
export const competitorRoute= r;
