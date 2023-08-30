import React from 'react';
import { Snackbar } from 'react-native-paper';

export default function SnackBar(props) {
    const { visible, status, text, onDismiss } = props;

    let snackBarColor = '#000'; // Default color
    if (status === 'error') {
        snackBarColor = 'red';
    } else if (status === 'ok') {
        snackBarColor = 'green';
    }

    return (
        <Snackbar
            visible={visible}
            onDismiss={onDismiss}
            style={{ backgroundColor: snackBarColor }}>
            {text}
        </Snackbar>
    );
};
