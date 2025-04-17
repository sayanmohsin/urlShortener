import React from 'react';

export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const style = {
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    ...props.style,
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const style = {
    padding: '16px',
    borderBottom: '1px solid #eaeaea',
    ...props.style,
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const style = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    ...props.style,
  };

  return (
    <h3 style={style} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const style = {
    padding: '16px',
    ...props.style,
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const style = {
    padding: '16px',
    borderTop: '1px solid #eaeaea',
    display: 'flex',
    ...props.style,
  };

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}
