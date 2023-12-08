# useViewport

Interact with [Miro viewport](https://developers.miro.com/docs/websdk-reference-viewport).

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useViewport, useSelectedItems } from "@mirohq/websdk-react-hooks";

export const UseViewport: React.FC = () => {
  const { status, result, error, set, zoomTo } = useViewport();
  const selected = useSelectedItems();

  if (status === "loading") {
    return <p>Fetching viewport...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  const handleSetViewport = async () => {
    await set({
      viewport: {
        x: 200,
        y: 100,
        width: 1280,
        height: 720,
      },
      padding: {
        top: 100,
        left: 200,
        bottom: 50,
        right: 20,
      },
      animationDurationInMs: 1000,
    });
  };

  const handleZoomTo = async () => {
    if (selected.result.length < 1) {
      return;
    }

    await zoomTo(selected.result);
  };

  if (status === "success") {
    return (
      <div>
        <p>Current viewport:</p>
        <ul>
          <li>
            X and Y: {result?.x} x {result?.y}
          </li>
          <li>
            Size (WxH): {result?.width} x {result?.height}
          </li>
          <li>Zoom level {result?.zoomLevel}</li>
        </ul>
        <button onClick={handleSetViewport}>Set viewport</button>
        <button disabled={selected.result.length < 1} onClick={handleZoomTo}>
          Zoom to selected
        </button>
      </div>
    );
  }
};

const App = () => {
    return (
        <MiroProvider>
            <UseViewport />
        </MiroProvider>
    )
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```