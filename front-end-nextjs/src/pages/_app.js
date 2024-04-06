import React, {useMemo} from "react";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { AuthContextProvider } from "../context/authContext";
import Navbar from "@/components/navBar/Navbar";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import fr from 'javascript-time-ago/locale/fr'


require("@solana/wallet-adapter-react-ui/styles.css");

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(fr)

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function MyApp({ Component, pageProps }) {

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      {/* <WalletProvider wallets={wallets} autoConnect> */}
      <WalletProvider wallets={wallets} >
        <WalletModalProvider>
          <AuthContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
