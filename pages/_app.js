import GlobalStyles from '../components/GlobalStyles'
import { ThemeProvider } from 'next-themes'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <GlobalStyles />
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </Layout>
    )
  }
  
export default MyApp