import { TezosToolkit } from "@taquito/taquito";
import { wallet } from "./wallet";
export const tezos = new TezosToolkit("https://ghostnet.ecadinfra.com");


tezos.setWalletProvider(wallet)
