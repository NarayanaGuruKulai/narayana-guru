// pages/_app.tsx
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import Head from "next/head";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Header from "~/components/Header&Footer/Header";
import Footer from "~/components/Header&Footer/Footer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  return (
    <SessionProvider session={session}>
      <Head>
        <title>BNGSSS Kulai</title>
        <meta
          name="description"
          content="BNGSSS Kulai"
        />
        <link rel="icon" href="" /> {/* Dont forget to replace here */}
        <meta property="og:title" content="BNGSSS Kulai" />
        <meta
          property="og:description"
          content="Brahmashree Narayana Guru Sangha Kulai"
        />
        <meta property="og:url" content="https://bngssskulai.com" />
      </Head>
      <div className="flex flex-col min-h-screen font-roboto">
        <Header />
        <main className="flex-grow bg-black text-white">
          <Toaster position="top-right" reverseOrder={false} />
          <Component {...pageProps} /> {/* Remove extra `}` here */}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
