import {toHexString} from "@chainsafe/ssz";
import {BeaconStateAllForks} from "@lodestar/state-transition";
import {BLSPubkey, ValidatorIndex, ssz} from "@lodestar/types";
import {beforeAll, describe, expect, it} from "vitest";
import {getPubkeysForIndices} from "../../../../../src/api/impl/validator/utils.js";

describe("api / impl / validator / utils", () => {
  const vc = 32;

  const pubkeys: BLSPubkey[] = [];
  const indexes: ValidatorIndex[] = [];
  let state: BeaconStateAllForks;
  beforeAll(() => {
    state = ssz.phase0.BeaconState.defaultViewDU();
    const validator = ssz.phase0.Validator.defaultValue();
    const validators = state.validators;
    for (let i = 0; i < vc; i++) {
      indexes.push(i);
      const pubkey = Buffer.alloc(48, i);
      pubkeys.push(pubkey);
      validators.push(ssz.phase0.Validator.toViewDU({...validator, pubkey}));
    }
  });

  it("getPubkeysForIndices", () => {
    const pubkeysRes = getPubkeysForIndices(state.validators, indexes);
    expect(pubkeysRes.map(toHexString)).toEqual(pubkeys.map(toHexString));
  });
});
