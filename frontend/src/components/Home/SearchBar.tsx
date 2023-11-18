import API from '@/api/didPilot';
import { useWeb5 } from '@/hooks/useWeb5';
import { DidReview } from '@/types/types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Review, Reviews } from '..';
import { Row, Spinner } from 'react-bootstrap';

function SearchBar() {
  const {web5, userDid} = useWeb5();
  const [queryDid, setQueryDid] = useState<string>("");
  const [reviews, setReviews] = useState<DidReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    console.log("searching for: ", queryDid)
    if (web5) {
      setSearched(true);
      setLoading(true);
      const { parsedRecords } = await API.queryRecordsDWN(
        web5,
        {
          message: {
            filter: {
              recipient: queryDid,
            }
          }
        }
      );
      console.log("search results: ", parsedRecords);
      if (parsedRecords)
        setReviews(parsedRecords);
      setLoading(false);
    } 
  }

  return (
    <>
        <Stack gap={2}>
            <Form.Group controlId="searchForm">
                <Form.Control type="text" placeholder="Insert a did" className="me-auto" onChange={(e) => {setQueryDid(e.target.value); setSearched(false);}}/>
                <Form.Text id="searchHelpBlock" muted>
                    Search for the reviews and stats of the inserted did.
                </Form.Text>
            </Form.Group>
            <Button variant="dark" onClick={() => handleSearch()}>Search</Button>
        </Stack>
        {  searched ? 
          <> 
            <h4 className='text-center mt-4'>Results:</h4> {/* for {searchedDid}.*/}

            {!loading ?
            <Reviews reviews={reviews} />
            : 
            <Row className="justify-content-center mt-4">
                <Spinner animation="border" variant="warning"/>
            </Row>}
          </>
          :
          null
        } 
        
    </>
  );
}

export default SearchBar;