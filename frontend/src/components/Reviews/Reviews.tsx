import { ReviewTuple } from "@/types/types";
import { Col, Container, Row } from "react-bootstrap";
import { Review } from "./Review";

export function Reviews (props: {reviews: ReviewTuple[]}) {
    const reviews = props.reviews;
    return <> 
    <Container className="my-4">
    {
        reviews.length > 0 ?
            <Row lg={1} xl={2}  className="g-2">
                {reviews.map((reviewTuple, index) => (
                    <Col key={index}>
                        <Review 
                            key={index} 
                            didSubject={reviewTuple.review.subjectDid}
                            stars={reviewTuple.review.stars}
                            description={reviewTuple.review.description}
                        />
                    </Col>
                ))}
            </Row>

        :
        <Row className="justify-content-center mt-4">
            <span className="text-center">No reviews found.</span>
        </Row>
            
        }
    </Container>
    </>;
}