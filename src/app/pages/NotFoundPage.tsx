import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import styles from './NotFoundPage.module.scss';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <div style={{ color: 'var(--color-severity-critical)', marginBottom: '8px' }}>
        <ShieldX size={56} />
      </div>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.errorTitle}>Resource Not Located</h1>
      <p className={styles.errorDesc}>
        The requested routing endpoint does not exist within the SENTINEL NIDS navigation topology.
        Verify the URL path or return to the main security operations dashboard.
      </p>

      <div className={styles.actions}>
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft size={16} />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/')}
          leftIcon={<Home size={16} />}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
