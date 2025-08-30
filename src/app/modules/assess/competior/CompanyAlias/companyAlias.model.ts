import mongoose from "mongoose";
const CompanyAliasSchema = new mongoose.Schema({
 companyId: { type: mongoose.Schema.Types.ObjectId, ref: "competitor-stores",
required: true },
 alias: { type: String, required: true },
 source: String // patents, filings, etc.
});
CompanyAliasSchema.index({ companyId: 1, alias: 1 }, { unique:
true });
export default mongoose.model("CompanyAlias", CompanyAliasSchema);