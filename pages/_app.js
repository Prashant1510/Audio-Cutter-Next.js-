// pages/_app.js
import '../styles/global.css'; // Import global CSS here
import { MantineProvider, Global } from '@mantine/core';

if (process.env.NODE_ENV === 'production') {
  // Disable all console logs in production
  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {}; // You can also keep error logs if needed, by not disabling this one
}

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Global
        styles={(theme) => ({
          body: {
            backgroundColor: '#0B192C', // Set your desired background color
            margin: 0,
            minHeight: '100vh', // Ensure it covers full height
            color:'white'
          },
        })}
      />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
