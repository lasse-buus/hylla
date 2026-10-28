import assert from 'node:assert/strict'

import { readSignedValue, signValue } from '@/lib/signedValue'

assert.equal(readSignedValue('kunde', signValue('kunde', '7')), '7', 'round trip')

const tampered = signValue('kunde', '7').replace(/^7\./, '8.')
assert.equal(readSignedValue('kunde', tampered), null, 'tampered value')

assert.equal(readSignedValue('ordre', signValue('kunde', '7')), null, 'other purpose')

for (const bad of [undefined, '', '7', '7.']) {
  assert.equal(readSignedValue('kunde', bad), null, `malformed ${JSON.stringify(bad)}`)
}

assert.equal(readSignedValue('kunde', signValue('kunde', '12-15.3')), '12-15.3', 'value with a dot')
