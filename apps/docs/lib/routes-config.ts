// for page navigation & to sort on leftbar

import React from 'react';

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  comingSoon?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: 'Overview',
    href: '/overview',
    noLink: true,
    items: [
      { title: 'Introduction', href: '/introduction' },
      {
        title: 'Getting started',
        href: '/getting-started',
      },
    ],
  },
  {
    title: 'Components',
    href: '/components',
    noLink: true,
    items: [
      { title: 'Calendar', href: '/calendar' },
      {
        title: 'Range Calendar',
        href: '/range-calendar',
        noLink: true,
        comingSoon: true,
      },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
