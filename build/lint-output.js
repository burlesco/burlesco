// Lints the generated scripts with no-undef. Page code is serialized from
// functions, so a function that used a module variable shows up here as an
// undefined name.
import { ESLint } from 'eslint';
import globals from 'globals';

// What each generated script can see when it runs.
const GLOBALS = {
  userscript: { ...globals.browser, ...globals.greasemonkey, ...globals.jquery },
};

export class OutputLintError extends Error {
  constructor(findings) {
    super(`Generated output fails lint:\n${findings.map(f => `  - ${f}`).join('\n')}`);
    this.name = 'OutputLintError';
    this.findings = findings;
  }
}

// scripts: [{ path, text, target }]
export async function lintOutput(scripts) {
  const findings = [];
  for (const { path, text, target } of scripts) {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: {
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'script',
          globals: GLOBALS[target],
        },
        rules: { 'no-undef': 'error' },
      },
    });
    const [result] = await eslint.lintText(text, { filePath: path });
    for (const m of result.messages) {
      findings.push(`${path}:${m.line}: ${m.message}${lineAt(text, m.line)}`);
    }
  }
  if (findings.length) throw new OutputLintError(findings);
}

const lineAt = (text, n) => {
  const line = text.split('\n')[n - 1];
  return line === undefined ? '' : `\n      ${line.trim()}`;
};
