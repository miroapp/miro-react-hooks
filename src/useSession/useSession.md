# useSession

Interact with [Miro collaborative sessions](https://developers.miro.com/docs/websdk-reference-session).

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example


```tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { useSession } from "@mirohq/websdk-react-hooks";

export const UseSession: React.FC = () => {
  const { status, session, start, usersInSession, usersNotInSession } = useSession();

  const handleStartSession = async () => {
    await start({
      name: "Test session",
    });
  };

  const handleInviteUser = async (user: OnlineUserInfo) => {
    await session?.invite(user);
  };

  return (
    <div>
      <h4>Session {status}</h4>
      {session ? (
        <div>
          <p>
            #{session.id} - {session.name}
          </p>
          <ul>
            <li>
              <strong>Users in session</strong>
            </li>
            {usersInSession.map((user) => (
              <li key={user.id}>
                #{user.id} - {user.name}
              </li>
            ))}
          </ul>
          <ul>
            <li>
              <strong>Users not in session</strong>
            </li>
            {usersNotInSession.map((user) => (
              <li key={user.id}>
                #{user.id} - {user.name}
                <button onClick={() => handleInviteUser(user)}>Invite</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={handleStartSession}>Start session</button>
      )}
    </div>
  );
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