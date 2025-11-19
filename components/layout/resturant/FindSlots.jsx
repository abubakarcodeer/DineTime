import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addDoc, collection } from 'firebase/firestore'
import { Formik } from 'formik'
import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { db } from '../../../config/firebaseConfig'
import guestFormSchema from '../../../utils/guestFormSchema'

const FindSlots = ({ date, restaurant, selectedNumber, slots, selectedSlot, setSelectedSlot }) => {

    const [slotsVisible, setSlotsVisible] = useState(false)
    const [modalVisible, setModelVisible] = useState(false)
    const [formVisible, setFormVisible] = useState(false)

    const handlePress = () => {
        setSlotsVisible(!slotsVisible)
    }
    const handleSlotPress = (slot) => {
        let prevSlot = selectedSlot;
        if (prevSlot === slot) {
            setSelectedSlot(null)
        }
        else {
            setSelectedSlot(slot)
        }
    }
    const handleBooking = async () => {
        const guestStatus = await AsyncStorage.getItem('isGuest')
        const userEmail = await AsyncStorage.getItem('userEmail')

        if (userEmail) {
            try {
                await addDoc(collection(db, 'bookings'), {
                    email: userEmail,
                    slot: selectedSlot,
                    date: date.toISOString(),
                    guests: selectedNumber,
                    restaurant: restaurant
                })

                alert(
                    "Booking  successfully Done!"
                )
            } catch {
                alert(
                    "An unexpected error occur!"
                )
            }
        } else if (guestStatus === 'true') {
            setFormVisible(true)
            setModelVisible(true)
        }
    }
    const handleFormSubmit = async (values) => {
        try {
            await addDoc(collection(db, 'bookings'), {
               ...values,
                slot: selectedSlot,
                date: date.toISOString(),
                guests: selectedNumber,
                restaurant: restaurant
            })
            alert(
                "Booking  successfully Done!"
            )
            setModelVisible(false)
        } catch {
            alert(
                "An unexpected error occur!"
            )
        }
    }
    const handleCloseMode = () => {
        setModelVisible(false)
    }

    return (
        <View className='flex-1'>
            <View className={`flex ${selectedSlot != null && 'flex-row'}`}>
                <View className={`${selectedSlot != null && 'flex-1'}`}>
                    <TouchableOpacity onPress={handlePress}>
                        <Text className='text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg'>Find Slots</Text>
                    </TouchableOpacity>
                </View>
                {selectedSlot != null && (
                    <View className='flex-1'>
                        <TouchableOpacity onPress={handleBooking}>
                            <Text className='text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 text-white mx-2 rounded-lg'>Book Slot</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {slotsVisible && (
                <View className='flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg'>
                    {slots.map((slot, index) => (
                        <TouchableOpacity key={index} className={`m-2 p-4 bg-[#f49b33] ${selectedSlot && selectedSlot !== slot ? 'opacity-50' : ''} rounded-lg items-center justify-center`}
                            onPress={() => handleSlotPress(slot)}
                            disabled={
                                selectedSlot === slot || selectedSlot === null ? false : true
                            }>
                            <Text className='text-white font-bold'>{slot}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <Modal visible={modalVisible} transparent={true} animationType='slide' style={{
                flex: 1,
                justifyContent: 'flex-end',
                margin: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
            }} >
                <View className='flex-1 bg-[#00000080] justify-end'>
                    <View className='bg-[#474747] mx-4 rounded-t-lg p-4 pb-6'>
                        {
                            formVisible && (<Formik initialValues={{ fullName: '', phoneNumber: '' }} validationSchema={guestFormSchema} onSubmit={handleFormSubmit} >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <View className='w-full'>
                                        <View>
                                            <Ionicons name='close-sharp' size={30} color={'#f49b33'} onPress={handleCloseMode} />
                                        </View>
                                        <Text className='text-[#f49b33] mt-4 mb-2'>Name</Text>
                                        <TextInput className='h-10 border border-white items-center text-white rounded p-2' onChangeText={handleChange('fullName')} onBlur={handleBlur('fullName')} value={values.fullName} />
                                        {touched.fullName && errors.fullName && (
                                            <Text className='text-red-500 text-xs mb-2'>{errors.fullName}</Text>
                                        )}
                                        <Text className='text-[#f49b33] mt-4 mb-2'>Phone Number</Text>
                                        <TextInput className='h-10 border border-white text-white rounded p-2' onChangeText={handleChange('phoneNumber')} onBlur={handleBlur('phoneNumber')} value={values.phoneNumber} />
                                        {touched.phoneNumber && errors.phoneNumber && (
                                            <Text className='text-red-500 text-xs mb-2'>{errors.phoneNumber}</Text>
                                        )}

                                        <TouchableOpacity onPress={handleSubmit} className='p-2 my-2 mt-10 bg-[#f49b33] text-black rounded-lg'>
                                            <Text className='text-lg font-semibold text-center'>
                                                Sign Up
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                )}

                            </Formik>
                            ) }
                    </View>
                </View>

            </Modal>

        </View>
    )
}

export default FindSlots