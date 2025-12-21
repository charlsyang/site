import GlobalStyles from "../components/GlobalStyles";
import { StyleSheetManager } from "styled-components";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.noLayout
    ? (page) => page
    : (page) => <Layout>{page}</Layout>;

  return (
    <StyleSheetManager enableVendorPrefixes>
      {getLayout(
        <>
          <GlobalStyles />
          <ThemeProvider forcedTheme={Component.theme || null}>
            <Component {...pageProps} />
          </ThemeProvider>
        </>
      )}
    </StyleSheetManager>
  );
}

export default MyApp;
