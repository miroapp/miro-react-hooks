# useOnlineUsers

Get [online users](https://developers.miro.com/docs/websdk-reference-board#getonlineusers) in a Miro board.

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useOnlineUsers } from "@mirohq/websdk-react-hooks";

export const UseOnlineUsers: React.FC = () => {
  const { status, result, error } = useOnlineUsers();

  if (status === "loading") {
    return <p>Fetching online users...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return (
      <div>
        <p>Online users</p>
        <ul>
          {result.map((user) => (
            <li key={user.id}>
              #{user.id} - {user.name}
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
            <UseOnlineUsers />
        </MiroProvider>
    )
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
```