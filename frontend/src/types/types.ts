import { TrustEstablishmentDocumentReview } from "@/api/didPilotTEDReview";

export type DidReview = {
  subjectDid: string;
  stars: number;
  description: string;
} 

export type ReviewTuple = {
  ted: TrustEstablishmentDocumentReview,
  review: DidReview
}