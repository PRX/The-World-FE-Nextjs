import type { NextPageContext } from 'next/types';
import Error from 'next/error';

function TwError(props) {
  const { statusCode } = props;
  return <Error statusCode={statusCode} />;
}

TwError.getInitialProps = ({ req, res, err }: NextPageContext) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;

  // eslint-disable-next-line no-console
  console.error({ req, res, err, statusCode });

  return { statusCode };
};

export default TwError;
