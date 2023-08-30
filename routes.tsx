import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CounterContextProvider } from './context/context';
import LoginScreen from "./src/components/Login"
import CadastroScreen from "./src/components/Cadastro"
import EnderecoLogin from "./src/components/Endereco"
import ModalUser from "./src/components/ModalUser"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/components/Home';

const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <CounterContextProvider >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}
          tabBar={() => null}
        >
          <Tab.Screen
            name="Login"
            component={LoginScreen}
          />
          <Tab.Screen
            name="Cadastro"
            component={CadastroScreen}
          />
          <Tab.Screen
            name="Endereco"
            component={EnderecoLogin}
          />
          <Tab.Screen
            name="ModalUser"
            component={ModalUser}
          />

          <Tab.Screen
            name="Home"
            component={Home}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CounterContextProvider>
  );
}
