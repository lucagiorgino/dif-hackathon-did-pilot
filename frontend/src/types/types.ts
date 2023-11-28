import { TrustEstablishmentDocumentReview } from "@/api/didPilotTEDReview";

export type DidReview = {
  subjectDid: string;
  stars: number;
  description: string;
} 

export type DidInteraction = {
  author: string;
  recipient: string;
  createdDate: string;
  recordId: string;
  contextId: string;
  proof: string;
  filled: boolean;
}

export type ReviewTuple = {
  ted: TrustEstablishmentDocumentReview,
  review: DidReview
}