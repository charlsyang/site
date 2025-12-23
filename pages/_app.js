import { useRouter } from "next/router";
import GlobalStyles from "../components/GlobalStyles";
import { StyleSheetManager } from "styled-components";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "motion/react";
import Layout from "../components/Layout";
import WorkLayout from "../components/WorkLayout";
import PageTransition, {
  TransitionProvider,
} from "../components/PageTransition";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isWorkPage = router.pathname.startsWith("/work");

  // Work pages get the persistent sidebar layout
  if (isWorkPage) {
    return (
      <StyleSheetManager enableVendorPrefixes>
        <GlobalStyles />
        <ThemeProvider forcedTheme={Component.theme || null}>
          <TransitionProvider>
            <WorkLayout allPostsData={pageProps.allPostsData}>
              <AnimatePresence initial={false}>
                <PageTransition key={router.asPath}>
                  <Component {...pageProps} />
                </PageTransition>
              </AnimatePresence>
            </WorkLayout>
          </TransitionProvider>
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
