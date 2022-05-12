import GlobalStyles from '../components/GlobalStyles'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <GlobalStyles />
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )
  }
  
export default MyApp