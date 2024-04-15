import type { NextPageContext } from 'next/types';
import Error from 'next/error';

function TwError(props) {
  const { statusCode } = props;
  return <Error statusCode={statusCode} />;
}

TwError.getInitialProps = ({ req, res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  const { headers, url } = req || {};

  // eslint-disable-next-line no-console
  console.dir({
    url,
    headers
  });

  return { statusCode };
};

export default TwError;
