# useInfo

Get [Miro board info](https://developers.miro.com/docs/websdk-reference-board#getinfo).

# useCurrentUser

Get current [Miro user](https://developers.miro.com/docs/websdk-reference-board#getuserinfo).

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useInfo } from "@mirohq/websdk-react-hooks";

export const UseInfo: React.FC = () => {
  const { status, error, result } = useInfo();

  if (status === "loading") {
    return <p>Fetching board info...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return (
      <div>
        <p>Current board info</p>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  }
};

const App = () => {
    return (
        <MiroProvider>
            <UseInfo />
        </MiroProvider>
    )
};


const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```