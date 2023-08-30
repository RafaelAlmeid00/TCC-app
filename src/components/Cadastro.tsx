import React from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import colors from '../../assets/colors';
import Loading from './Loading';
import styles from '../style/All';
import { AlertComponent } from './Alertas';

export default function Cadastro() {
  const navigation = useNavigation();

  const [cpf, setCPF] = React.useState('');
  const [rg, setRG] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setNome] = React.useState('');
  const [data, setData] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordval, setPasswordval] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [ErrorEmail, setErrorEmail] = React.useState(false);
  const [ErrorNull, setErrorNull] = React.useState(false);
  const [EmailInvalido, setEmailInvalido] = React.useState(false);
  const [showErrorData, setShowErrorData] = React.useState(false);
  const [showErrorCPF, setShowErrorCPF] = React.useState(false);
  const [showErrorNome, setShowErrorNome] = React.useState(false);
  const [showRG, setShowRG] = React.useState(false);
  const [showCPFexiste, setShowCPFexiste] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);
  const [CPFInvalido, setCPFInvalido] = React.useState(false);

  React.useEffect(() => {
    if (cpf && password && rg && email && name && data && passwordval) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [cpf, password, rg, email, name, data, passwordval]);


  async function Verifylog() {
    try {
      console.debug('tapoha1.2');
      setLoading(true);
      const response = await axios.post('http://192.168.5.112:3344/user/email', { user_email: email });

      if (response.data) {
        setErrorEmail(true);
        setEmail('');
        setLoading(false);
        throw new Error("Erro: Email já existe");
      }

      console.debug('foi mlk');
      return true;
    } catch (error) {
      console.debug('tapoha3');
      console.error(error.message);

      if (!email || !rg || !data || !name || !password || !passwordval || !cpf) {
        setErrorNull(true);
        console.debug('tapoha2');
        console.debug(ErrorNull);
        setLoading(false);
        throw new Error("Erro: Campos obrigatórios não preenchidos");
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setEmailInvalido(true);
        console.debug('tapoha4');
        setLoading(false);
        throw new Error("Erro: Email inválido");
      }

      console.debug('foi mlk');
      return true;
    }
  }


  async function handleCad() {
    try {
      const isEmailValid = await Verifylog();

      if (isEmailValid) {
        await Verifylog();
        const validinputs = await VerifyInputs();
        if (validinputs) {
          setLoading(false);
          console.debug("Algum dado está invalido");
        } else {
          const dataformated = handleSubmitData()
          setDisable(true);
          navigation.navigate('Endereco', { cpf, rg, email, name, dataformated, password, passwordval });
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.debug("Debug: Email já existe");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const HandleFalse = () => {
    setErrorEmail(false);
    setErrorNull(false);
    setEmailInvalido(false);
    setShowErrorData(false);
    setShowErrorCPF(false);
    setShowErrorNome(false);
    setShowRG(false);
    setShowCPFexiste(false);
    setShowPass(false);
    setCPFInvalido(false)
  };
  async function ValidaCPF(cpf: string): Promise<boolean> {
    const cpfDigits = cpf.replace(/\D/g, '');

    if (
      ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444',
        '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'].includes(cpfDigits)
    ) {
      return false;
    }

    const calculateDigit = (digits: string, factor: number) => {
      const sum = digits.split('').reduce((acc, digit, index) => acc + parseInt(digit) * (factor - index), 0);
      const rest = (sum * 10) % 11;
      return rest === 10 || rest === 11 ? 0 : rest;
    };

    const firstDigit = calculateDigit(cpfDigits.slice(0, 9), 10);
    const secondDigit = calculateDigit(cpfDigits.slice(0, 10), 11);

    return firstDigit === parseInt(cpfDigits[9]) && secondDigit === parseInt(cpfDigits[10]);
  }



  async function VerifyCPF(): Promise<boolean> {
    try {
      console.debug('ta indoooo');
      setLoading(true);
      const resCPF = await axios.post('http://192.168.5.112:3344/user/cpf', { user_CPF: cpf });
      console.debug('n foooi', cpf);
      console.debug(resCPF.data);
      if (resCPF.data) {
        setShowCPFexiste(true);
        setLoading(false);
        console.debug(resCPF.data);
        return true;
      }
    } catch (error) {
      console.debug('CPF TA OK');
      const cpfInvalid = await ValidaCPF(cpf);
      console.debug(cpfInvalid);
      if (cpfInvalid) {
        return false;
      } else {
        setLoading(false);
        console.debug('CPF invalido cria');
        setCPFInvalido(true)
        return true;
      }
    }
    return true;
  }

  async function VerifyInputs(): Promise<boolean> {
    if (data === '' || !/^\d{4}-\d{2}-\d{2}$/.test(handleSubmitData()) || data.length < 10) {
      setShowErrorData(true);
      setLoading(false);
      return true;
    }
    if (cpf === '' || cpf.length < 11) {
      setShowErrorCPF(true);
      setLoading(false);
      return true;
    }
    if (name === '') {
      setShowErrorNome(true);
      setLoading(false);
      return true;
    }
    if (rg === '' || rg.length < 8) {
      console.debug(rg);
      setShowRG(true);
      setLoading(false);
      return true;
    }
    if (password !== passwordval) {
      console.debug("Erro: Senhas diferentes");
      setShowPass(true);
      setLoading(false);
      return true;
    }
    const cpfValid = await VerifyCPF();
    return cpfValid;
  }

  const formatDateString = (text: string) => {
    let formattedString = text.replace(/\D/g, '');
    if (formattedString.length > 2) formattedString = `${formattedString.slice(0, 2)}-${formattedString.slice(2)}`;
    if (formattedString.length > 5) formattedString = `${formattedString.slice(0, 5)}-${formattedString.slice(5)}`;
    return formattedString;
  };

  const handleSubmitData = () => {
    const parts = data.split('-');
    const formattedDateForDatabase = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDateForDatabase;
  };

  React.useEffect(() => {
    console.debug(data)
    console.debug(formatDateString)
    console.debug(handleSubmitData())
  }, [data])

  return (
    <>
      {CPFInvalido && <AlertComponent bol={{ value: CPFInvalido }} onClose={HandleFalse} title="CPF Inválido" message="Escreva um CPF existente" />}
      {showPass && <AlertComponent bol={{ value: showPass }} onClose={HandleFalse} title="Senhas diferentes" message="Verifique se as senhas são iguais" />}
      {EmailInvalido && <AlertComponent bol={{ value: EmailInvalido }} onClose={HandleFalse} title="Email Inválido" message="Escreva um email válido" />}
      {ErrorNull && <AlertComponent bol={{ value: ErrorNull }} onClose={HandleFalse} title="Espaços em Branco" message="Não deixe nenhum campo em branco" />}
      {ErrorEmail && <AlertComponent bol={{ value: ErrorEmail }} onClose={HandleFalse} title="Email já existe" message="Já existe uma conta com esse email" />}
      {showErrorData && <AlertComponent bol={{ value: showErrorData }} onClose={HandleFalse} title="Data inválida" message="Coloque uma data válida" />}
      {showErrorCPF && <AlertComponent bol={{ value: showErrorCPF }} onClose={HandleFalse} title="Erro no CPF" message="CPF inválido" />}
      {showErrorNome && <AlertComponent bol={{ value: showErrorNome }} onClose={HandleFalse} title="Erro no Nome" message="Nome inválido" />}
      {showRG && <AlertComponent bol={{ value: showRG }} onClose={HandleFalse} title="Erro no RG" message="RG inválido" />}
      {showCPFexiste && <AlertComponent bol={{ value: showCPFexiste }} onClose={HandleFalse} title="CPF já existe" message="Já existe uma conta com esse CPF" />}
      {loading ? <Loading />
        : <View style={styles.container}>
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.list}>
              <Button icon='arrow-left-bold' mode='contained' style={styles.back} onPress={() => navigation.navigate('Login')}>Voltar</Button>
            </View>
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
              label="Digite seu RG"
              left={<TextInput.Icon icon="file-document" />}
              value={rg}
              onChangeText={(text) => setRG(text.replace(/\D/g, ''))}
              style={styles.input}
              maxLength={9}
            />
            <TextInput
              label="Digite seu Email"
              left={<TextInput.Icon icon="email" />}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              label="Digite seu Nome Completo"
              left={<TextInput.Icon icon="rename-box" />}
              value={name}
              onChangeText={(text) => setNome(text)}
              style={styles.input}
            />
            <TextInput
              label="Digite sua Data de Nascimento"
              left={<TextInput.Icon icon="calendar" />}
              value={data}
              onChangeText={(text) => setData(formatDateString(text))}
              style={styles.input}
              maxLength={10}
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
            <TextInput
              label="Digite sua Senha novamente"
              secureTextEntry={!visible2}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={visible2 ? "eye-off" : "eye"}
                  onPress={() => setVisible2((prevVisible) => !prevVisible)}
                />
              }
              value={passwordval}
              onChangeText={(text) => setPasswordval(text)}
              style={styles.input}
            />
            <Animatable.View
              animation="fadeIn"
              duration={1000}
              style={{ opacity: disable ? 0.6 : 1 }}
            >
              <Button
                mode="contained"
                style={[styles.button, { backgroundColor: disable ? 'gray' : colors.pm, marginBottom: 50 }]}
                disabled={disable}
                onPress={handleCad}
              >
                Confirmar
              </Button>
            </Animatable.View>
          </ScrollView>
        </View>

            }
          </>
  )
          }