import { StyleSheet } from 'react-native';
import colors from "../../assets/colors"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const stylesLog = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    color: colors.sc,
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginTop: 30
  },
  question: {
    display: 'flex',
    alignItems: 'flex-end', 
    justifyContent: 'flex-end',
    width: '80%'
  },
  title: {
    textAlign: 'center',
    color: 'black',
    fontSize: hp('2%'),
    fontWeight: 'bold',
    
  },
  click: {
    marginTop: 5
  }
});


export default stylesLog;