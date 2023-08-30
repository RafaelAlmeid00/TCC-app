import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';
import axios from 'axios';

export default function ModalUser(props) {
    const [visible, setVisible] = React.useState(props.bol.value);
    const [listCards, setListCards] = React.useState<{ name: string }[]>([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [listid, setListProp] = React.useState('')
    const [card, setTipoProp] = React.useState('')
    const typeMapping = {
        'student': 'Estudante',
        'worker': 'Trabalhador',
        'default': 'Usuário Padrão',
    };

    const handleGetListCpf = async () => {
        const list_CPF = props.cpf;

        try {
            const responsecpf = await axios.post('http://192.168.5.112:3344/listcpf/search', { list_CPF: list_CPF });
            const result = responsecpf.data.objeto;
            const newListCards: { name: string }[] = [];

            if (responsecpf) {
                const otherTypes = new Set<string>(); 
                result.forEach((item: { list_tipo: string; list_CPF: string; list_id: string }) => {
                    const type = item.list_tipo;
                    const cpf_list = item.list_CPF;
                    const idlist = item.list_id;
                    setListProp(idlist)
                    setTipoProp(type)

                    if (cpf_list === list_CPF) {
                        let cardName = '';

                        if (type === 'student') {
                            cardName = 'student';
                        } else if (type === 'worker') {
                            cardName = 'worker';
                        } else {
                            cardName = 'default'
                        }

                        newListCards.push({ name: cardName });
                    }
                });

                setListCards(newListCards);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    React.useEffect(() => {
        handleGetListCpf();
    }, [props.cpf]);
    
    React.useEffect(() => {
        setVisible(props.bol.value);
    }, [props.bol.value]);

    const hideDialog = () => {
        setVisible(false);
        props.onClose();
    }

    React.useEffect(() => {
        console.debug(selectedType, listid, card)
    }, [selectedType]);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ display: 'flex', borderRadius: 5}}>
                <PaperSelect
                    hideSearchBox
                    label="Selecione o Usuário:"
                    value={selectedType}
                    onSelection={(value: any) => {
                        setSelectedType(value.text);
                    }}
                    arrayList={[
                        ...listCards.map((card) => ({ _id: card.name, value: typeMapping[card.name] }))
                    ]}

                    selectedArrayList={[
                        { _id: selectedType, value: selectedType }
                    ]}
                    errorText=""
                    multiEnable={false}
                    containerStyle={{alignSelf: 'center'}}
                />

                <Dialog.Actions >
                    <Button onPress={() => props.onClose()}>Voltar</Button>
                    <Button onPress={() => props.onCad(listid, card)}>Finalizar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};