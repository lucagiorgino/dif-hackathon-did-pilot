import { useWeb5 } from "@/hooks/useWeb5";
import { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Row, Spinner} from "react-bootstrap";
import { Reviews } from "..";
import { ReviewTuple } from "@/types/types";
import { Stats } from "../Home/Stats";
import didPilotTEDReviewAPI, { DidStats } from "@/api/didPilotTEDReview";

export function Profile () {
    const {web5, userDid, web5Loading} = useWeb5();

    const [reviews, setReviews] = useState<ReviewTuple[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DidStats | undefined>(undefined);

   
    const getReviewsFromDWN = async () => {
        if (web5 && userDid) {
            setLoading(true);
            const { teds: tedReviews } = await didPilotTEDReviewAPI.getTEDReviewsByRecipient(web5, userDid);
            const stats = await didPilotTEDReviewAPI.getDidStats(web5, userDid);

            console.log("Results: ", tedReviews);
            const reviews: ReviewTuple[] = [];
            for(const tedReview of tedReviews) {
                const r = didPilotTEDReviewAPI.extractReviewFromTED(tedReview, userDid);
                if (r) {
                    reviews.push({ted: tedReview, review: r});
                } else {
                    console.log("Err", r);
                }
            }
            
            setStats(stats);
            setReviews(reviews);
            setLoading(false);
        } 
    }

    useEffect(() => {
        getReviewsFromDWN()
    }, [web5, userDid])

    return <>
        <div  className="text-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews that I received.</Tooltip>}>
                <h1>Profile</h1>
            </OverlayTrigger>
        </div>

        <p className="text-center">It's time to know what others think about you. Reviews about you: </p>

        {!loading && !web5Loading ?
            <>
                {reviews.length > 0 ? <Stats stats={stats}/> : <></>}
                <Reviews reviews={reviews} />
            </>
        : 
        <Row className="justify-content-center mt-4">
            <Spinner animation="border" variant="warning"/>
        </Row>
        }
    </>;
}