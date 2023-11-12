import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";

export function Profile () {
    return <>
    <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews that I received.</Tooltip>}>
        <h1 className="text-center">Profile</h1>
    </OverlayTrigger>
    </>;
}