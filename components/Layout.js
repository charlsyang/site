import Nav from './Nav.js'
import Footer from './Footer.js'

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}