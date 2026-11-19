// The release seam (#424): what the tag workflow derives from a `v*` tag.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firefoxUpdates, releaseFor } from '../build/release.js';

// Same shape burlesco-update has always served: one entry, the add-on id
// from the manifest, and the .xpi attached to the tag's GitHub release.
test('firefox.json points Firefox at the tag\'s signed .xpi', () => {
  assert.deepEqual(JSON.parse(firefoxUpdates('v15.0')), {
    addons: {
      'burlesco@burles.co': {
        updates: [{
          version: '15.0',
          update_link:
            'https://github.com/burlesco/burlesco/releases/download/v15.0/burlesco-firefox.xpi',
        }],
      },
    },
  });
});

test('a pre-release\'s firefox.json keeps the label in the link only', () => {
  const [entry] = JSON.parse(firefoxUpdates('v14.99-rc1'))
    .addons['burlesco@burles.co'].updates;
  assert.equal(entry.version, '14.99');
  assert.equal(
    entry.update_link,
    'https://github.com/burlesco/burlesco/releases/download/v14.99-rc1/burlesco-firefox.xpi',
  );
});

test('a v-tag releases its number as the version', () => {
  assert.deepEqual(releaseFor('v15.0'), { version: '15.0', prerelease: false });
});

// The version must still be one AMO signs, so the label stays out of it.
test('a -label after the number makes a pre-release of that version', () => {
  assert.deepEqual(
    releaseFor('v14.99-rc1'),
    { version: '14.99', prerelease: true },
  );
  assert.throws(() => releaseFor('v14.99-'), /tag/);
});

// AMO only signs versions of 1-4 dot-separated numbers without leading zeros.
test('a tag that is not a Firefox version number is refused', () => {
  for (const tag of ['15.0', 'vfoo', 'v15.0.0.0.1', 'v15.01', 'v15.0b1', 'v15.']) {
    assert.throws(() => releaseFor(tag), /tag/, tag);
  }
});
