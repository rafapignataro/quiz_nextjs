import React from 'react';
import NextLink from 'next/link';

interface Props {
  children: React.ReactNode;
  href: string;
}

export default function Link({ children, href, ...props }: Props) {
  return (
    <NextLink href={href} passHref>
      <a {...props}>{children}</a>
    </NextLink>
  );
}
