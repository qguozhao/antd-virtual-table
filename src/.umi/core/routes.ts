// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/Users/qiguozhao/xiangmu/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [require('../dumi/layout').default],
    "component": ((props) => {
        const React = require('react');
        const { default: getDemoRenderArgs } = require('/Users/qiguozhao/xiangmu/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
        const { default: Previewer } = require('dumi-theme-default/es/builtins/Previewer.js');
        const { usePrefersColor, context } = require('dumi/theme');

        
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
        })
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/",
    "wrappers": [require('../dumi/layout').default, require('/Users/qiguozhao/xiangmu/node_modules/dumi-theme-default/es/layout.js').default],
    "routes": [
      {
        "path": "/",
        "component": require('/Users/qiguozhao/xiangmu/docs/index.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/index.md",
          "updatedTime": 1640681886761,
          "title": "virtuallist-antd",
          "slugs": []
        },
        "title": "virtuallist-antd - antd-virtual-table"
      },
      {
        "path": "/demo/single-page-loading",
        "component": require('/Users/qiguozhao/xiangmu/docs/demo/SinglePageLoading.md').default,
        "exact": true,
        "meta": {
          "filePath": "docs/demo/SinglePageLoading.md",
          "updatedTime": 1640681886759,
          "slugs": [
            {
              "depth": 2,
              "value": "SinglePageLoading",
              "heading": "singlepageloading"
            }
          ],
          "title": "SinglePageLoading",
          "group": {
            "path": "/demo",
            "title": "Demo"
          }
        },
        "title": "SinglePageLoading - antd-virtual-table"
      },
      {
        "path": "/demo",
        "meta": {},
        "exact": true,
        "redirect": "/demo/single-page-loading"
      }
    ],
    "title": "antd-virtual-table",
    "component": (props) => props.children
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
