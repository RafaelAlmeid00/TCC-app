import { StyleSheet } from 'react-native';
import colors from "../../assets/colors"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('100%')
  },
  title: {
    marginTop: 100,
    marginBottom: 80,
    display: 'flex',
    color: colors.sc,
    fontSize: hp('4%'),
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    width: '80%',
    height: 'auto',
    flexDirection: 'column'
  },
  input: {
    width: '100%',
    color: 'black',
    backgroundColor: '#dcdcdc',
    marginBottom: 15,
    marginTop: 15
  },
  button: {
    backgroundColor: colors.pm,
    color: 'white',
    marginTop: 15
  },
  loading: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('100%'),
    height: hp('100%')
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  back: {
    marginTop: 80,
    marginBottom: 30,
    display: 'flex',
    alignItems: 'flex-start', 
    justifyContent: 'flex-start',
    backgroundColor: colors.pm
  },
});


export default styles;