import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'File Transfer',
    Svg: require('@site/static/img/file-transfer.svg').default,
    description: (
      <>
        Mount remote folders as local drives (FTP/WebDAV)
      </>
    ),
  },
  {
    title: 'Port Forwarding',
    Svg: require('@site/static/img/data-tunnel.svg').default,
    description: (
      <>
        Share your local services with remote devices seamlessly.
      </>
    ),
  },
  {
    title: 'Cross-Device Integration',
    Svg: require('@site/static/img/coming-soon.svg').default,
    description: (
      <>
        Coming Soon...
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
