// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import { BestNumber, Chain, NodeName, NodeVersion } from '@polkadot/ui-reactive/index';

type Props = BareProps & {};

const pkgJson = require('../package.json');

export default class NodeInfo extends React.PureComponent<Props> {
  render () {
    return (
      <div className='apps--NodeInfo'>
        <div className='apps--NodeInfo-inline'>
          <Chain />&nbsp;
          <BestNumber label='#' />
        </div>
        <div className='apps--NodeInfo-inline'>
          <NodeName />&nbsp;
          <NodeVersion label='v' />
        </div>
        <div>polkadot-js-ui&nbsp;v{pkgJson.version}</div>
      </div>
    );
  }
}
