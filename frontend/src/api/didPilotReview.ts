import { DidReview } from '@/types/types';
import {
    Web5,
    Record,
} from '@web5/api';
import dwnConnector from './dwnConnector';

type ReviewResponse = {
    record: Record,
    review: DidReview
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

    // change parsedReviews to be an array of DidReview objects
    const reviews = parsedReviews as DidReview[]

    return { reviewRecords, reviews }
}

const didPilotReview = { createReview, getReviewsByAuthor, getReviewById, updateReviewById, deleteReviewById };
export default didPilotReview;