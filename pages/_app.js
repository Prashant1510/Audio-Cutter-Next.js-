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
          'html, body': {
            backgroundColor: '#0B192C',
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            color: 'white',
            backgroundImage: 'url(https://images.unsplash.com/photo-1607499699372-7bb722dff7e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat',
            overflow: 'auto', // Ensures content can still scroll
            scrollbarWidth: 'none', // Hides scrollbar in Firefox
            '-ms-overflow-style': 'none', // Hides scrollbar in Internet Explorer and Edge
          },

          /* Hide scrollbar for Webkit browsers (Chrome, Safari) */
          'html::-webkit-scrollbar, body::-webkit-scrollbar': {
            display: 'none',
          },
        })}
      />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
