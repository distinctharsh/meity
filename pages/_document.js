import Document, { Html, Head, Main, NextScript } from 'next/document';

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  cookieHeader.split(';').forEach(p => {
    const [k, ...v] = p.trim().split('=');
    out[k] = decodeURIComponent(v.join('='));
  });
  return out;
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const req = ctx.req;
    const cookies = parseCookies(req?.headers?.cookie || '');
    const lang = cookies.lang || 'en';
    return { ...initialProps, lang };
  }

  render() {
    const lang = this.props.lang || 'en';
    return (
      <Html lang={lang}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/jquery.dataTables.min.css" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

