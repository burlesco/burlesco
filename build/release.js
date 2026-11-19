// What a release tag means (#424): the version both Targets ship with, and
// the `firefox.json` that `burlesco-update` serves to Firefox installs.

// AMO signs only 1-4 dot-separated numbers, each without leading zeros.
// A `-label` suffix (v15.0-rc1) marks a GitHub pre-release; the version is
// the number before it.
const TAG = /^v((?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*)){0,3})(-[\w.]+)?$/;

export function releaseFor(tag) {
  const found = TAG.exec(tag);
  if (!found) {
    throw new Error(`tag ${tag} is not v<version>[-label], e.g. v15.0`);
  }
  return { version: found[1], prerelease: Boolean(found[2]) };
}

// The signed extension's asset name on the release.
const XPI = 'burlesco-firefox.xpi';
const ADDON_ID = 'burlesco@burles.co';
const RELEASES = 'https://github.com/burlesco/burlesco/releases/download';

// The whole `firefox.json`: one entry, the release this tag creates.
export function firefoxUpdates(tag) {
  const { version } = releaseFor(tag);
  const update = {
    version,
    update_link: `${RELEASES}/${tag}/${XPI}`,
  };
  const json = { addons: { [ADDON_ID]: { updates: [update] } } };
  return JSON.stringify(json, null, 2) + '\n';
}
