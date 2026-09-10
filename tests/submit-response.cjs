const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
async function scenario(result, networkError = false, httpStatus = 200) {
  const elements = {};
  let submit, resets = 0, requests = 0;
  const get = id => elements[id] ||= { value: '', style: {}, append() {}, replaceChildren() {},
    addEventListener: (name, fn) => { if (id === '#attendanceForm' && name === 'submit') submit = fn; },
    querySelector: () => get('button'), reset: () => resets++,
  };
  const storage = new Map();
  const context = vm.createContext({ localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) }, crypto: require('node:crypto').webcrypto, document: { querySelector: get, createElement: () => ({}) },
    fetch: async (_, options) => {
      requests++;
      assert.equal(options.mode, 'cors');
      if (networkError) throw Error('Network failed');
      return { ok: httpStatus === 200, status: httpStatus, json: async () => { if (result === 'html') throw new SyntaxError('HTML'); return result; } };
    },
  });
  vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);
  vm.runInContext('participantTypeSelect.value="umum"; handleParticipantTypeChange(); umumNameSelect.value="2410432045"; handleGeneralParticipantChange(); emailInput.value="test@example.com";', context);
  await submit({ preventDefault() {} });
  assert.equal(get('button').disabled, storage.get('semkwu26.submitted') === '1');
  if (storage.get('semkwu26.submitted') === '1') {
    const previousRequests = requests;
    await submit({ preventDefault() {} });
    assert.equal(requests, previousRequests);
    vm.runInContext(fs.readFileSync('script.js', 'utf8'), vm.createContext({
      document: { querySelector: get, createElement: () => ({}) },
      localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v) },
    }));
    assert.equal(get('button').disabled, true);
  }
  return { storage, resets, status: get('#formStatus') };
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
  const blocked = await scenario({ok:false,code:'DEVICE_ALREADY_SUBMITTED',message:'Already sent'});
  assert.equal(blocked.storage.get('semkwu26.submitted'), '1');
  assert.equal(blocked.resets, 0);
  for (const code of [401, 403, 404, 429, 500, 503]) {
    const outcome = await scenario(null, false, code);
    assert.equal(outcome.resets, 0);
    assert.ok(outcome.status.textContent.includes(`HTTP ${code}`));
  }
  for (const body of [null, 'html']) {
    const outcome = await scenario(body);
    assert.equal(outcome.resets, 0);
    assert.ok(outcome.status.className.includes('is-error'));
  }
  console.log('PASS: only confirmed backend outcomes reset form; server/network/version errors retain input.');
})().catch(error => { console.error(error); process.exitCode = 1; });
