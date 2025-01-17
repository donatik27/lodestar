# lodestar-config

[![npm](https://img.shields.io/npm/v/@lodestar/config)](https://www.npmjs.com/package/@lodestar/config)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Eth Consensus Spec v1.4.0](https://img.shields.io/badge/ETH%20consensus--spec-1.4.0-blue)](https://github.com/ethereum/consensus-specs/releases/tag/v1.4.0)
![ES Version](https://img.shields.io/badge/ES-2021-yellow)
![Node Version](https://img.shields.io/badge/node-12.x-green)

> This package is part of [ChainSafe's Lodestar](https://lodestar.chainsafe.io) project

Lodestar defines all [network configuration variables](https://github.com/ethereum/consensus-specs/tree/v1.1.10/configs) defined in the [Ethereum Consensus spec](https://github.com/ethereum/consensus-specs). This tooling may be used to configure testnets, ingest mainnet/testnet config variables, or be used in downstream Lodestar libraries.

## Installation

```sh
npm install @lodestar/config
```

## Usage

The Lodestar config package contains several interfaces used in downstream Lodestar libraries:

- `ChainConfig` - Typescript interface, Default (mainnet) values, and matching SSZ helper type object
- `ForkConfig` - A fork helper object that's structured around the fork schedule
- `ChainForkConfig` A wrapper object that implements `ChainConfig` and `ForkConfig`
- `CachedGenesis` - A helper object for caching domains (which relies on the genesis validators root)
- `BeaconConfig` - A wrapper object that implements all above interfaces

### Chain config

The Ethereum consensus spec defines a bunch of variables that may be easily configured per testnet. These include the `GENESIS_TIME`, `SECONDS_PER_SLOT`, and various `*_FORK_EPOCH`s, `*_FORK_VERSION`s, etc. The Lodestar config package exports the `ChainConfig` interface and matching `ChainConfig` SSZ type, which include all of these variables, named verbatim from the spec.

```typescript
import {ChainConfig} from "@lodestar/config";
import {chainConfig} from "@lodestar/config/default";

let config: ChainConfig = chainConfig;
const x: number = config.SECONDS_PER_SLOT;
```

Mainnet default values are available as a singleton `ChainConfig` under the `default` import path.

```typescript
import {chainConfig} from "@lodestar/config/default";

chainConfig.SECONDS_PER_SLOT === 12;
```

There are also utility functions to help create a `ChainConfig` from unknown input and partial configs.

```typescript
import {createChainConfig, ChainConfig, chainConfigFromJson} from "@lodestar/config";

// example config
let chainConfigObj: Record<string, unknown> = {
  // phase0
  MIN_PER_EPOCH_CHURN_LIMIT: 4,
  CHURN_LIMIT_QUOTIENT: 65536,
  MIN_GENESIS_ACTIVE_VALIDATOR_COUNT: 128,
  MIN_GENESIS_TIME: 1621504614,
  ETH1_FOLLOW_DISTANCE: 2048,
  SECONDS_PER_ETH1_BLOCK: 14,
  DEPOSIT_CHAIN_ID: 5,
  DEPOSIT_NETWORK_ID: 5,
  DEPOSIT_CONTRACT_ADDRESS: "0x2cc88381fe23027743c1f85512bffb383acca7c7",
  EJECTION_BALANCE: 16000000000,
  GENESIS_FORK_VERSION: "0x00004811",
  GENESIS_DELAY: 1100642,
  SECONDS_PER_SLOT: 12,
  MIN_VALIDATOR_WITHDRAWABILITY_DELAY: 256,
  SHARD_COMMITTEE_PERIOD: 256,

  // altair
  INACTIVITY_SCORE_BIAS: 4,
  INACTIVITY_SCORE_RECOVERY_RATE: 16,
  ALTAIR_FORK_VERSION: "0x01004811",
  ALTAIR_FORK_EPOCH: 10,
};

const partialChainConfig: Partial<ChainConfig> = chainConfigFromJson(chainConfigObj);

// Fill in the missing values with mainnet default values
const chainConfig: ChainConfig = createChainConfig(partialChainConfig);
```

### Fork config

The variables described in the spec can be used to assemble a more structured 'fork schedule'. This info is organized as `ForkConfig` in the Lodestar config package. In practice, the `ChainConfig` and `ForkConfig` are usually combined as a `ChainForkConfig`.

A `ForkConfig` provides methods to select the fork info, fork name, fork version, or fork ssz types given a slot.

```typescript
import {GENESIS_SLOT} from "@lodestar/params";
import {createChainForkConfig, ChainForkConfig} from "@lodestar/config";
import {config as chainConfig} from "@lodestar/config/default";

const config: ChainForkConfig = createChainForkConfig(chainConfig);

const version = config.getForkVersion(GENESIS_SLOT);
```

### Cached genesis

For signing Ethereum consensus objects, a cryptographic "domain" is computed and mixed into the signed message. This domain separates signatures made for the Ethereum mainnet from testnets or other instances of the chain. The `CachedGenesis` interface is used to provide a cache for this purpose. Practically, the domain rarely changes, only per-fork, and so the value can be easily cached. Since the genesis validators root is part of the domain, it is required input to instantiate an `CachedGenesis`. In practice, the `ChainForkConfig` and `CachedGenesis` are usually combined as a `BeaconConfig`. This is the 'highest level' object exported by the Lodestar config library.

```typescript
import {DOMAIN_DEPOSIT, GENESIS_SLOT} from "@lodestar/params";
import {createBeaconConfig, BeaconConfig} from "@lodestar/config";
import {config as chainConfig} from "@lodestar/config/default";

// dummy test root
let genesisValidatorsRoot: Uint8Array = new Uint8Array();

const config: BeaconConfig = createBeaconConfig(chainConfig, genesisValidatorsRoot);
```

## License

Apache-2.0 [ChainSafe Systems](https://chainsafe.io)
