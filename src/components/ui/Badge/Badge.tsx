import React from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'neutral' | 'demo';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  withDot = true,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${className}`}
      {...props}
    >
      {withDot && <span className={styles.dot} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
