import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function SearchBar() {
  return (
    <>
        <Stack gap={2}>
            <Form.Group controlId="searchForm">
                <Form.Control type="text" placeholder="Insert a did" className="me-auto"/>
                <Form.Text id="searchHelpBlock" muted>
                    Search for the reviews and stats of the inserted did.
                </Form.Text>
            </Form.Group>
            <Button variant="dark">Search</Button>
        </Stack>
        
    </>
  );
}

export default SearchBar;