import * as React from 'react';
import { Drawer, IconButton, Text } from 'react-native-paper';
import { View, Animated, Easing } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../style/Menu';
import colors from '../../assets/colors';

const Menu = (props) => {
    const [active, setActive] = React.useState('');
    const drawerWidth = wp('100%');
    const screenHeight = hp('100%');
    const menuAnimation = new Animated.Value(-drawerWidth); // Começando da posição esquerda da tela

    React.useEffect(() => {
        Animated.timing(menuAnimation, {
            toValue: 0, // Movendo para a posição inicial (0)
            duration: 200, // Aumentando a duração da animação para 800 milissegundos
            easing: Easing.out(Easing.ease), // Usando uma curva de easing para deixar a animação mais suave
            useNativeDriver: false, // Necessário para animações de layout
        }).start();
    }, []);

    return (
        <Animated.View
            style={{
                transform: [
                    {
                        translateX: menuAnimation, // Usando a animação criada
                    },
                ],
                height: screenHeight,
                width: drawerWidth,
                position: 'absolute',
                left: 0,
                backgroundColor: 'white',
                gap: 10,
            }}
        >
        <Drawer.Section
            style={{
                height: screenHeight,
                width: drawerWidth,
                position: 'absolute',
                left: 0,
                backgroundColor: 'white',
                gap: 10
            }}
        >
            <View style={styles.menuHeader}>
                <IconButton
                    style={{marginTop: 20, marginLeft: 16}}
                    icon="close"
                    size={30}
                    onPress={props.onClose}
                />
            </View>
            <Drawer.Item
                label="Configurações da Conta"
                onPress={() => setActive('Configurações da Conta')}
                active={active === 'Configurações da Conta'}
            />
            <Drawer.Item
                label="Informações Pessoais"
                onPress={() => setActive('Informações Pessoais')}
                active={active === 'Informações Pessoais'}
            />
            <Drawer.Item
                label="Endereço"
                onPress={() => setActive('Endereço')}
                active={active === 'Endereço'}
            />
            <Drawer.Item
                label="Cartões"
                onPress={() => setActive('Cartões')}
                active={active === 'Cartões'}
            />
            <Drawer.Item
                label="Viagens"
                onPress={() => setActive('Viagens')}
                active={active === 'Viagens'}
            />
            <Drawer.Item
                label="Extratos de Pagamento"
                onPress={() => setActive('Extratos de Pagamento')}
                active={active === 'Extratos de Pagamento'}
            />
            <Drawer.Item
                label="Compras"
                onPress={() => setActive('Compras')}
                active={active === 'Compras'}
            />
            <Text style={{marginTop: hp('20%'), textAlign: 'center', fontWeight: 'bold', fontSize: 25, color: colors.sc}}>EasyPass</Text>
        </Drawer.Section> 
        </Animated.View>
    );
};

export default Menu;
