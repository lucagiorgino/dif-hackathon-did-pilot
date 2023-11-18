import API from "@/api/didPilot";
import { useWeb5 } from "@/hooks/useWeb5";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Row, Spinner} from "react-bootstrap";
import { Review, Reviews } from "..";
import { DidReview } from "@/types/types";

export function Profile () {
    const {web5, userDid} = useWeb5();
    const [reviews, setReviews] = useState<DidReview[]>([]);
    const [loading, setLoading] = useState(false);

    const getReviewsFromDWN = async () => {
        if (web5 && userDid) {
            setLoading(true);
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
            );
            console.log("reviews: ", parsedRecords);
            console.log("records: ", records);
            if (parsedRecords)
                setReviews(parsedRecords);
            setLoading(false);
        } 
    }

    useEffect(() => {
        getReviewsFromDWN()
    }, [web5, userDid])

    return <>
        <p  className="text-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews that I received.</Tooltip>}>
                <h1>Profile</h1>
            </OverlayTrigger>
        </p>

        <p className="text-center">It's time to know what others think about you. Reviews about you: </p>

        {!loading ?
        <Reviews reviews={reviews} />
        : 
        <Row className="justify-content-center mt-4">
            <Spinner animation="border" variant="warning"/>
        </Row>
        }
    </>;
}