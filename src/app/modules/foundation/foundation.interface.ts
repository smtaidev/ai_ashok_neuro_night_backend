import { Types } from "mongoose";

export interface IFoundation {
    _id: Types.ObjectId;

    companyName: string;

    identity: {
        mission?: string;
        value?: string;
        purpose?: string;
    };

    zeroIn: {
        targetCustomer?: string;
        keyCustomerNeed?: string;
        valueProposition?: string;
    };

    capabilitys: [
  {
    _id?:{type:string},
    capability: { type: String, default: null },
    type: { type: String, default: null }
  }
]
    differentiatingCapabilities?: string[];
}
