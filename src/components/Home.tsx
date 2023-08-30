import { StatusBar } from 'expo-status-bar';
import { View, ScrollView } from 'react-native';
import React from 'react';
import { Appbar, Button, Card } from 'react-native-paper';
import { IconButton, Text } from 'react-native-paper';
import colors from '../../assets/colors';
import styles from "../style/All";
import getToken from '../../exports/getToken';
import { Deccode } from '../../exports/Decode';
import axios from 'axios';
import Menu from './Menu';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Home() {
    const [token, setToken] = React.useState('');
    const [userData] = React.useState(Deccode());
    const [perfil, setPerfil] = React.useState('');
    const [OpenMenu, setOpenMenu] = React.useState(false);
    const [mostrarSaldo, setMostrarSaldo] = React.useState(false);
    const [dataCard, setDataCard] = React.useState('')
    console.debug(userData);

    React.useEffect(() => {
        const fetchData = async () => {
            const retrievedToken = await getToken();
            setToken(retrievedToken);
            console.debug(retrievedToken);
        }
        fetchData()
    }, [])

    React.useEffect(() => {
        const returnImagePerfil = async () => {
            console.debug('foi');
            try {
                const perfilimage = userData.user_FotoPerfil
                console.debug(perfilimage);

                if (!perfilimage) {
                    console.debug('tem nada')
                    return
                }

                const response = await axios.post(
                    'http://192.168.5.112:3344/user/returnperfil',
                    {
                        filename: perfilimage,
                    },
                    {
                        responseType: 'arraybuffer',
                    }
                );
                console.debug(perfilimage);
                console.debug(response.data);

                const arrayBufferView = new Uint8Array(response.data);
                const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });

                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    setPerfil(reader.result) // A URL Base64 será armazenada em imageUrlWithPrefix
                    console.log(response.data);
                    console.log(perfil, 'aaaa');
                };
                console.log('foi');
            } catch (error) {
                console.error('Error uploading image:', error.message);
            }
        };
        returnImagePerfil()
    }, [token]); 

    const hanldeFalse = () => {
        setOpenMenu(false);
    }

    React.useEffect(() => {
        async function SearchCard() {
            try {
                console.log('ta indo');
                console.log(token);

                const response = await axios.post('http://192.168.5.112:3344/card/enviados', {
                    token: token
                });
                console.log(response);
                console.log('ta indo');

                if (response.data) {
                    console.log(response.data);
                    console.log(dataCard);
                    setDataCard(response.data[0])
                    console.log(dataCard);

                } else {
                    console.log('deu merda rapeize')
                }
            } catch (error) {
                console.log(error);
            }
        }
        SearchCard()
    }, [token])

    return (
        <>
            <View style={styles.container}>
                <Appbar.Header style={{ width: '100%', height: 60, display: 'flex', flexDirection: 'row', backgroundColor: colors.pm }}>
                    <Appbar.Action size={30} icon="menu" onPress={() => setOpenMenu(true)} style={{ marginLeft: 20 }} color={'white'} />
                    <Appbar.Content title="EasyPass" titleStyle={{ color: colors.sc, fontWeight: 'bold' }} style={{ justifyContent: 'center', alignItems: 'center' }} />
                    {perfil ? (
                        <IconButton
                            iconColor={"white"}
                            icon="account-circle"
                            style={{ backgroundColor: 'transparent', marginRight: 20 }}
                            size={40}
                            onPress={() => { }}
                        />
                    ) : (
                        <IconButton
                            iconColor={"white"}
                            icon="account-circle"
                            style={{ backgroundColor: 'transparent', marginRight: 20 }}
                            size={40}
                            onPress={() => { }}
                        />
                    )}             
                </Appbar.Header>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ width: wp('100%'), height: '100%', display: 'flex' }}>
                    <View style={{ width: '50%', height: 'auto', marginTop: hp('5%'), marginLeft: wp('15%'), marginBottom: 40 }}>
                        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>Saldo:</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 22, borderBottomWidth: 2, borderBottomColor: colors.sc }}>
                                R$ {mostrarSaldo ? (dataCard.card_saldo ? dataCard.card_saldo : '000.00') : "•••••••"}
                            </Text>                            
                            <IconButton
                                icon={mostrarSaldo ? 'eye-off' : 'eye'}
                                onPress={() => setMostrarSaldo(!mostrarSaldo)}
                            />
                        </View>
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                        <Card style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
                                <IconButton icon={'credit-card-plus'} size={30} style={{ marginTop: 20 }} />
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Recarga</Text>
                            </View>
                        </Card>
                        <Card style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
                                    <IconButton icon={'smart-card'} size={30} style={{ marginTop: 20 }} />
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Cartões</Text>
                            </View>
                        </Card>
                        <Card style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
                                    <IconButton icon={'comment-question'} size={30} style={{ marginTop: 20 }} />
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>SAC</Text>
                            </View>
                        </Card>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10 }}>
                        <Card style={{ alignSelf: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
                                    <IconButton icon={'shopping'} size={30} style={{ marginTop: 20 }} />
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Loja</Text>
                            </View>
                        </Card>
                        <Card style={{ alignSelf: 'center' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
                                    <IconButton icon={'bus'} size={30} style={{ marginTop: 20 }} />
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Ônibus</Text>
                            </View>
                        </Card>
                        <Card style={{ alignSelf: 'center'}}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
                                <IconButton icon={'routes'} size={30} style={{ marginTop: 20 }} />
                                    <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Rotas</Text>
                            </View>
                        </Card>
                        </View>
                    </View>
                    <View style={{ width: wp('80%'), height: hp('10%'), alignSelf: 'center', marginTop: 40 }}>
                        <Card style={{ width: '100%', height: '100%' }}> 
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                                <Card.Content style={{ width: '60%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>Veja as rotas dos seus Ônibus e tenha controle da sua viajem!</Text>
                                </Card.Content>
                                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ width: '40%', height: '100%' }} />
                            </View>
                        </Card>
                    </View>
                    <View style={{ width: wp('80%'), height: hp('10%'), alignSelf: 'center', marginTop: 20 }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                            <View style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                                <Card.Content style={{ width: '60%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>Recarregue por pix seu cartão de forma rápida e prática!</Text>
                                </Card.Content>
                                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ width: '40%', height: '100%' }} />
                            </View>
                        </Card>
                    </View>
                        <View style={{ width: '100%', height: hp('18%') }}>
                            <Card style={{ width: '100%', height: '100%' }}>
                                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                                    <View style={{ width: '60%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                        <Card.Content >
                                            <Text style={{fontWeight: 'bold', fontSize: 15}}>Convide amigos</Text>
                                            <Text style={{fontSize: 11 }}>Indique para seus amigos o aplicativo da EasyPass!</Text>
                                        </Card.Content>
                                        <Card.Actions style={{ marginTop: 5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                            <Button textColor={colors.sc} labelStyle={{ fontSize: 11 }} style={{ paddingVertical: 0, backgroundColor: colors.pm, borderColor: 'transparent',  }} >Convidar</Button>
                                        </Card.Actions>
                                    </View>
                                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ width: '40%', height: '100%' }} />
                                </View>
                            </Card>
                        </View>
                </View>
                </ScrollView>
                <StatusBar style="auto" />
                {OpenMenu && <Menu onClose={hanldeFalse} />}
            </View>
        </>
    );
}
