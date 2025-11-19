import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { db } from '../../config/firebaseConfig'

const History = () => {

  const [userEmail, setUserEmail] = useState(null)
  const [booking, setBooking] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserEmail()
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [userEmail])

  const fetchUserEmail = async () => {
    const email = await AsyncStorage.getItem('userEmail')
    setUserEmail(email)
  }
  const fetchBookings = async () => {
    if (userEmail) {
      try {
        const bookingCollection = collection(db, 'bookings')
        const bookingQuery = query(bookingCollection, where('email', '==', userEmail))
        const bookingSnapshort = await getDocs(bookingQuery)

        const bookingList = bookingSnapshort.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setBooking(bookingList)

      } catch {
        Alert.alert('Error', 'Could not fetch bookings')
      }
    }
    setLoading(false)

  }

  if (loading) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-[#2b2b2b]'>
        <Text>loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-[#2b2b2b]'>
      {
        userEmail ? (<FlatList onRefresh={fetchBookings} refreshing={loading} data={booking} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 20 }} renderItem={({ item }) => (
          <View className='p-4 border-b border-[#fb9b33]'>
            <Text className='text-white'>Date:{item?.date}</Text>
            <Text className='text-white'>Slot:{item?.slot}</Text>
            <Text className='text-white'>Guests:{item?.guests}</Text>
            <Text className='text-white'>Restaurant:{item?.restaurant}</Text>
            <Text className='text-white'>Email:{item.email}</Text>
          </View>
        )} />) : <View className='flex-1 justify-center items-center'>
          <Text className='text-white'>Please sign in to view your booking history</Text>
          <TouchableOpacity onPress={()=>router.push('/signin')} className='p-2 my-2 mt-10 bg-[#f49b33] text-black rounded-lg'>
            <Text className='text-lg font-semibold text-center'>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>
  )
}

export default History