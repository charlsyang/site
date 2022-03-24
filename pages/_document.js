import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Newsreader&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preload"
            href="public/fonts/ABCDiatypeVariable.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />      
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument