import { useWeb5 } from '@/hooks/useWeb5';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Reviews } from '..';
import { Row, Spinner } from 'react-bootstrap';
import { Stats } from './Stats';
import { ReviewTuple } from '@/types/types';
import didPilotTEDReviewAPI, { DidStats } from '@/api/didPilotTEDReview';

function SearchBar() {
  const {web5} = useWeb5();

  const [queryDid, setQueryDid] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewTuple[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [stats, setStats] = useState<DidStats | undefined>(undefined);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Searching for: ", queryDid)
    if (web5) {
      setSearched(true);
      setLoading(true);

      const { teds: tedReviews } = await didPilotTEDReviewAPI.getTEDReviewsByRecipient(web5, queryDid);
      const stats = await didPilotTEDReviewAPI.getDidStats(web5, queryDid);

      console.log("Results: ", tedReviews);
      console.log("Stats: ", stats);
      
      const reviews: ReviewTuple[] = [];
      for(const tedReview of tedReviews) {
          const r = didPilotTEDReviewAPI.extractReviewFromTED(tedReview, queryDid);
          if (r) {
              reviews.push({ted: tedReview, review: r});
          } else {
              console.log("Err", r);
          }
      }

      setStats(stats);
      setReviews(reviews);
      setLoading(false);
    } 
  }

  return (
    <>
      <Form onSubmit={handleSearch}>
        <Stack gap={2}>
            <Form.Group controlId="searchForm">
                <Form.Control type="text" placeholder="Insert a did" className="me-auto" onChange={(e) => {setQueryDid(e.target.value); setSearched(false);}} required/>
                <Form.Text id="searchHelpBlock" muted>
                    Search for the reviews and stats of the inserted did.
                </Form.Text>
            </Form.Group>
            <Button variant="dark" type="submit">Search</Button>
        </Stack>
      </Form>

        { searched ? 
            <> 
              <h4 className='text-center mt-4'>Results:</h4> {/* for {searchedDid}.*/}

              {!loading ?
              <>
                {reviews.length > 0 ? <Stats stats={stats}/> : <></>}
                <Reviews reviews={reviews} />
              </>
              : 
              <Row className="justify-content-center mt-4">
                  <Spinner animation="border" variant="warning"/>
              </Row>}
            </>
          :
          <></>
        } 
        
    </>
  );
}

export default SearchBar;