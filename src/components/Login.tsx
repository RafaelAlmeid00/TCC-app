import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Button, IconButton, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import colors from '../../assets/colors';
import axios from "axios";
import Loading from './Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../style/All";
import stylesLog from "../style/Login";
import { useNavigation } from '@react-navigation/native';
import getToken from '../../exports/getToken';
import * as LocalAuthentication from 'expo-local-authentication'
import SnackBar from './SnackBar';

export default function Login() {
  const [cpf, setCPF] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [auth, setAuth] = React.useState(false);
  const navigation = useNavigation();
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [status, setStatus] = useState('');
  const [textoS, setTextoS] = useState('');

  const showSnackBar = () => {
    setSnackBarVisible(true);
  };

  const hideSnackBar = () => {
    setSnackBarVisible(false);
  };

  const authenticateWithBiometry = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entre com sua Biometria ou Facial',
        cancelLabel: 'Entrar com senha',
        disableDeviceFallback: true
      });

      console.debug(result.success)
      if (result.success) {
        console.debug('Já validado')
        setTextoS('Logado com sucesso!')
        setStatus('ok')
        showSnackBar()
        setLoading(true)
        navigation.navigate('Home')
        setLoading(false)
      } else {
        console.debug('Não validado')
        setTextoS('Biometria não autenticada!')
        setStatus('error')
        showSnackBar()
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    const checkBiometryAvailability = async () => {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) ||
        supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        const retrievedToken = await getToken();
        if (retrievedToken) {
          setAuth(true)
          hideSnackBar()
          authenticateWithBiometry()
        } else {
          setAuth(false)
          console.debug('sem token')
        }
      } else {
        setAuth(false)
        console.debug('Sem biometria')
      }
    }
    checkBiometryAvailability();
  }, [])

  React.useEffect(() => {
    if (cpf !== '' && password !== '') {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [cpf, password]);

  const handleLogin = async () => {
    setLoading(true);
    setDisable(true);
    try {
      const res = await axios.post('http://192.168.5.112:3344/user/login', {
        user_CPF: cpf,
        user_senha: password,
      });

      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
        console.debug(AsyncStorage.getItem('token'))
        console.debug(res.data);
        console.debug('test', res.data.token);
        await getToken()
        setLoading(false);
        navigation.navigate('Home');
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.debug(err);
    }
  };

  return (
    <>
      {loading ? <Loading />
        : <View style={styles.container}>
          <Text style={styles.title}>EasyPass</Text>
          <ScrollView style={styles.form}>
            <Text style={stylesLog.title}>Não possui uma conta? </Text>
            <Button mode="text" style={stylesLog.click} onPress={() => navigation.navigate('Cadastro')}>Clique aqui!</Button>
            <TextInput
              autoFocus
              label="Digite seu CPF"
              left={<TextInput.Icon icon="account" />}
              value={cpf}
              onChangeText={(text) => setCPF(text.replace(/\D/g, ''))}
              style={styles.input}
              maxLength={11}
            />
            <TextInput
              label="Digite sua senha"
              secureTextEntry={!visible}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={visible ? "eye-off" : "eye"}
                  onPress={() => setVisible((prevVisible) => !prevVisible)}
                />
              }
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
            />
            <Animatable.View
              animation="fadeIn"
              duration={1000}
              style={{ opacity: disable ? 0.6 : 1 }}
            >
              <Button
                mode="contained"
                style={[styles.button, { backgroundColor: disable ? 'gray' : colors.pm }]}
                disabled={disable}
                onPress={handleLogin}
              >
                Entrar
              </Button>
            </Animatable.View>
            <Text style={stylesLog.subtitle}>Esqueci a senha</Text>
          </ScrollView>
          {auth && (
            <>
            <IconButton icon={'fingerprint'} style={{ marginTop: -10}} size={35} onPress={authenticateWithBiometry} />
              <Text style={{fontSize: 11, marginTop: 5}}>Entre com a Biometria</Text>
            </>
          )}
          <IconButton
            icon="comment-question"
            style={stylesLog.question}
            size={70}
          />
          <StatusBar style="auto" />
          <SnackBar
            visible={snackBarVisible}
            status={status} // Pode ser 'ok', 'error' ou 'normal'
            text={textoS}
            onDismiss={hideSnackBar}
          />
        </View>
      }
    </>
  )
}