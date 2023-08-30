import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import colors from '../../assets/colors';
import axios from "axios";
import Loading from './Loading';
import styles from "../style/All";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import ModalUser from './ModalUser';

export default function Cadastro() {
  const [cep, setCEP] = React.useState("");
  const [city, setCidade] = React.useState("");
  const [district, setBairro] = React.useState("");
  const [street, setRua] = React.useState("");
  const [comp, setComplemento] = React.useState("");
  const [num, setNumero] = React.useState("");
  const [UF, setUF] = React.useState("");
  const [dadosU, setDadosU] = React.useState({});
  const [disable, setDisable] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [address, setAddress] = React.useState(null);
  const [latitude, setLatitude] = React.useState(null);
  const [longitude, setLongitude] = React.useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { cpf, rg, email, name, dataformated, password } = route.params;
  const [visible, setVisible] = React.useState(false);
  const [bool, setBool] = React.useState("");

  React.useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);

        } else {
          console.log('Permissão de localização negada.');
        }
      } catch (error) {
        console.error(error);
      }
    };

    requestLocationPermission();

  }, []);

  React.useEffect(() => {
    const handleLat = async () => {
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=b0fe2fad1e56494dadfe4ae5a451b01c&q=${latitude}%2C${longitude}&pretty=1`;
      try {
        const response = await axios.get(apiUrl);
        const addressData = response.data.results[0];
        if (addressData) {
          setAddress(addressData.formatted);
          setCEP(addressData.components.postcode);

        }
      } catch (error) {
        console.error('Erro ao obter o endereço:', error);
      }

      const url = `https://us1.locationiq.com/v1/reverse?key=pk.b1cdef70062a3d7cc8ae3064b1789b2f&lat=${latitude}&lon=${longitude}&format=json`
      try {
        const res = await axios.get(url);
        console.log("TA INDO CARALHO", res);
        setCEP(res.data.address.postcode);
        const stateMappings: { [key: string]: string } = {
          "Acre": "AC",
          "Alagoas": "AL",
          "Amapá": "AP",
          "Amazonas": "AM",
          "Bahia": "BA",
          "Ceará": "CE",
          "Distrito Federal": "DF",
          "Espírito Santo": "ES",
          "Goiás": "GO",
          "Maranhão": "MA",
          "Mato Grosso": "MT",
          "Mato Grosso do Sul": "MS",
          "Minas Gerais": "MG",
          "Pará": "PA",
          "Paraíba": "PB",
          "Paraná": "PR",
          "Pernambuco": "PE",
          "Piauí": "PI",
          "Rio de Janeiro": "RJ",
          "Rio Grande do Norte": "RN",
          "Rio Grande do Sul": "RS",
          "Rondônia": "RO",
          "Roraima": "RR",
          "Santa Catarina": "SC",
          "São Paulo": "SP",
          "Sergipe": "SE",
          "Tocantins": "TO",
        };

        const state = res.data.address.state;
        const formattedState = state.trim();

        if (stateMappings[formattedState]) {
          setUF(stateMappings[formattedState]);
        }
        setCidade(res.data.address.city);
        setBairro(res.data.address.suburb);
        setRua(res.data.address.road);
        setComplemento(res.data.address.neighbourhood)
      } catch (error) {
        console.error('error aa:', error.message);
        console.error('error aa:', error);

      }
    }
    handleLat()
  }, [latitude, longitude, cep])


  React.useEffect(() => {
    if (cep && city && district && street && UF && num) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [cpf, password, cep, city, district, street, UF, num]);


  const handleChangeCep = (text: string) => {
    let cepValue = text.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5, 8); // Adiciona o traço na posição correta
    setCEP?.(cepValue);
  }


  const handleCadFull = async (card: any, listid: any) => {
    HandleFalse()
    setLoading(true);
    setDisable(true);

    const date = dataformated
    const type = listid
    const id = card

    const dadosUsuario = {
      user_CPF: cpf,
      user_RG: rg,
      user_nome: name,
      user_email: email,
      user_senha: password,
      user_nascimento: date,
      user_endCEP: cep,
      user_endUF: UF,
      user_endbairro: district,
      user_endrua: street,
      user_endnum: num,
      user_endcomplemento: comp,
      user_endcidade: city,
      user_tipo: type,
      list_CPF_list_id: id
    };

    setDadosU(dadosUsuario)
    console.debug(dadosU);

    console.debug(card, listid)
    await cadastrarUsuario()
  };

  async function cadastrarUsuario() {

    try {
      const res = await axios.post('http://192.168.5.112:3344/user', dadosU);
      console.debug('foi mlk cadastrado');
      console.debug(res.data);
      navigation.navigate('Login', { bool })
      setLoading(false);

    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        console.error('Erro na requisição POST:', error.message);
        HandleFalse()
        navigation.navigate('Cadastro')
      } else if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Erro na requisição POST:', error.response.status);
        } else if (error.request) {
          console.error('Erro na requisição POST:', error.request);
        } else {
          console.error('Erro desconhecido na requisição POST');
        }
      } else {
        console.error('Erro desconhecido na requisição POST');
      }
    }
  }

  const HandleFalse = () => {
    setVisible(false);
  };

  return (
    <>
      {visible && <ModalUser bol={{ value: visible }} onClose={HandleFalse} cpf={cpf} onCad={handleCadFull} />}
      {loading ? <Loading />
        : <View style={styles.container}>
          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.list}>
              <Button icon='arrow-left-bold' mode='contained' style={styles.back} onPress={() => navigation.navigate('Cadastro')}>Voltar</Button>
            </View>
            <TextInput
              label="Digite seu CEP"
              left={<TextInput.Icon icon="account" />}
              value={cep}
              onChangeText={(text) => {
                setCEP(text);
                handleChangeCep(text)
              }}
              style={styles.input}
            />
            <TextInput
              label="Digite sua Cidade"
              left={<TextInput.Icon icon="file-document" />}
              value={city}
              style={styles.input}
              disabled
            />
            <TextInput
              label="Digite seu Bairro"
              left={<TextInput.Icon icon="email" />}
              value={district}
              style={styles.input}
              disabled
            />
            <TextInput
              label="Digite sua Rua"
              left={<TextInput.Icon icon="rename-box" />}
              value={street.replace(/\D/g, '')}
              style={styles.input}
              disabled
            />
            <TextInput
              label="Digite o Complemento"
              left={<TextInput.Icon icon="calendar" />}
              value={comp}
              onChangeText={(text) => setComplemento(text)}
              style={styles.input}
            />
            <TextInput
              label="Digite seu Número"
              left={<TextInput.Icon icon="map-marker" />}
              value={num}
              onChangeText={(text) => setNumero(text)}
              style={styles.input}
            />
            <TextInput
              label="Digite seu Estado"
              left={<TextInput.Icon icon="map-marker" />}
              value={UF}
              style={styles.input}
              disabled
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
                onPress={() => setVisible(true)}
              >
                Confirmar
              </Button>
            </Animatable.View>
          </ScrollView>
          <StatusBar style="auto" />
        </View>
      }
    </>
  );
}
