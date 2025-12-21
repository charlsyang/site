import { useRouter } from "next/router";
import GlobalStyles from "../components/GlobalStyles";
import { StyleSheetManager } from "styled-components";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import WorkLayout from "../components/WorkLayout";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isWorkPage = router.pathname.startsWith("/work");

  // Work pages get the persistent sidebar layout
  if (isWorkPage) {
    return (
      <StyleSheetManager enableVendorPrefixes>
        <GlobalStyles />
        <ThemeProvider forcedTheme={Component.theme || null}>
          <WorkLayout allPostsData={pageProps.allPostsData}>
            <Component {...pageProps} />
          </WorkLayout>
        </ThemeProvider>
      </StyleSheetManager>
    );
  }

  // All other pages use normal layout
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
