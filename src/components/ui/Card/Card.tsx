import React from 'react';
import styles from './Card.module.scss';
import { Badge } from '../Badge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  bordered = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${styles.card} ${interactive ? styles.interactive : ''} ${
        bordered ? styles.bordered : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  actions,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.header} ${className}`} {...props}>
      {children ? (
        children
      ) : (
        <>
          <div className={styles.headerContent}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </>
      )}
    </div>
  );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  noPadding = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${styles.content} ${noPadding ? styles.noPadding : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.footer} ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtext?: React.ReactNode;
  isDemo?: boolean;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtext,
  isDemo = false,
  trend,
  className = '',
  ...props
}) => {
  return (
    <Card className={`${styles.statCard} ${className}`} {...props}>
      <div className={styles.statHeader}>
        <div className={styles.statTitleGroup}>
          <span className={styles.statTitle}>{title}</span>
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isDemo && <Badge variant="demo">DEMO DATA</Badge>}
          </div> */}
          {icon && <div className={styles.statIcon}>{icon}</div>}
        </div>
      </div>
      <div className={styles.statValueContainer}>
        <div className={styles.statValue}>{value}</div>
        {trend && (
          <span
            className={`${styles.trend} ${
              trend.isPositive ? styles.trendPositive : styles.trendNegative
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      {subtext && <div className={styles.statSubtext}>{subtext}</div>}
    </Card>
  );
};
