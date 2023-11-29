import { DidStats, Stat } from "@/api/didPilotTEDReview";
import { Badge, Col, Container, Row, } from "react-bootstrap";

export function Stats (props: {stats: DidStats | undefined}) {
    const stats = props.stats;
    return <> 
    <Container className="my-4">
    {   
        stats ?
        <Row className="d-flex justify-content-between g-2" >
            
            {Object.values(stats).map((value: Stat, index: number)  => (
                <Col key={index} className="d-flex justify-content-evenly">
                    <Badge key={index} bg="primary" className="">
                        <h6 className="my-auto p-1">{value.textToDisplay} <Badge key={index} bg="light" text="dark">{value.value}</Badge></h6>
                    </Badge>
                </Col>
            ))}
        </Row>
        :
        <Row className="justify-content-center mt-4">
            <span className="text-center">No stats available.</span>
        </Row>
            
        }
    </Container>
    </>;
}