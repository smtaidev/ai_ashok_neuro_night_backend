import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose, { Types } from "mongoose";
import { AgendaSchema, AssignToMeMeeting } from "./Agenda.model";
import {
  IAgenda,
  IAgendaItem,
  IWelcomeAndOpeningRemark,
} from "./Agenda.interface";
import { Meeting } from "../meetings/meeting.model";

// ✅ Create Agenda
// const createAgenda = async (
//   meetingId: string,
//   companyName: string,
//   payload: IAgenda
// ) => {
//   if (!payload) {
//     throw new AppError(status.BAD_REQUEST, "Agenda data is required!");
//   }
//   const payloadData = { ...payload, companyName, meetingId };
//   const result = await AgendaSchema.create(payloadData);
//   await Meeting.findByIdAndUpdate(meetingId, { $push: { agendaItems: result._id } });
//   return result;
// };

// const createAgenda = async (
//   meetingId: string,
//   companyName: string,
//   payload: IAgenda
// ) => {
//   if (!payload) {
//     throw new AppError(status.BAD_REQUEST, "Agenda data is required!");
//   }

//   // Find existing agenda
//   let existingAgenda = await AgendaSchema.findOne({ meetingId, companyName });

//   if (existingAgenda) {
//     // Update welcomeAndOpeningRemark if present
//     if (payload.welcomeAndOpeningRemark) {
//       existingAgenda.welcomeAndOpeningRemark = payload.welcomeAndOpeningRemark;
//     }

//     // Update inviteAttendees if present
//     if (payload.inviteAttendees) {
//       existingAgenda.inviteAttendees = payload.inviteAttendees;
//     }

//     // Replace agendaItems (max 15)
//     existingAgenda.agendaItems.splice(0, existingAgenda.agendaItems.length); // clear existing
//     if (payload.agendaItems && payload.agendaItems.length > 0) {
//       payload.agendaItems.slice(0, 15).forEach((item) => {
//         existingAgenda.agendaItems.push(item as any);
//       });
//     }

//     const updatedAgenda = await existingAgenda.save();

//     console.log(updateAgenda)
//     // Update Meeting.agendaId properly
//     await Meeting.findByIdAndUpdate(
//       meetingId,
//       { $set: { agendaId: existingAgenda._id } }, // ObjectId directly
//       { new: true }
//     );

//     return updatedAgenda;
//   } else {
//     // Create new agenda
//     const agendaToSave = {
//       ...payload,
//       meetingId,
//       companyName,
//     };

//     const newAgenda = await AgendaSchema.create(agendaToSave);

//     await Meeting.findByIdAndUpdate(
//       meetingId,
//       { $set: { agendaId: newAgenda._id  } },
//       { new: true }
//     );

//     console.log('check data', existingAgenda)
//     return newAgenda;
//   }
// };

export const createAgenda = async (
  meetingId: string,
  companyName: string,
  payload: IAgenda
) => {
  if (!payload) {
    throw new AppError(status.BAD_REQUEST, "Agenda data is required!");
  }

  // Find existing agenda
  let existingAgenda = await AgendaSchema.findOne({ meetingId, companyName });

  if (existingAgenda) {
    // === Welcome & Opening Remark ===
    if (payload.welcomeAndOpeningRemark) {
      existingAgenda.welcomeAndOpeningRemark = {
        ...payload.welcomeAndOpeningRemark,
        presenter: payload.welcomeAndOpeningRemark.presenter.map(
          (id) => new Types.ObjectId(id)
        ) as any,
      };
    }

    // === Invite Attendees ===
    if (payload.inviteAttendees) {
      existingAgenda.inviteAttendees = {
        attendees: payload.inviteAttendees.attendees.map(
          (id) => new Types.ObjectId(id)
        ) as any,
      };
    }

    // === Agenda Items ===
    if (payload.agendaItems && payload.agendaItems.length > 0) {
      // ✅ Replace existing items with new ones
      existingAgenda.agendaItems = payload.agendaItems.map((item) => ({
        ...item,
        presenter: item.presenter.map((id) => new Types.ObjectId(id)) as any,
      })) as any;
    }

    const updatedAgenda = await existingAgenda.save();

    console.log(updatedAgenda);

    // Update Meeting.agendaId
    await Meeting.findByIdAndUpdate(
      meetingId,
      { $set: { agendaId: existingAgenda._id } },
      { new: true }
    );

    return updatedAgenda;
  } else {
    // === Create new agenda ===
    const agendaToSave = {
      ...payload,
      meetingId,
      companyName,
      welcomeAndOpeningRemark: payload.welcomeAndOpeningRemark
        ? {
            ...payload.welcomeAndOpeningRemark,
            presenter: payload.welcomeAndOpeningRemark.presenter.map(
              (id) => new Types.ObjectId(id)
            ) as Types.Array<Types.ObjectId>,
          }
        : undefined,
      inviteAttendees: payload.inviteAttendees
        ? {
            attendees: payload.inviteAttendees.attendees.map(
              (id) => new Types.ObjectId(id)
            ) as Types.Array<Types.ObjectId>,
          }
        : undefined,
      agendaItems: payload.agendaItems
        ? payload.agendaItems.map((item) => ({
            ...item,
            presenter: item.presenter.map(
              (id) => new Types.ObjectId(id)
            ) as Types.Array<Types.ObjectId>,
          }))
        : [],
    };

    const newAgenda = await AgendaSchema.create(agendaToSave);

    await Meeting.findByIdAndUpdate(
      meetingId,
      { $set: { agendaId: newAgenda._id } },
      { new: true }
    );

    console.log("check data", newAgenda);
    return newAgenda;
  }
};

// ✅ Get All Agendas
const getAllAgendas = async (companyName: string, meetingId: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    meetingId: new mongoose.Types.ObjectId(meetingId),
  };
  const result = await AgendaSchema.findOne(query)
    .populate("meetingId")
    .populate("inviteAttendees.attendees", "-password") // attendees ke populate
    .populate("welcomeAndOpeningRemark.presenter", "-password") // welcome presenter
    .populate("agendaItems.presenter", "-password"); // agendaItems presenter
  return result;
};

// ✅ Get Single Agenda
const getSingleAgenda = async (
  companyName: string,
  id: string,
  meetingId: string
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Agenda ID!");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
    meetingId: new mongoose.Types.ObjectId(meetingId),
  };
  const result = await AgendaSchema.findOne(query)
    .populate("meetingId")
    .populate("inviteAttendees.attendees", "-password") // attendees ke populate
    .populate("welcomeAndOpeningRemark.presenter", "-password") // welcome presenter
    .populate("agendaItems.presenter", "-password"); // agendaItems presenter
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Agenda not found!");
  }
  return result;
};

// ✅ Update Agenda

export const updateAgenda = async (
  companyName: string,
  agendaId: string,
  meetingId: string,
  payload: Partial<IAgenda>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  if (!mongoose.Types.ObjectId.isValid(agendaId)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Agenda ID!");
  }

  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Meeting ID!");
  }

  // === Debug ===
  console.log("Updating Agenda:", {
    companyName,
    agendaId,
    meetingId,
    payload,
  });

  // Find agenda
  const existingAgenda = await AgendaSchema.findOne({
    _id: new Types.ObjectId(agendaId),
    meetingId: new Types.ObjectId(meetingId),
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  });

  if (!existingAgenda) {
    throw new AppError(status.NOT_FOUND, "Agenda not found!");
  }

  // === Update inviteAttendees ===
  if (payload.inviteAttendees?.attendees) {
    existingAgenda.inviteAttendees = {
      attendees: payload.inviteAttendees.attendees.map(
        (id) => new Types.ObjectId(id)
      ) as any,
    };
  }

  // === Update welcomeAndOpeningRemark ===
  if (payload.welcomeAndOpeningRemark?.presenter) {
    existingAgenda.welcomeAndOpeningRemark = {
      ...payload.welcomeAndOpeningRemark,
      presenter: payload.welcomeAndOpeningRemark.presenter.map(
        (id) => new Types.ObjectId(id)
      ) as any,
    };
  }

  // === Update agendaItems ===
  if (payload.agendaItems && payload.agendaItems.length > 0) {
    existingAgenda.agendaItems = payload.agendaItems.map((item) => ({
      ...item,
      presenter: item.presenter.map(
        (id) => new Types.ObjectId(id)
      ) as Types.Array<Types.ObjectId>,
    })) as any;
  }

  const updatedAgenda = await existingAgenda.save();

  // Remove __v
  const result = updatedAgenda.toObject();

  return result;
};

// ✅ Delete Agenda
const deleteAgenda = async (
  companyName: string,
  id: string,
  meetingId: string
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, "Invalid Agenda ID!");
  }
  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
    meetingId: new mongoose.Types.ObjectId(meetingId),
  };
  const result = await AgendaSchema.deleteOne(query);
  if (!result.deletedCount) {
    throw new AppError(status.NOT_FOUND, "Agenda not found!");
  }
  return result;
};

const CreateAssignToMeAgenda = async (
  companyName: string,
  userId: string,
  meetingId: string,
  payload: any
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "companyName is required!");
  }
  if (!userId) {
    throw new AppError(status.BAD_REQUEST, " user id is required!");
  }
  if (!meetingId) {
    throw new AppError(status.BAD_REQUEST, " meeting id is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    meetingId: new mongoose.Types.ObjectId(meetingId),
    userId: new mongoose.Types.ObjectId(userId),
  };
  const isExistAssignToMeAgenda = await AssignToMeMeeting.findOne(query);

  if (isExistAssignToMeAgenda) {
    throw new AppError(status.BAD_REQUEST, "already is exist in database ");
  }

  const result = await AssignToMeMeeting.create({
    ...payload,
    companyName,
    meetingId,
    userId,
  });
  return result;
};

const getAgendasByUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(status.BAD_REQUEST, "Invalid User ID!");
  }

  // const agendas = await AgendaSchema.find({
  //   $or: [
  //     { "welcomeAndOpeningRemark.presenter": new mongoose.Types.ObjectId(userId) },
  //     { "agendaItems.presenter": new mongoose.Types.ObjectId(userId) },
  //     { "inviteAttendees.attendees": new mongoose.Types.ObjectId(userId) }
  //   ]
  // }).populate("meetingId").lean();

  const agendas = await AssignToMeMeeting.find({
    userId: userId,
  })
    .populate("meetingId")
    .populate("userId", "-password")
    .populate("inviteAttendees.attendees", "-password")
    .populate("welcomeAndOpeningRemark.presenter", "-password")
    .populate("agendaItems.presenter", "-password")
    .lean();

  if (!agendas || agendas.length === 0) {
    return {
      success: true,
      message: "No agendas found for this user",
      data: [],
    };
  }

  // Remove __v from each agenda
  const result = agendas.map((agenda) => {
    if ("__v" in agenda) delete (agenda as any).__v;
    return agenda;
  });
  console.log(agendas);

return result
};

// const changeMyAssignMeetingStatus=async(userId:string,assignId:string,payload:{status:string})=>{


//  if (!userId) {
//     throw new AppError(status.BAD_REQUEST, " user id is required!");
//   }
//   if (!assignId) {
//     throw new AppError(status.BAD_REQUEST, " assign id is required!");
//   }

//   const isExist=await AssignToMeMeeting.findOne({userId:userId,_id:assignId})

//     if (!isExist) {
//     throw new AppError(status.BAD_REQUEST, " your assign meeting is not found!");
//   }

//   const result=await AssignToMeMeeting.findOneAndUpdate({userId:userId,_id:assignId},{$set:})
// }
export const agendaServices = {
  createAgenda,
  getAllAgendas,
  getSingleAgenda,
  updateAgenda,
  deleteAgenda,
  getAgendasByUser,
  CreateAssignToMeAgenda,
};
