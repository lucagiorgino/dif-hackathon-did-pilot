import API from '@/api/didPilot';
import { useWeb5 } from '@/hooks/useWeb5';
import { DidReview } from '@/types/types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { Review } from '..';

function SearchBar() {
  const {web5, userDid} = useWeb5();
  const [searchedDid, setSearchedDid] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DidReview[] | undefined>(undefined);

  const handleSearch = async () => {
    console.log("searching for: ", searchedDid)
    if (web5) {
      const { parsedRecords } = await API.queryRecordsDWN(
        web5,
        {
          message: {
            filter: {
              recipient: searchedDid,
            }
          }
        }
      )
      console.log("search results: ", parsedRecords)
      if (parsedRecords)
        setSearchResults(parsedRecords)
    } 
  }

  return (
    <>
        <Stack gap={2}>
            <Form.Group controlId="searchForm">
                <Form.Control type="text" placeholder="Insert a did" className="me-auto" onChange={(e) => {setSearchedDid(e.target.value)}}/>
                <Form.Text id="searchHelpBlock" muted>
                    Search for the reviews and stats of the inserted did.
                </Form.Text>
            </Form.Group>
            <Button variant="dark" onClick={() => handleSearch()}>Search</Button>
        </Stack>
        <h2>Search results:</h2>
        <Stack gap={2}>
          {
            searchResults && searchResults.length > 0 ?
              searchResults.map((review, index) => {
                return (
                  <Review 
                    key={index} 
                    didSubject={review.subjectDid}
                    stars={review.stars}
                    description={review.description}
                  />
                )
              })
            :
              searchResults == undefined ? 
                null    
              :
                <>No reviews found for {searchedDid}. Write you the first review!</>
          }
        </Stack>
    </>
  );
}

export default SearchBar;