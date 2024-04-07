import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import  "@solana/web3.js";

const umi = createUmi('https://api.devnet.solana.com'); //Replace with your QuickNode RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array([195,17,145,124,85,36,5,73,119,63,217,63,29,177,217,30,146,246,250,224,24,232,106,224,57,106,178,63,49,53,253,6,173,173,135,132,89,250,244,3,211,2,105,92,35,146,255,71,114,106,194,44,10,210,127,47,234,241,18,81,157,32,251,178]));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
    name: "Skolana Token ",
    symbol: "SKT",
    uri: "https://v2.akord.com/public/vaults/active/7yhmSfqysWrZAEdd_B3EzQtMNy9fqBsjpXK57DqV7d4/gallery#ac1646a1-9fc1-4484-82d0-80347e1eb516",
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    amount: 1000000000_000000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi).then(() => {
    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
});
