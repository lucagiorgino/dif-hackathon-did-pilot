import { Interaction, Reviews } from ".";
import { useEffect, useState } from "react";
import { useWeb5 } from "@/hooks/useWeb5";
import { ReviewTuple } from "@/types/types";
import { Container, Tooltip, OverlayTrigger, Row, Spinner } from "react-bootstrap";
import didPilotTEDReviewAPI from "@/api/didPilotTEDReview";

export function ReviewsPage () {
    
    const {web5, userDid, web5Loading} = useWeb5();
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(false);

    // get reviews from the DWN
    const [reviews, setReviews] = useState<ReviewTuple[]>([]);
    const [_interactions, setInteractions] = useState<ReviewTuple[]>([]);

    useEffect(() => {

        const getReviewsFromDWN = async () => {
            if (web5 && userDid) {
                setLoading(true);
                const { teds: tedReviews } = await didPilotTEDReviewAPI.getTEDReviewsByAuthor(web5, userDid);
                
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
                
                setReviews(reviews);
                setLoading(false);
            } 
        }

        const getPendingInteractionsFromDWN = async () => {
            // todo
        }

        getPendingInteractionsFromDWN();
        getReviewsFromDWN();
    }, [trigger, web5, userDid])
     
    return <> 
    <Container className="position-relative" fluid>
        <div  className="text-center">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews done by me.</Tooltip>}>
                <h1>Your Reviews</h1>
            </OverlayTrigger>
        </div>
        
        <Row>
            <h4 className="my-auto">Pending interactions</h4>
            <Row className="mb-5 p-2 g-2 flex-row flex-nowrap shadow bg-body rounded"
                style={{overflowX: "auto"}}
            >   
    
                    <Interaction
                        interactionId={"1"}
                        contextId="aa"
                        didAuthor={"did:a"}
                        didRecipient={"did:b"}
                        creationTime="1 mins ago"
                        trigger={trigger}
                        setTrigger={setTrigger}
                    />
                    <Interaction
                    interactionId={"1"}
                    contextId="aa"
                    didAuthor={"did:a"}
                    didRecipient={"did:b"}
                    creationTime="3 mins ago"
                    trigger={trigger}
                    setTrigger={setTrigger}
                    />
                    <Interaction
                    interactionId={"1"}
                    contextId="aa"
                    didAuthor={"did:a"}
                    didRecipient={"did:b"}
                    creationTime="5 mins ago"
                    trigger={trigger}
                    setTrigger={setTrigger}
                    />
                    <Interaction
                    interactionId={"1"}
                    contextId="aa"
                    didAuthor={"did:a"}
                    didRecipient={"did:b"}
                    creationTime="7 mins ago"
                    trigger={trigger}
                    setTrigger={setTrigger}
                    />
            </Row>
        </Row>

        <h4 className="my-auto">Reviews</h4>
        <p className="text-center">Contribute to the network and write a review. Reviews that you wrote: </p>

        {!loading && !web5Loading ?
        <><Reviews reviews={reviews} /></>
        : 
        <Row className="justify-content-center mt-4">
            <Spinner animation="border" variant="warning"/>
        </Row>
        }
    </Container>
    
    
    </>;
}