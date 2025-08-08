
interface Note {
  _id?: string;
  userId: string;
  noteText: string;
}

interface AssessAlignmentCheck {
  _id?: string;
  stakeholdersInvolved1: string[];
  stakeholdersInvolved2: string[];
  stakeholdersInvolved3: string[];
  sharedUnderstanding1: string[];
  sharedUnderstanding2: string[];
  sharedUnderstanding3: string[];
  onTrends: string[];
  onSwot: string[];
  onChallenges: string[];
  onCA: string[];
  notes: Note[];
}
