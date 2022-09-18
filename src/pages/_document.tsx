import React from 'react'
import Document, { DocumentContext, Html, Head, Main, NextScript, DocumentInitialProps } from 'next/document'

import { CssBaseline } from '@nextui-org/react'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    }
  }
  render() {
    return(
      <Html className = "h-full w-full" >
        <Head>
          <link href="/favicon.png" rel="icon" sizes="32x32" type="image/png" />
          {CssBaseline.flush()}
        </Head>
        <body className="h-full w-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
