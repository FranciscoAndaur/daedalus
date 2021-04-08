// @flow
import React from 'react';
import { findKey } from 'lodash';
import { boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';
import { action } from '@storybook/addon-actions';
import SettingsWrapper from '../utils/SettingsWrapper';
import {
  DATE_ENGLISH_OPTIONS,
  LANGUAGE_OPTIONS,
  NUMBER_OPTIONS,
  TIME_OPTIONS,
} from '../../../../source/renderer/app/config/profileConfig';
import { updateParam } from '../../../addons/DaedalusMenu';
import { locales, themesIds } from '../../_support/config';

// Screens
import ProfileSettingsForm from '../../../../source/renderer/app/components/widgets/forms/ProfileSettingsForm';
import StakePoolsSettings from '../../../../source/renderer/app/components/settings/categories/StakePoolsSettings';
import DisplaySettings from '../../../../source/renderer/app/components/settings/categories/DisplaySettings';
import SupportSettings from '../../../../source/renderer/app/components/settings/categories/SupportSettings';
import TermsOfUseSettings from '../../../../source/renderer/app/components/settings/categories/TermsOfUseSettings';
import WalletsSettings from '../../../../source/renderer/app/components/settings/categories/WalletsSettings';

// Data
import currenciesList from '../../../../source/renderer/app/config/currenciesList.json';

const getParamName = (obj, itemName): any =>
  Object.entries(obj).find((entry: [any, any]) => itemName === entry[1]);

/* eslint-disable consistent-return */
storiesOf('Settings|General', module)
  .addDecorator(SettingsWrapper)

  // ====== Stories ======

  .add('General', () => (
    <ProfileSettingsForm
      isSubmitting={boolean('isSubmitting', false)}
      onSubmit={action('submit')}
      onChangeItem={(param: string, value: string) => {
        if (param === 'locale') {
          updateParam({
            param: 'localeName',
            value: findKey(locales, (item) => item === value),
          });
        }
      }}
      currentDateFormat={DATE_ENGLISH_OPTIONS[0].value}
      currentLocale={LANGUAGE_OPTIONS[0].value}
      currentNumberFormat={NUMBER_OPTIONS[0].value}
      currentTimeFormat={TIME_OPTIONS[0].value}
    />
  ))
  .add(
    'Wallets',
    withState({ currencySelected: currenciesList.usd }, (store) => (
      <WalletsSettings
        currencySelected={store.state.currencySelected}
        currencyRate={0.321}
        currencyList={Object.values(currenciesList)}
        currencyIsActive
        onSelectCurrency={(code) => {
          const currencySelected = currenciesList[code];
          store.set({ currencySelected });
        }}
        onToggleCurrencyIsActive={action('onToggleCurrencyIsActive')}
        onOpenExternalLink={action('onOpenExternalLink')}
        // @TODO SEARCH: Remove this prop
        hasSearch={boolean('hasSearch', true)}
      />
    ))
  )
  .add('Stake Pools', () => (
    <StakePoolsSettings
      onSelectSmashServerUrl={action('onSelectSmashServerUrl')}
      onResetSmashServerError={action('onResetSmashServerError')}
      smashServerUrl="https://smash.cardano-mainnet.iohk.io"
      onOpenExternalLink={action('onOpenExternalLink')}
      isSyncing={boolean('isSyncing', false)}
      syncPercentage={number('syncPercentage', 70, {
        range: true,
        min: 0,
        max: 100,
        step: 1,
      })}
      isLoading={boolean('isLoading', false)}
    />
  ))
  .add('Themes', () => (
    <DisplaySettings
      theme="DarkBlue"
      selectTheme={({ theme }) => {
        updateParam({
          param: 'themeName',
          value: getParamName(themesIds, theme)[0],
        });
      }}
    />
  ))
  .add('Terms of Service', (props) => {
    const termsOfUseSource = require(`../../../../source/renderer/app/i18n/locales/terms-of-use/${props.locale}.md`);
    return (
      <TermsOfUseSettings
        localizedTermsOfUse={termsOfUseSource}
        onOpenExternalLink={() => null}
      />
    );
  })
  .add('Support', () => (
    <SupportSettings
      onExternalLinkClick={action('onExternalLinkClick')}
      onSupportRequestClick={action('onSupportRequestClick')}
      onDownloadLogs={action('onDownloadLogs')}
      disableDownloadLogs={boolean('disableDownloadLogs', false)}
    />
  ));
