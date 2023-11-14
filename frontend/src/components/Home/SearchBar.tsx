import API from '@/api/didPilot';
import { useWeb5 } from '@/hooks/useWeb5';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

function SearchBar() {
  const {web5, userDid} = useWeb5();

  const testFoo = async () => {
    console.log(userDid);
    if(web5){
      console.log(await API.writeDWN(web5, "Hello dwn!"));
    }
  }

  return (
    <>
        <Stack gap={2}>
            <Form.Group controlId="searchForm">
                <Form.Control type="text" placeholder="Insert a did" className="me-auto"/>
                <Form.Text id="searchHelpBlock" muted>
                    Search for the reviews and stats of the inserted did.
                </Form.Text>
            </Form.Group>
            <Button variant="dark" onClick={testFoo}>Search</Button>
        </Stack>
        
    </>
  );
}

export default SearchBar;