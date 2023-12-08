# useCurrentUser

Get current [Miro user](https://developers.miro.com/docs/websdk-reference-board#getuserinfo).

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useCurrentUser } from "@mirohq/websdk-react-hooks";

const CurrentUser: React.FC = () => {
    const { status, result, error } = useCurrentUser();

    if (status === "loading") {
        return <p>Fetching user...</p>;
    }

    if (error) {
        return <p>Something went wrong</p>;
    }

    if (status === "success") {
        return <p>The current user is "{result?.name}"</p>;
    }
}

const App = () => {
    return (
        <MiroProvider>
            <CurrentUser />
        </MiroProvider>
    )
};


const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```