import { useState } from "react";
import { Badge, Button, Collapse, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";
import Card from "react-bootstrap/esm/Card";

export function Review(props: {didSubject: string, stars: number, description: string}) {

    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const stars = (n: number) => {
        const stars = [];

        for (let i = 0; i < n; i++) {
            stars.push(<i key={i} className="bi bi-star-fill ms-2 text-warning"/>);
        }

        return stars;
    };

    return <>
    <Card>
      <Card.Body>
        <Card.Title >
          <Stack direction="horizontal" gap={3}>
            <p className="text-truncate my-auto" >{props.didSubject}</p>
            <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={<Tooltip id="button-tooltip">{copied ? "Copied!" : "Copy"}</Tooltip>} onExited={()=>setCopied(false)}>
              <Button size="sm" variant="outline-dark" onClick={() => {navigator.clipboard.writeText(props.didSubject); setCopied(true);}}>
                <i className="bi bi-copy"/>
              </Button>
            </OverlayTrigger>
          </Stack>
        </Card.Title>
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