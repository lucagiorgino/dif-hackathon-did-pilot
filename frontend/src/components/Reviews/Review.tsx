import Card from "react-bootstrap/esm/Card";

export function Review(props: {didSubject: string, stars: number, description: string}) {

    const stars = (n: number) => {
        const stars = [];

        for (let i = 0; i < n; i++) {
            stars.push(<i className="bi bi-star-fill ms-2 text-warning"/>);
        }

        return stars;
    };

    return <>
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.didSubject} </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{stars(props.stars)}</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
    </Card>
    </>
}