import Head from "next/head";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>Gonna Make It: Home</title>
        <meta name="description" content="Gonna Make It" />
        <link rel="manifest" href="nextjs-frontend\public\site.webmanifest" />
        <meta name="theme-color" content="#001529"/>
      </Head>
    </>
  );
};

export const getServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/dashboard',
      permanent: false, // This can be set to true if you want a permanent redirect (HTTP 301)
    },
  };
};

export default HomePage;
