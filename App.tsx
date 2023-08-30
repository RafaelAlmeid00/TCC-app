import React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import Routes from './routes';

export default function Main() {
  return (
    <PaperProvider>
      <Routes />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);