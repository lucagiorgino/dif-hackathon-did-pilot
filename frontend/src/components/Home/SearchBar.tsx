import { useWeb5 } from '@/hooks/useWeb5';
import { DidReview } from '@/types/types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Review, Reviews } from '..';
import { Row, Spinner } from 'react-bootstrap';
import didPilotReviewAPI, {DidStats} from '@/api/didPilotReview';

function SearchBar() {
  const {web5} = useWeb5();
  const [queryDid, setQueryDid] = useState<string>("");
  const [reviews, setReviews] = useState<DidReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [stats, setStats] = useState<DidStats | undefined>(undefined); // TODO use stats

  const handleSearch = async () => {
    console.log("Searching for: ", queryDid)
    if (web5) {
      setSearched(true);
      setLoading(true);

      const { reviews } = await didPilotReviewAPI.getReviewsByRecipient(web5, queryDid);
      const stats = await didPilotReviewAPI.getDidStats(web5, queryDid);
      
      console.log("Results: ", reviews);
      
      setStats(stats);
      setReviews(reviews);
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