// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TypeDef, getTypeDef } from '@polkadot/types/codec';
import { StorageFunction } from '@polkadot/types/StorageKey';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParams } from '@polkadot/ui-app/Params/types';
import { StorageQuery } from './types';

import React from 'react';
import Api from '@polkadot/api-observable';
import { Button, InputStorage, Labelled, Params } from '@polkadot/ui-app/index';
import { isUndefined } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  onAdd: (query: StorageQuery) => void
};

type State = {
  isValid: boolean,
  key: StorageFunction,
  values: RawParams,
  params: Array<{ type: TypeDef }>
};

let id = -1;

class Selection extends React.PureComponent<Props, State> {
  private defaultValue: any;
  state: State;

  constructor (props: Props) {
    super(props);

    this.defaultValue = Api.storage.timestamp.now;
    this.state = {
      isValid: true,
      key: this.defaultValue,
      values: [],
      params: []
    };
  }

  render () {
    const { t } = this.props;
    const { isValid, params } = this.state;

    return (
      <section className='storage--Selection storage--actionrow'>
        <div className='storage--actionrow-value'>
          <InputStorage
            defaultValue={this.defaultValue}
            labelSection={t('selection.section', {
              defaultValue: 'query state section'
            })}
            onChange={this.onChangeKey}
          />
          <Params
            onChange={this.onChangeParams}
            params={params}
          />
        </div>
        <Labelled className='storage--actionrow-button'>
          <Button
            icon='plus'
            isDisabled={!isValid}
            isPrimary
            onClick={this.onAdd}
          />
        </Labelled>
      </section>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State) => {
        const { key = prevState.key, values = prevState.values } = newState;
        const hasParam = key.meta.type.isMap;
        const isValid = values.length === (hasParam ? 1 : 0) &&
          values.reduce((isValid, value) =>
            isValid &&
            !isUndefined(value) &&
            !isUndefined(value.value) &&
            value.isValid,
            true
          );

        return {
          isValid,
          key,
          values,
          params: hasParam
            ? [{ type: getTypeDef(key.meta.type.asMap.key.toString()) }]
            : []
        };
      }
    );
  }

  private onAdd = (): void => {
    const { onAdd } = this.props;
    const { key, values } = this.state;

    onAdd({
      id: ++id,
      key,
      params: values
    });
  }

  private onChangeKey = (key: StorageFunction): void => {
    this.nextState({
      isValid: false,
      key,
      values: [],
      params: []
    });
  }

  private onChangeParams = (values: RawParams = []): void => {
    this.nextState({ values } as State);
  }
}

export default translate(Selection);
