import * as React from 'react';
import { Dialog, Portal, Text } from 'react-native-paper';


const AlertComponent = (props) => {
    const [visible, setVisible] = React.useState(props.bol.value);

    React.useEffect(() => {
        setVisible(props.bol.value);
    }, [props.bol.value]);

    const hideDialog = () => {
        setVisible(false);
        props.onClose();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={{ textAlign: 'center' }}>{props.title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ textAlign: 'center' }} variant="bodyMedium">{props.message}</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};


export { AlertComponent }
