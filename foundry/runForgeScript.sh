#!/bin/bash

source .env && forge script $1 --rpc-url $TESTNET_RPC_URL "${@:2}"
