import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s – Inkstream Docs',
    default: 'Inkstream – Modular Rich Text Editor SDK',
  },
  description: 'Inkstream is a modular, ProseMirror-based rich text editor SDK for React.',
}

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
        ✦ Inkstream
      </span>
    }
    projectLink="https://github.com/inkstream-dev/inkstream-editor"
  />
)

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} ©{' '}
    <a href="https://docs.inkstream.dev" target="_blank" rel="noreferrer">
      Inkstream
    </a>
  </Footer>
)

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/inkstream-dev/inkstream-docs/edit/main"
          editLink="Edit this page on GitHub →"
          feedback={{ content: 'Question? Give us feedback →' }}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
