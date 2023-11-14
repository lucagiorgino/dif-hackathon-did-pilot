import { useWeb5 } from "@/hooks/useWeb5";
import SearchBar from "./SearchBar";

export function Home () {

    const {web5, userDid} = useWeb5();

    return <>
        <h1 className="text-center">Home</h1>
        <SearchBar/>
    </>;
}