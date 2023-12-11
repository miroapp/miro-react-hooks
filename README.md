# miro-websdk-react-hooks [![NPM version](https://img.shields.io/npm/v/@mirohq/websdk-react-hooks.svg)](https://www.npmjs.com/package/@mirohq/websdk-react-hooks)

Collection of [React hooks](https://legacy.reactjs.org/docs/hooks-intro.html) to interact with [Miro Platform WebSDK](https://developers.miro.com/docs/miro-web-sdk-introduction).

Add a bit of :sparkles:reactivity:sparkles: to your Miro app.

## Use it!

```bash
$ npm install @mirohq/websdk-react-hooks
// or
$ yarn add @mirohq/websdk-react-hooks
```

### Inject Miro instance

Wrap your components with [MiroProvider](<(https://github.com/miroapp/miro-react-hooks/tree/main/src/context.tsx)>) and inject the global instance of Miro WebSDK.

```tsx
import { MiroProvider } from "@mirohq/websdk-react-hooks";

const App: React.FC = ({ children }) => <MiroProvider>{children}</MiroProvider>;

/*
 You can also optional inject the global Miro WebSDK instance
 
 const App: React.FC = ({ children }) => <MiroProvider miro={window.miro}>{children}</MiroProvider>;
*/
```

Make sure you have a [Miro application](https://developers.miro.com/docs/build-your-first-hello-world-app) configured to use it. The hooks in this library will only work within Miro boards and in a well-configured app.

### Isomorphic or not?

The [Miro WebSDK](https://developers.miro.com/docs/miro-web-sdk-introduction) is **NOT** isomorphic, meaning that you cannot use it in both server and client environments. This also applies to this library, it won't work wehn you are rendereing your React components in the server.

### What if I am using Nextjs?

#### Using app router
Just make sure that the component that uses the hooks is only rendered on the client by using the `use client` directive on top of your component.
```tsx
'use client'
import { useCurrentUser } from "@mirohq/websdk-react-hooks";

// Your component
```


#### Using pages router
Wrap your component in a dynamic code block that will defer the component rendering to only execute in the client-side:

```tsx
import dynamic from "next/dynamic";
import React from "react";
import { useCurrentUser } from "@mirohq/websdk-react-hooks";

const NoSsr: React.FC<React.PropsWithChildren> = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

const NoSSRWrapper = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});

// And in your Nextjs page

const Component: React.FC = () => {
    const { status, result, error } = useCurrentUser();

    if (status === "success") {
        return <p>The current user is "{result?.name}"</p>;
    }
}

export default function OnlyInTheClient() {
  return (
    <NoSSRWrapper>
      <Group />
    </NoSSRWrapper>
  );
}

```

## Built with

- [Miro Platform WebSDK](https://developers.miro.com/docs/miro-web-sdk-introduction)
- [React](https://react.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [React Hookz Web](https://react-hookz.github.io/web/)
- [Jest](https://jestjs.io/)
- [React testing library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Hooks Testing Library](https://github.com/testing-library/react-hooks-testing-library)

> This library is heavily inspired on https://github.com/react-hookz/web. Pure :sparkling_heart: awesomeness :sparkling_heart:.

## Contributing

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started.


## Hooks

- [useMiro](https://github.com/miroapp/miro-react-hooks/tree/main/src/useMiro.md) - Access Miro SDK reference from React Context.
- [useCurrentUser](https://github.com/miroapp/miro-react-hooks/tree/main/src/useCurrentUser/useCurrentUser.md) - Get current [Miro user](https://developers.miro.com/docs/websdk-reference-board#getuserinfo).
- [useInfo](https://github.com/miroapp/miro-react-hooks/tree/main/src/useInfo/useInfo.md) - Get [Miro board info](https://developers.miro.com/docs/websdk-reference-board#getinfo).
- [useOnlineUsers](https://github.com/miroapp/miro-react-hooks/tree/main/src/useOnlineUsers/useOnlineUsers.md) - Get [online users](https://developers.miro.com/docs/websdk-reference-board#getonlineusers) in a Miro board.
- [useSelectedItems](https://github.com/miroapp/miro-react-hooks/tree/main/src/useSelectedItems/useSelectedItems.md) - List [selected items](https://developers.miro.com/docs/websdk-reference-board#getselection) with possible predicate filter.
- [useSession](https://github.com/miroapp/miro-react-hooks/tree/main/src/useSession/useSession.md) - Interact with [Miro session](https://developers.miro.com/docs/websdk-reference-session).
- [useStorage](https://github.com/miroapp/miro-react-hooks/tree/main/src/useStorage/useStorage.md) - Interact with [Miro storage](https://developers.miro.com/docs/websdk-reference-storage).
- [useViewport](https://github.com/miroapp/miro-react-hooks/tree/main/src/useViewport/useViewport.md) - Interact with [Miro viewport](https://developers.miro.com/docs/websdk-reference-viewport).
