import '../styles/global.css';
import { MantineProvider, Global } from '@mantine/core';

if (process.env.NODE_ENV === 'production') {
  // Disable all console logs in production
  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {}; 
}

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Global
        styles={(theme) => ({
          body: {
            backgroundColor: '#0B192C',
            margin: 0,
            minHeight: '100vh', 
            color:'white'
          },
        })}
      />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
