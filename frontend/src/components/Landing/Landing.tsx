import { Link } from "react-router-dom";

export function Landing () {
    return <>
    <h1 className="mt-5">
    Welcome to <i className="bi bi-bookmark-star-fill me-2"/><strong>DIDPilot!</strong><br/>
    </h1>
    <h3 className="text-body-secondary">
    When you need to know if a site is safe what do you do on internet?<br/>
    Well, you simply search for reviews on <span className="text-success">TrustPilot</span> right?<br/>
    So why don't do the same thing with DIDs?<br/><br/>
    </h3>
    <h4>    <Link target="_blank" to={`https://github.com/lucagiorgino/dif-hackathon-frontend`}  style={{ textDecoration: 'none' }}><i className="bi bi-github me-2"/>GitHub repository</Link> </h4>

    
    
    
    </>;
}