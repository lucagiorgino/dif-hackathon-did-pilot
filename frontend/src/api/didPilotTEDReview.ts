import { DidInteraction, DidReview } from '@/types/types';
import {
    Web5,
    Record,
    RecordsQueryRequest,
} from '@web5/api';
import dwnConnector from './dwnConnector';
import { 
  TrustEstablishmentDocument,
  ReviewSchema
} from '@/types/trust-establishment';
import trustEstablishmentDocumentAPI from './trustEstablishment';
import { reviewProtocolDefinition } from '@/protocols/review/review.protocol';

type TEDResponse = {
    record: Record | undefined,
    ted: TrustEstablishmentDocumentReview | undefined
}

type TEDsResponse = {
    records: Record[] | undefined,
    teds: TrustEstablishmentDocumentReview[]
}

// type InteractionResponse = {
//     record: Record | undefined,
//     interaction: DidInteraction | undefined
// }

type InteractionsResponse = {
    records: Record[] | undefined,
    interactions: InteractionObj[] | undefined
}

type InteractionObj = {
    interaction: DidInteraction,
    authorReview?: DidReview,
    recipientReview?: DidReview
}

export type Stat = {
    value: number | string,
    textToDisplay: string
}

export type DidStats = {
    totalReviews: Stat,
    averageStars: Stat,
    reviewedSince: Stat,
    totalReviewers: Stat,
    totalInteractions: Stat
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

const createInteraction = async (
    web5: Web5,
    recipient: string,
    proof: string,
): Promise<Record> => {
    
    const { record } = await web5.dwn.records.create({
        data: proof,
        message: {
            protocol: reviewProtocolDefinition.protocol,
            protocolPath: 'interaction',
            schema: reviewProtocolDefinition.types.interaction.schema,
            dataFormat: reviewProtocolDefinition.types.interaction.dataFormats[0],
            recipient: recipient,
        },
    })
    console.log("record", record)
    if (!record) {
        throw new Error('Unable to create record');
    }
    const { status: sendStatus } = await record.send(recipient);

    if (sendStatus.code !== 202) {
        console.log("Unable to send to target did:" + sendStatus);
    }
    else {
        console.log("Shared list sent to recipient");
    }

    return record
}

const getInteractions = async (
    web5: Web5,
): Promise<Record[] | undefined> => {
    const { records } = await web5.dwn.records.query({
        message: {
            filter: {
                schema: reviewProtocolDefinition.types.interaction.schema
            }
        }
    })

    console.log("retrieved records", records)

    return records
}

const deleteInteraction = async (
    web5: Web5,
    id: string,
) => {
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

const getInteractionsByAuthor = async (
    web5: Web5
): Promise<InteractionsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        // from: author,
        message: {
            filter: {
                dataFormat: "text/plain",
                protocol: reviewProtocolDefinition.protocol,
                protocolPath: 'interaction',
                schema: reviewProtocolDefinition.types.interaction.schema
            }
        }
    })

    // parse all records to DidInteraction objects
    const interactions: InteractionObj[] = []
    if (records) {
        for(let i = 0; i < records.length; i++) {
            interactions.push(
                await getInteractionObjFromRecord(records[i], parsedRecords[i], web5)
            )
        }
    }

    return { records, interactions }
}

const getInteractionsByRecipient = async (
    web5: Web5,
    recipient: string,
): Promise<InteractionsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        message: {
            filter: {
                dataFormat: "text/plain",
                recipient: recipient,
                protocol: reviewProtocolDefinition.protocol,
                protocolPath: 'interaction',
                schema: reviewProtocolDefinition.types.interaction.schema
            }
        }
    })

    // parse all records to DidInteraction objects
    const interactions: InteractionObj[] = []
    if (records) {
        for(let i = 0; i < records.length; i++) {
            interactions.push(
                await getInteractionObjFromRecord(records[i], parsedRecords[i], web5)
            )
        }
    }

    return { records, interactions }
}

const getPendingInteractions = async (
    web5: Web5,
    userDid: string,
): Promise<DidInteraction[]> => {
    let allInteractions: InteractionObj[] = []
    const { interactions: recipientInteractions } = await getInteractionsByRecipient(web5, userDid)
    const { interactions: authorInteractions } = await getInteractionsByAuthor(web5)
    console.log("recipientInteractions", recipientInteractions)
    console.log("authorInteractions", authorInteractions)
    allInteractions = allInteractions.concat(recipientInteractions || [])
    allInteractions = allInteractions.concat(authorInteractions || [])
    console.log("allInteractions", allInteractions)

    // select only the interactions that are not filled
    // or there are no reviews from the selected user
    const interactions = allInteractions.filter(interaction => 
        !interaction.interaction.filled && 
        (
            (
                interaction.interaction.author == userDid &&
                interaction.authorReview == undefined
            ) 
            ||
            (
                interaction.interaction.recipient == userDid &&
                interaction.recipientReview == undefined
            )
        )
    ).map(interaction => interaction.interaction)

    console.log("filtered interactions", interactions)
    return interactions
}

const createTEDReview = async (
    web5: Web5, 
    author: string, 
    version: string, 
    review: DidReview,
    recipient: string,
    parentRecordId?: string,
    contextId?: string,
) => {
      // create TrustEstablishmentDocument with entries
      const tedReview = trustEstablishmentDocumentAPI.createTrustEstablishmentDocument({
        author: author,
        version: version,
        entries: {
            [reviewProtocolDefinition.types.review.schema]: {
                [author]: review
            }
        }
      })
      trustEstablishmentDocumentAPI.validateTrustEstablishmentDocument(tedReview, ReviewSchema)
      const record = await dwnConnector.writeRecord(web5, {
          data: tedReview,
          message: {
            dataFormat: 'application/json',
            recipient: recipient,
            protocol: reviewProtocolDefinition.protocol,
            protocolPath: 'interaction/review',
            parentId: parentRecordId,
            contextId: contextId,
            schema: reviewProtocolDefinition.types.review.schema
          },
      })
  
      return record
  }

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTEDReviewsByAuthor = async (web5: Web5): Promise<TEDsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        message: {
            filter: {
                dataFormat: "application/json",
                protocol: reviewProtocolDefinition.protocol,
                protocolPath: "interaction/review",
                schema: reviewProtocolDefinition.types.review.schema,
            }
        }
    })

    return { records, teds: parsedRecords as TrustEstablishmentDocumentReview[] }
}

const getTEDReviewsByRecipient = async (web5: Web5, recipient: string, sorting?: string): Promise<TEDsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        message: {
            filter: {
                dataFormat: "application/json",
                recipient: recipient,
                protocol: reviewProtocolDefinition.protocol,
                protocolPath: "interaction/review",
                schema: reviewProtocolDefinition.types.review.schema
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dateSort: (sorting || "createdDescending") as any
        }
    })

    return { records, teds: parsedRecords as TrustEstablishmentDocumentReview[] }
}

const getTEDReviewsByInteractionId = async (web5: Web5, interactionId: string): Promise<TEDsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        message: {
            filter: {
                dataFormat: "application/json",
                protocol: reviewProtocolDefinition.protocol,
                protocolPath: "interaction/review",
                parentId: interactionId,
                schema: reviewProtocolDefinition.types.review.schema
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
                    protocol: reviewProtocolDefinition.protocol,
                    protocolPath: "interaction/review",
                    schema: reviewProtocolDefinition.types.review.schema
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dateSort: "createdDescending" as any
            }
        }
    )
    const { interactions } = await getInteractionsByRecipient(web5, did)
    
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
        },
        totalInteractions: {
            value: interactions?.length || 0,
            textToDisplay: "Total interactions"
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
    // console.log("inside topic", topic)
    const topicEntries = ted.entries[topic]
    const topicEntriesKeys = Object.keys(topicEntries)
    topicEntriesKeys.forEach(topicEntryKey => {
        // console.log("inside topicEntryKey", topicEntryKey)
        // console.log(topicEntryKey === userDid, topicEntryKey, userDid)
        if (topicEntryKey === userDid) {
            review = topicEntries[topicEntryKey] as DidReview
        }
    })
  })
//   console.log("review", review)
  
  return review
}

const getInteractionObjFromRecord = async (record: Record, proof: string, web5?: Web5): Promise<InteractionObj> => {
    let authorReview: DidReview | undefined
    let recipientReview: DidReview | undefined
    if (web5) {
        // get reviews from this record id and extract the review
        const reviews = await getTEDReviewsByInteractionId(web5, record.id)
        // extract all reviews from TED to see if there is at least one with record.author as author and one with record.recipient as author
        const authorTEDReview = reviews.teds.find(ted => extractReviewFromTED(ted, record.author))
        const recipientTEDReview = reviews.teds.find(ted => extractReviewFromTED(ted, record.recipient))
        authorReview = authorTEDReview ? extractReviewFromTED(authorTEDReview, record.author) : undefined
        recipientReview = recipientTEDReview ? extractReviewFromTED(recipientTEDReview, record.recipient) : undefined
    }
    const options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' };

    return {
        interaction: {
            author: record.author,
            recipient: record.recipient,
            createdDate: new Date(record.dateCreated).toLocaleDateString('en-US', options),
            recordId: record.id,
            contextId: record.contextId,
            proof: proof,
            filled: (authorReview !== undefined && recipientReview !== undefined) ? true : false
        },
        authorReview,
        recipientReview
    }
}

const didPilotTEDReviewAPI = { getInteractions, createInteraction, deleteInteraction, getInteractionsByAuthor, getInteractionsByRecipient, getPendingInteractions, getInteractionObjFromRecord, getTEDReviewById, getDidStats, createTEDReview, deleteTEDReviewById, getTEDReviewsByAuthor, getTEDReviewsByRecipient, extractReviewFromTED};
export default didPilotTEDReviewAPI;