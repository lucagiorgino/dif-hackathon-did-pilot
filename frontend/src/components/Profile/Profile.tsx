import { useWeb5 } from "@/hooks/useWeb5";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";

export function Profile () {
    const {web5, userDid} = useWeb5();

    return <>
    <OverlayTrigger placement="bottom" overlay={<Tooltip>These are the reviews that I received.</Tooltip>}>
        <h1 className="text-center">Profile</h1>
    </OverlayTrigger>
    </>;
}