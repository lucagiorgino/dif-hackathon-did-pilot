import { Link } from "react-router-dom";

export function Landing () {
    return <>
    <div className="shadow p-3 bg-body rounded position-absolute top-50 start-50 translate-middle">
        <h1 className="display-3">
        Welcome to <strong>DID Pilot!</strong><br/>
        </h1>
        <p className="lead text-justify">
        When you need to know if a service is safe what do you do on internet? Well, you simply search for reviews on <mark className="bg-success bg-opacity-10 text-success"><strong>TrustPilot</strong></mark>, right? 
        So, why not apply the same approach to <mark className="bg-primary bg-opacity-10 text-primary"><strong>Decentralized Identifiers</strong></mark>?
        </p>

        <hr className="my-4"/>

        <p><strong>DIF work items</strong> used in the project: Decentralized Web Nodes, Trust Establishment.<br/>
        <strong>Authors</strong>: 
            <Link className="text-body-secondary text-decoration-none" target="_blank" to={`https://github.com/lucagiorgino`}> Luca Giorgino</Link>,
            <Link className="text-body-secondary text-decoration-none" target="_blank" to={`https://github.com/mmatteo23`}> Matteo Midena</Link>
        </p>
        <h4>    
            <Link className="text-decoration-none" target="_blank" to={`https://github.com/lucagiorgino/dif-hackathon-frontend`}>
                <i className="bi bi-github me-2"/>GitHub repository
            </Link> 
        </h4>
    </div>
    
    </>;
}