import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Formik } from "formik";
import { Alert, Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../config/firebaseConfig";
import validationSchema from "../../utils/authSchema";

const SignIn = () => {
    const router = useRouter()
    const handleSignup = async (values) => {
        try {
            const userCredentail = await signInWithEmailAndPassword(auth, values.email, values.password)
            const user = userCredentail.user

            const userDoc = await getDoc(doc(db, 'users', user.uid))

            if (userDoc.exists()) {
                await AsyncStorage.setItem('userEmail', values.email)
                router.push('/home')
            }else{
                console.log('No such Doc')
            }

        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                Alert.alert(
                    'Signup Failed!',
                    'Incorrect credentials. Please try again.',
                    [{ text: 'Ok' }]
                )
            }
            else {
                Alert.alert(
                    'Signup Error',
                    'An unexpected error occured. Please try again later.',
                    [{ text: 'Ok' }]
                )
            }
        }
    }

    return (
        <SafeAreaView className="bg-[#2b2b2b] flex-1">
            <StatusBar barStyle={'light-content'} backgroundColor={'#2b2b2b'} />
            <ScrollView
                contentContainerStyle={{ height: '100%' }}
                showsVerticalScrollIndicator={false}>

                <View className="m-2 flex justify-center items-center">

                    <Image source={require('../../assets/images/dinetimelogo.png')} style={{ width: 200, height: 100 }} />

                    <Text className='text-xl text-center text-white font-bold mb-10'>Let&apos;s get you started</Text>

                    <View className='w-5/6'>
                        <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleSignup} >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View className='w-full'>
                                    <Text className='text-[#f49b33] mt-4 mb-2'>Email</Text>
                                    <TextInput className='h-10 border border-white items-center text-white rounded p-2' onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} keyboardType="email-address" />
                                    {touched.email && errors.email && (
                                        <Text className='text-red-500 text-xs mb-2'>{errors.email}</Text>
                                    )}
                                    <Text className='text-[#f49b33] mt-4 mb-2'>Password</Text>
                                    <TextInput className='h-10 border border-white text-white rounded p-2' onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} secureTextEntry />
                                    {touched.password && errors.password && (
                                        <Text className='text-red-500 text-xs mb-2'>{errors.password}</Text>
                                    )}

                                    <TouchableOpacity onPress={handleSubmit} className='p-2 my-2 mt-10 bg-[#f49b33] text-black rounded-lg'>
                                        <Text className='text-lg font-semibold text-center'>
                                            Sign in
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </Formik>
                        <View className="flex-row justify-center my-5">
                            <Text className="text-white font-semibold">New user? </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text className="text-base font-semibold underline text-[#f49b33]">Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>


                <View className="flex-1">
                    <Image className="w-full h-full" source={require('../../assets/images/Frame.png')} resizeMode="contain" />
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default SignIn