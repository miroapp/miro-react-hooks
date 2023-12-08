# useSelectedItems

List [selected items](https://developers.miro.com/docs/websdk-reference-board#getselection) with possible predicate filter.

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useSelectedItems } from "@mirohq/websdk-react-hooks";

export const UseSelectedItems: React.FC = () => {
  const { status, result, error } = useSelectedItems();

  if (status === "loading") {
    return <p>Fetching selected items...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return (
      <div>
        <p>Selected items:</p>
        <ul>
          {result.map((item) => (
            <li key={item.id}>
              #{item.id} - {item.type}
            </li>
          ))}
        </ul>
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