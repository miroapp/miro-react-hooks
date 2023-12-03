# miro-websdk-react-hooks [![NPM version](https://img.shields.io/npm/v/@mirohq/websdk-types.svg)](https://www.npmjs.com/package/@mirohq/websdk-types)

Collection of [React hooks](https://legacy.reactjs.org/docs/hooks-intro.html) to interact with [Miro Platform WebSDK](https://developers.miro.com/docs/miro-web-sdk-introduction).

## Use it!

```bash
$ npm install @mirohq/websdk-react-hooks
// or
$ yarn add @mirohq/websdk-react-hooks
```

### Inject Miro instance

Wrap your components with [MiroProvider](<(./src/context.tsx)>) and inject the global instance of Miro WebSDK.

```tsx
import { MiroProvider } from "@mirohq/websdk-react-hooks";

const App: React.FC = ({ children }) => <MiroProvider miro={window.miro}>{children}</MiroProvider>;
```

Make sure you have a [Miro application](https://developers.miro.com/docs/build-your-first-hello-world-app) configured to use it:

## Hooks

- [useMiro](./src/useMiro/useMiro.md) - Access Miro SDK reference from React Context.
- [useCurrentUser](./src/useCurrentUser/useCurrentUser.md) - Get current [Miro user](https://developers.miro.com/docs/websdk-reference-board#getuserinfo).
- [useInfo](./src/useInfo/useInfo.md) - Get [Miro board info](https://developers.miro.com/docs/websdk-reference-board#getinfo).
- [useOnlineUsers](./src/useOnlineUsers/useOnlineUsers.md) - Get [online users](https://developers.miro.com/docs/websdk-reference-board#getonlineusers) in a Miro board.
- [useSelectedItems](./src/useSelectedItems/useSelectedItems.md) - List [selected items](https://developers.miro.com/docs/websdk-reference-board#getselection) with possible predicate filter.
- [useStorage](./src/useStorage/useStorage.md) - Interact with [Miro storage](https://developers.miro.com/docs/websdk-reference-storage).
- [useViewport](./src/useViewport/useViewport.md) - Interact with [Miro viewport](https://developers.miro.com/docs/websdk-reference-viewport).

## Built with

- [Miro Platform WebSDK](https://developers.miro.com/docs/miro-web-sdk-introduction)
- [React](https://react.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [React testing library](https://testing-library.com/docs/react-testing-library/intro/)

## Contributing

Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) guide to get started.
