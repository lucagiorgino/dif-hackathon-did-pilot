import { DidReview } from '@/types/types';
import {
    Web5,
    Record,
    RecordsQueryRequest,
} from '@web5/api';
import dwnConnector from './dwnConnector';
import { 
  Entries, 
  TrustEstablishmentDocument,
  ReviewSchema
} from '@/types/trust-establishment';
import trustEstablishmentDocumentAPI from './trustEstablishment';

type TEDResponse = {
    record: Record | undefined,
    ted: TrustEstablishmentDocumentReview | undefined
}

type TEDsResponse = {
    records: Record[] | undefined,
    teds: TrustEstablishmentDocumentReview[]
}

export type Stat = {
    value: number | string,
    textToDisplay: string
}

export type DidStats = {
    totalReviews: Stat,
    averageStars: Stat,
    reviewedSince: Stat,
    totalReviewers: Stat
}

export type TrustEstablishmentDocumentReview = {
  id: string
  author: string
  created: string
  validFrom?: string
  validUntil?: string
  version: string
  entries: {
    [key: string]: {
      [key: string]: DidReview
    }
  }
}

const createTEDReview = async (
  web5: Web5, 
  author: string, 
  version: string, 
  entries: Entries,
  recipient: string,
) => {
    // create TrustEstablishmentDocument with entries
    const tedReview = trustEstablishmentDocumentAPI.createTrustEstablishmentDocument({
      author: author,
      version: version,
      entries: entries
    })
    trustEstablishmentDocumentAPI.validateTrustEstablishmentDocument(tedReview, ReviewSchema)
    const record = await dwnConnector.writeRecord(web5, {
        data: tedReview,
        message: {
          dataFormat: 'application/json',
          recipient: recipient,
        },
    })

    return record
}

// update review (NOT AVAILABLE FOR TED)
// const updateReviewById = async (web5: Web5, id: string, review: DidReview) => {
//     const status = await dwnConnector.updateRecord(
//         web5,
//         {
//             message: {
//                 filter: {
//                     recordId: id
//                 }
//             }
//         },
//         {
//             data: review
//         }
//     )

//     return status
// }

// delete review
const deleteTEDReviewById = async (web5: Web5, id: string) => {
    const deleteResult = await dwnConnector.deleteRecord(
        web5, 
        {
            message: {
                filter: {
                    recordId: id
                }
            }
        }
    )

    return deleteResult
}

// read review
const getTEDReviewById = async (web5: Web5, id: string): Promise<TEDResponse> => {
    const record = await dwnConnector.readRecord(web5, {
        message: {
            filter: {
                recordId: id
            }
        }
    })

    return {
        record,
        ted: await record.data.json()
    }
}

// query reviews
const getTEDReviewsByAuthor = async (web5: Web5, author: string): Promise<TEDsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        from: author,
        message: {
            filter: {
                dataFormat: "application/json",
            }
        }
    })

    return { records, teds: parsedRecords as TrustEstablishmentDocumentReview[] }
}

const getTEDReviewsByRecipient = async (web5: Web5, recipient: string): Promise<TEDsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        message: {
            filter: {
                dataFormat: "application/json",
                recipient: recipient,
            }
        }
    })

    return { records, teds: parsedRecords as TrustEstablishmentDocumentReview[] }
}

const getReviews = async (web5: Web5, query: RecordsQueryRequest): Promise<TEDsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, query)

    return { records, teds: parsedRecords as TrustEstablishmentDocumentReview[] }
}

const getDidStats = async (web5: Web5, did: string): Promise<DidStats> => {
    const { records, teds } = await getReviews(
        web5,
        {
            message: {
                filter: {
                    dataFormat: "application/json",
                    recipient: did,
                },
                // TODO: check if this is OKAY for us
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dateSort: "createdDescending" as any
            }
        }
    )
    console.log("records", records)
    console.log("teds", teds)
    console.log("did", did)
    const reviewers: string[] = []
    records?.forEach(record => {
        if (!reviewers.includes(record.author)) {
        reviewers.push(record.author)
        }
    })

    // calculate average stars after extracting all reviews
    const stars = teds.map(ted => extractReviewFromTED(ted, did)?.stars || 0)
    const averageStars = stars.reduce((acc, curr) => acc + curr, 0) / stars.length

    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };

    return {
        totalReviews: {
            value: teds.length, 
            textToDisplay: "Total reviews"
        },
        averageStars: {
            value: averageStars, 
            textToDisplay: "Average stars"
        },
        reviewedSince:  {
            value: records && records.length > 0 ? (new Date(records[0].dateCreated)).toLocaleDateString('en-US', options) : "NA", //TODO: first date of a received review?
            textToDisplay: "Reviewed since"
        },
        totalReviewers: {
            value: reviewers.length,
            textToDisplay: "Total reviewers"
        }
    }
}

export const extractReviewFromTED = (ted: TrustEstablishmentDocument, userDid: string): DidReview | undefined => {
  if (!ted.entries) {
    return undefined
  }
  // each review is inside a topic
  const topics = Object.keys(ted.entries)

  let review: DidReview | undefined
  topics.forEach(topic => {
    const topicEntries = ted.entries[topic]
    const topicEntriesKeys = Object.keys(topicEntries)
    topicEntriesKeys.forEach(topicEntryKey => {
      if (topicEntryKey === userDid) {
        review = topicEntries[topicEntryKey] as DidReview
      }
    })
  })
  
  return review
}


const didPilotTEDReviewAPI = { getTEDReviewById, getDidStats, createTEDReview, deleteTEDReviewById, getTEDReviewsByAuthor, getTEDReviewsByRecipient, extractReviewFromTED};
export default didPilotTEDReviewAPI;