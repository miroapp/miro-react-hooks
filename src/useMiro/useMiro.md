# useMiro

Access Miro SDK reference from React Context.

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useMiro } from "@mirohq/websdk-react-hooks";

export const Miro: React.FC = () => {
  const miro = useMiro();

  return <pre>{JSON.stringify(miro, null, 2)}</pre>;
};

const App = () => {
    return (
        <MiroProvider>
            <Miro />
        </MiroProvider>
    )
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```