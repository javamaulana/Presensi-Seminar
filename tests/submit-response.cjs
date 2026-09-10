const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
async function scenario(result, networkError = false) {
  const elements = {};
  let submit, resets = 0;
  const get = id => elements[id] ||= { value: '', style: {}, append() {}, replaceChildren() {},
    addEventListener: (name, fn) => { if (id === '#attendanceForm' && name === 'submit') submit = fn; },
    querySelector: () => get('button'), reset: () => resets++,
  };
  const context = vm.createContext({ document: { querySelector: get, createElement: () => ({}) },
    fetch: async (_, options) => {
      assert.equal(options.mode, 'cors');
      if (networkError) throw Error('Network failed');
      return { ok: true, json: async () => result };
    },
  });
  vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);
  vm.runInContext('participantTypeSelect.value="umum"; handleParticipantTypeChange(); umumNameSelect.value="2410432045"; handleGeneralParticipantChange(); emailInput.value="test@example.com";', context);
  await submit({ preventDefault() {} });
  assert.equal(get('button').disabled, false);
  return { resets, status: get('#formStatus') };
}
(async () => {
  for (const status of ['sent', 'pending', 'pending_error', 'review']) {
    assert.equal((await scenario({ ok: true, status })).resets, 1);
  }
  for (const result of [{ ok: false, message: 'Save failed' }, { ok: true }]) {
    const outcome = await scenario(result);
    assert.equal(outcome.resets, 0);
    assert.ok(outcome.status.className.includes('is-error'));
  }
  assert.equal((await scenario(null, true)).resets, 0);
  console.log('PASS: only confirmed backend outcomes reset form; server/network/version errors retain input.');
})().catch(error => { console.error(error); process.exitCode = 1; });
