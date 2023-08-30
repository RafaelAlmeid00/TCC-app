import colors from "../../assets/colors";
import { ActivityIndicator, View } from 'react-native';
import styles from "../style/All";

export default function Loading() {

  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.pm} />
    </View>
  );
}
