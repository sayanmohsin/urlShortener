// src/components/ui/Table.tsx
import React from 'react';

export function Table({
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  const style = {
    width: '100%',
    borderCollapse: 'collapse',
    ...props.style,
  };

  return (
    <table style={style} {...props}>
      {children}
    </table>
  );
}

export function TableHeader({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props}>{children}</thead>;
}

export function TableBody({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>;
}

export function TableRow({
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  const style = {
    borderBottom: '1px solid #eaeaea',
    ...props.style,
  };

  return (
    <tr style={style} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  const style = {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    ...props.style,
  };

  return (
    <th style={style} {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  const style = {
    padding: '12px 16px',
    fontSize: '14px',
    ...props.style,
  };

  return (
    <td style={style} {...props}>
      {children}
    </td>
  );
}
