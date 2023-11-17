import { useState } from "react";
import { Badge, Button, Collapse } from "react-bootstrap";
import Card from "react-bootstrap/esm/Card";

export function Review(props: {didSubject: string, stars: number, description: string}) {

    const [open, setOpen] = useState(false);

    const stars = (n: number) => {
        const stars = [];

        for (let i = 0; i < n; i++) {
            stars.push(<i className="bi bi-star-fill ms-2 text-warning"/>);
        }

        return stars;
    };

    return <>
    <Card className="" >
      <Card.Body>
        <Card.Title className="text-truncate">{props.didSubject} </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{stars(props.stars)}</Card.Subtitle>
        <Badge bg="dark" className="text-uppercase" onClick={() => setOpen(!open)} >{!open ? "Read description" : "Hide description"}</Badge>
        <Collapse in={open}>
          <Card.Text className="mt-2">
              {props.description}
          </Card.Text>
        </Collapse>
      </Card.Body>
    </Card>
    </>
}