import API from "@/api/didPilot";
import { useWeb5 } from "@/hooks/useWeb5";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger} from "react-bootstrap";
import { Review } from "..";
import { DidReview } from "@/types/types";

export function Profile () {
    const {web5, userDid} = useWeb5();
    const [reviews, setReviews] = useState<DidReview[]>([]);

    useEffect(() => {
        
        const getReviewsFromDWN = async () => {
            if (web5 && userDid) {
                const { parsedRecords, records } = await API.queryRecordsDWN(
                    web5,
                    {
                        message: {
                            filter: {
                                dataFormat: "application/json",
                                recipient: userDid
                            }
                        }
                    }
                )
                console.log("reviews: ", parsedRecords)
                console.log("records: ", records)
                if (parsedRecords)
                    setReviews(parsedRecords)
            } 
        }

        getReviewsFromDWN()
    }, [web5, userDid])

    return <>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews that I received.</Tooltip>}>
            <h1 className="text-center">Profile</h1>
        </OverlayTrigger>
        <span>It's time to know what others think about you.</span>
        <h5>Reviews about you</h5>
        {
            reviews.length > 0 ?
                <>
                    
                    {reviews.map((review, index) => (
                        <Review 
                            key={index} 
                            didSubject={review.subjectDid}
                            stars={review.stars}
                            description={review.description}
                        />
                    ))}
                </>
            :
                <>There are no reviews at the moment.</>
        }
    </>;
}