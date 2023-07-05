import GlobalStyles from '../components/GlobalStyles'
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider } from 'next-themes'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
    return (
        <StyleSheetManager enableVendorPrefixes>
        <Layout>
            <GlobalStyles />
            <ThemeProvider forcedTheme={Component.theme || null}>
                <Component {...pageProps} />
            </ThemeProvider>
        </Layout>
        </StyleSheetManager>
    )
  }
  
export default MyApp