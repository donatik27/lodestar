import {IBeaconConfig} from "@chainsafe/eth2.0-config";
import {BLSPubkey, Epoch, ValidatorDuty, ValidatorIndex} from "@chainsafe/eth2.0-types";
import {getCommitteeAssignment} from "../../stateTransition/util";

export function assembleValidatorDuty(
  config: IBeaconConfig,
  validator: {publicKey: BLSPubkey; index: ValidatorIndex},
  state,
  epoch: Epoch,
  blockProposerIndex: ValidatorIndex): ValidatorDuty  {
  let duty: ValidatorDuty = generateEmptyValidatorDuty(validator.publicKey);
  const committeeAssignment = getCommitteeAssignment(
    config,
    state,
    epoch,
    validator.index
  );
  if (committeeAssignment) {
    duty = {
      ...duty,
      attestationShard: committeeAssignment.shard,
      attestationSlot: committeeAssignment.slot,
      committeeIndex: committeeAssignment.validators.indexOf(validator.index)
    };
  }
  if (validator.index === blockProposerIndex) {
    duty = {
      ...duty,
      blockProposalSlot: state.slot
    };
  }
  return duty;
}

export function generateEmptyValidatorDuty(publicKey: BLSPubkey, duty?: Partial<ValidatorDuty>): ValidatorDuty {
  return {
    validatorPubkey: publicKey,
    blockProposalSlot: null,
    attestationShard: null,
    attestationSlot: null,
    committeeIndex: null,
    ...duty
  };
}