# useStorage

Interact with [Miro storage](https://developers.miro.com/docs/websdk-reference-storage).

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useStorage } from "@mirohq/websdk-react-hooks";

export const UseStorage: React.FC = () => {
  const { status, result, error, set, remove } = useStorage("react-hooks", "example");

  if (status === "loading") {
    return <p>Fetching values...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  const handleSetValue = async () => {
    await set("Just changed from the app");
  };

  const handleRemoveValue = async () => {
    await remove();
  };

  if (status === "success") {
    return (
      <div>
        <p>Current value:</p>
        <pre>{JSON.stringify(result, null, 2)}</pre>
        <button onClick={handleSetValue}>Set value</button>
        <button disabled={!result} onClick={handleRemoveValue}>
          Remove value
        </button>
      </div>
    );
  }
};

const App = () => {
    return (
        <MiroProvider>
            <UseSelectedItems />
        </MiroProvider>
    )
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```