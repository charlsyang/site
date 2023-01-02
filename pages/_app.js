import GlobalStyles from '../components/GlobalStyles'
import { ThemeProvider } from 'next-themes'
import localFont from '@next/font/local'

const myFont = localFont({
    src: [
        {
            path: '../public/fonts/ABCDiatypeVariable.woff2',
        },
        {
            path: '../public/fonts/Newsreader.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/Newsreader-Italic.woff2',
            weight: '400',
            style: 'italic',
        },
    ],
})

function MyApp({ Component, pageProps }) {
    return (
        <main className={myFont.className}>
            <GlobalStyles />
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </main>
    )
  }
  
export default MyApp