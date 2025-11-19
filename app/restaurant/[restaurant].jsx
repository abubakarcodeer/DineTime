import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Image, Linking, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DatePickerComponent from '../../components/layout/resturant/DatePickerComponent'
import FindSlots from '../../components/layout/resturant/FindSlots'
import GuestPickerComponent from '../../components/layout/resturant/GuestPickerComponent'
import { db } from '../../config/firebaseConfig'


const { width, height } = Dimensions.get('window')

const Restaurant = () => {

    const { restaurant } = useLocalSearchParams()
    const flatListRef = useRef(null)
    const [restaurantData, setResturantData] = useState({})
    const [carousalData, setCarousalData] = useState([])
    const [slotsData, setSlotsData] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
   
    const [date, setDate] = useState(new Date())
    const [selectedNumber, setSelectedNumber] = useState(0)
    const [selectedSlot, setSelectedSlot] = useState(null)


    const handleNextImage = () => {
        const carousalLength = carousalData[0]?.images.length
        if (currentIndex < carousalLength - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex)
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
        if (currentIndex === carousalLength - 1) {
            const nextIndex = 0
            setCurrentIndex(nextIndex)
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true })
        }
    }

    const handlePrevImage = () => {
        const carousalLength = carousalData[0]?.images.length
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex)
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
        }
        if (currentIndex === 0) {
            const prevIndex = carousalLength - 1
            setCurrentIndex(prevIndex)
            flatListRef.current.scrollToIndex({ index: prevIndex, animated: true })
        }
    }

    const carousalItem = ({ item }) => (
        <View style={{ width: width - 2 }} className='h-64 relative'>
            <View style={{ position: 'absolute', top: '50%', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, padding: 5, zIndex: 10, right: '6%' }}>
                <Ionicons onPress={handleNextImage} name='arrow-forward' size={24} color={'white'} />
            </View>
            <View style={{ position: 'absolute', top: '50%', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, padding: 5, zIndex: 10, left: '2%' }}>
                <Ionicons onPress={handlePrevImage} name='arrow-back' size={24} color={'white'} />
            </View>
            <View className='absolute flex justify-center items-center flex-row left-[50%] -translate-x-[50%] z-10 bottom-5'>
                {
                    carousalData[0].images?.map((_, i) => (
                        <View key={i} className={`bg-white h-2 w-2 ${i === currentIndex && 'h-3 w-3'} p-1 mx-1 rounded-full`} />
                    ))
                }
            </View>

            <View className='bg-white h-2 w-2 p-1 mx-1 rounded-full' />
            <Image source={{ uri: item }} style={{ opacity: 0.5, backgroundColor: 'black', marginRight: 20, marginLeft: 5, borderRadius: 25 }} className='h-64 ' />
        </View>
    )

    const getResturantData = async () => {
        try {
            const restaurantQuery = query(collection(db, 'restaurants'), where('name', '==', restaurant))
            const restaurantSnapshot = await getDocs(restaurantQuery)

            if (restaurantSnapshot.empty) {
                console.log('No Match Found')
                return
            }

            for (const doc of restaurantSnapshot.docs) {
                const restaurantData = doc.data()
                setResturantData(restaurantData)

                const carousalQuery = query(collection(db, 'carousal'), where('res_id', '==', doc.ref))
                const carousalSnapshot = await getDocs(carousalQuery)

                const carousalImages = []

                if (carousalSnapshot.empty) {
                    console.log('No Matching carousal found')
                    return
                }

                carousalSnapshot.forEach((carousalDoc) => (
                    carousalImages.push(carousalDoc.data())
                ))
                setCarousalData(carousalImages)


                const slotsQuery = query(collection(db, 'slots'), where('ref_id', '==', doc.ref))
                const slotsSnapshot = await getDocs(slotsQuery)

                const slots = []

                if (slotsSnapshot.empty) {
                    console.log('No Matching slots found')
                    return
                }

                slotsSnapshot.forEach((slotDoc) => (
                    slots.push(slotDoc.data())
                ))
                setSlotsData(slots[0]?.slot)
            }
        } catch (error) {
            console.log('Error fetching data', error)
        }

    }

    const handleLocation = async () => {
        const url = 'https://maps.app.goo.gl/TtSmNr394bVp9J8n8'
        const supported = await Linking.canOpenURL(url)

        if (supported) {
            await Linking.openURL(url)
        }
        else {
            console.log("Don't Know how to Open URL", url)
        }
    }

    useEffect(() => {
        getResturantData()
    }, [])

    return (
        <SafeAreaView style={{ backgroundColor: '#2b2b2b', flex: 1 }}>
            <ScrollView
                className='h-full'>
                <View className='flex-1 my-2 p-2'>
                    <Text className='text-3xl text-[#f49b33] mr-2 font-semibold'>
                        {restaurant}
                    </Text>
                    <View className='border-b border-[#f49b33]' />
                </View>

                <View className='h-64 max-w-[98%] mx-2 rounded-[25px]'>

                    <FlatList data={carousalData[0]?.images} renderItem={carousalItem} ref={flatListRef} horizontal scrollEnabled={false} style={{ borderRadius: 25 }} showsHorizontalScrollIndicator={false} />

                </View>

                <View className='flex-1 flex-row mt-2 p-2'>
                    <Ionicons name='location-sharp' size={20} color={'#f49b33'} />
                    <Text className='max-w-[75%] text-white'>
                        {restaurantData?.address} | {' '}
                        <Text onPress={handleLocation} className='underline flex items-center text-[#f49b33] italic font-semibold mt-1'>Get Direction</Text>
                    </Text>
                </View>

                <View className='flex-1 flex-row p-2'>
                    <Ionicons name='time' size={20} color={'#f49b33'} />
                    <Text className='max-w-[75%] mx-2 text-white font-semibold'>
                        {restaurantData?.opening} -- {restaurantData?.closing}
                    </Text>
                </View>

                <View className='flex-1 border m-2 p-2 border-[#f49b33] rounded-lg'>
                    <View className='flex-1 flex-row m-2 p-2 justify-end items-center'>
                        <View className='flex-1 flex-row'>
                            <Ionicons name='calendar' size={20} color={'#f49b33'} />
                            <Text className='text-white mx-2'>
                                Select booking date
                            </Text>
                        </View>
                        <DatePickerComponent date={date} setDate={setDate} />
                    </View>
                    <View className='flex-1 flex-row m-2 rounded-lg bg-[#474747] p-2 justify-end items-center'>
                        <View className='flex-1 flex-row'>
                            <Ionicons name='people' size={20} color={'#f49b33'} />
                            <Text className='text-white mx-2'>
                                Select number of guests
                            </Text>
                        </View>
                        <GuestPickerComponent selectedNumber={selectedNumber} setSelectedNumber={setSelectedNumber} />
                    </View>
                </View>

                <View  className='flex-1'>
                    <FindSlots restaurant={restaurant} date={date} selectedNumber={selectedNumber} slots={slotsData} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot}/>
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default Restaurant