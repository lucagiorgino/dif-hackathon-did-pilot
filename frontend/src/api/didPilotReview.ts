import { DidReview } from '@/types/types';
import {
    Web5,
    Record,
    RecordsQueryRequest,
} from '@web5/api';
import dwnConnector from './dwnConnector';

type ReviewResponse = {
    record: Record,
    review: DidReview
}

type ReviewsResponse = {
    records: Record[] | undefined,
    reviews: DidReview[]
}

export type DidStats = {
    totalReviews: number,
    averageStars: number
    reviewedSince: string,
    totalReviewers: number
}


const createReview = async (web5: Web5, review: DidReview) => {
    const record = await dwnConnector.writeRecord(web5, {
        data: review,
        message: {
          dataFormat: 'application/json',
          recipient: review.subjectDid,
        },
    })

    return record
}

// update review
const updateReviewById = async (web5: Web5, id: string, review: DidReview) => {
    const status = await dwnConnector.updateRecord(
        web5,
        {
            message: {
                filter: {
                    recordId: id
                }
            }
        },
        {
            data: review
        }
    )

    return status
}

// delete review
const deleteReviewById = async (web5: Web5, id: string) => {
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
const getReviewById = async (web5: Web5, id: string): Promise<ReviewResponse> => {
    const record = await dwnConnector.readRecord(web5, {
        message: {
            filter: {
                recordId: id
            }
        }
    })

    return {
        record,
        review: await record.data.json()
    }
}

// query reviews
const getReviewsByAuthor = async (web5: Web5, author: string) => {
    const { records: reviewRecords, parsedRecords: parsedReviews } = await dwnConnector.queryRecords(web5, {
        from: author,
        message: {
            filter: {
                dataFormat: "application/json",
            }
        }
    })

    return { reviewRecords, reviews: parsedReviews as DidReview[] }
}

const getReviewsByRecipient = async (web5: Web5, recipient: string): Promise<ReviewsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, {
        message: {
            filter: {
                dataFormat: "application/json",
                recipient: recipient,
            }
        }
    })

    return { records, reviews: parsedRecords as DidReview[] }
}

const getReviews = async (web5: Web5, query: RecordsQueryRequest): Promise<ReviewsResponse> => {
    const { records, parsedRecords } = await dwnConnector.queryRecords(web5, query)

    return { records, reviews: parsedRecords as DidReview[] }
}

const getDidStats = async (web5: Web5, did: string): Promise<DidStats> => {
    const { records, reviews } = await getReviews(
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
    console.log("reviews", reviews)
    console.log("did", did)
    const reviewers: string[] = []
    records?.forEach(record => {
        if (!reviewers.includes(record.author)) {
        reviewers.push(record.author)
        }
    })

    return {
        totalReviews: reviews.length,
        averageStars: reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length,
        reviewedSince: records && records.length > 0 ? (new Date(records[0].dateCreated)).toLocaleDateString() : "NA",
        totalReviewers: reviewers.length
    }
}

const didPilotReviewAPI = { createReview, getReviewsByAuthor, getReviewById, updateReviewById, deleteReviewById, getReviewsByRecipient, getDidStats };
export default didPilotReviewAPI;