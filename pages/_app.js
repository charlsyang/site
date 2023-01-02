import GlobalStyles from '../components/GlobalStyles'
import { ThemeProvider } from 'next-themes'
import localFont from '@next/font/local'

const diatype = localFont({ src: '../public/fonts/ABCDiatypeVariable.woff2'})

function MyApp({ Component, pageProps }) {
    return (
        <main className={diatype.className}>
            <GlobalStyles />
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </main>
    )
  }
  
export default MyApp