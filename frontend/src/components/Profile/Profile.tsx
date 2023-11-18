import { useWeb5 } from "@/hooks/useWeb5";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Row, Spinner} from "react-bootstrap";
import { Review, Reviews } from "..";
import { DidReview } from "@/types/types";
import didPilotReviewAPI, { DidStats } from "@/api/didPilotReview";

export function Profile () {
    const {web5, userDid} = useWeb5();
    const [reviews, setReviews] = useState<DidReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DidStats | undefined>(undefined); // TODO: use stats


    const getReviewsFromDWN = async () => {
        if (web5 && userDid) {
            const { reviews } = await didPilotReviewAPI.getReviewsByRecipient(web5, userDid);
            const stats = await didPilotReviewAPI.getDidStats(web5, userDid);
            
            console.log("Results: ", reviews);
            
            setStats(stats);
            setReviews(reviews);
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