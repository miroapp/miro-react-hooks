import fs from "node:fs/promises";
import path from "node:path";

const run = async () => {
  const scriptPath = process.argv[1].trim();
  const hookName = process.argv[2]?.trim();

  if (!hookName || hookName.length === 0) {
    throw new TypeError("hook name not defined");
  }

  const srcDir = path.resolve(scriptPath, "../../src");
  const hookDir = path.join(srcDir, hookName);

  if (
    await fs
      .lstat(hookDir)
      .then(() => true)
      .catch(() => false)
  ) {
    throw new TypeError(`directory for hook ${hookName} already exists`);
  }

  // Updates entrypoint
  await fs.appendFile(path.join(srcDir, "index.ts"), `\nexport * from "./${hookName}";`);

  // Creates hook folder
  await fs.mkdir(hookDir);

  // Entrypoint
  await fs.writeFile(path.resolve(hookDir, `index.ts`), `export * from "./${hookName}";\n`);

  // Main hook file
  await fs.writeFile(
    path.resolve(hookDir, `${hookName}.ts`),
    `import { useMiro } from "../useMiro";
/**
 * Do something cool
 */
export const ${hookName} = () => {
  const miro = useMiro();

  // Now it's with you
};

`,
  );

  // Test file
  await fs.writeFile(
    path.resolve(hookDir, `${hookName}.test.tsx`),
    `import { renderHook } from "@testing-library/react-hooks";

import { ${hookName} } from "./${hookName}";
import { miro, wrapper } from "../test-utils";

describe("${hookName}", () => {
  it("throws error when Miro SDK instance is not found in the context", () => {
    const { result } = renderHook(() => ${hookName}());
    expect(result.error).toEqual(Error("Miro instance needs to be injected with MiroProvider"));
  });

  it.todo("implement me")
});
`,
  );

  // Docs fole
  await fs.writeFile(
    path.resolve(hookDir, `${hookName}.md`),
    `# ${hookName}

Your description here

**Note**: Make sure you are running this code in a configured [Miro WebSDK app](https://developers.miro.com/docs/build-your-first-hello-world-app). 

## Example

\`\`\`tsx
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ${hookName} } from "@mirohq/websdk-react-hooks";

export const ${hookName}: React.FC = () => {
  const miro = ${hookName}();

  // Add code sample
};

const App = () => {
    return (
        <MiroProvider>
            <${hookName} />
        </MiroProvider>
    )
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
\`\`\``,
  );

  // Updates entrypoint
  await fs.appendFile(
    path.join(scriptPath, "../../README.md"),
    `\n- [${hookName}](https://github.com/miroapp/miro-react-hooks/tree/main/src/${hookName}/${hookName}.md) - Say something abour your hook here.;\n`,
  );
};

run();
