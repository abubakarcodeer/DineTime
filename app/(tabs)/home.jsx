import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../config/firebaseConfig';



const Home = () => {

  const router = useRouter()

  const [restuarnats, setResturants] = useState([])

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/restaurant/${item.name}`)} className='bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg p-4 mx-4 shadow-md'>
      <Image resizeMode='cover' source={{ uri: item.image }} className='h-28  mt-2 mb-1 rounded-lg' />
      <Text className='text-white text-lg font-bold mb-2'>{item.name}</Text>
      <Text className='text-white text-base mb-2'>{item.address}</Text>
      <Text className='text-white text-base mb-2'>Open: {item.opening} -- Close: {item.closing}</Text>
    </TouchableOpacity>
  );

  const getResturants = async () => {
    const q = query(collection(db, 'restaurants'))
    const res = await getDocs(q)

    res.forEach(item => (
      setResturants(prev => [...prev, item.data()])
    ))
  }

  useEffect(() => {
    getResturants()
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: '#2b2b2b', flex: 1 }}>
      <View className='flex items-center'>
        <View className='bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex flex-row p-2'>
          <View className='flex flex-row'>
            <Text className={`text-base h-10 ${Platform.OS === 'ios' ? 'pt-[8px]' : 'pt-1'} align-middle text-white`}>
              {" "}Welcome to{" "}
            </Text>
            <Image resizeMode='cover' className='w-20 h-11' source={require('../../assets/images/dinetimelogo.png')} />
          </View>
        </View>
      </View>
      <ScrollView stickyHeaderIndices={[0]}>
        <ImageBackground resizeMode='cover' source={require('../../assets/images/homeBanner.png')} className='mb-4 h-52 w-full items-center justify-center bg-[#2b2b2b]'>
          <BlurView intensity={Platform.OS === 'ios' ? 25 : 100}
            tint='dark' className='w-full p-4 shadow-lg'>
            <Text className='text-center text-3xl font-bold text-white'>Dine with your loved ones</Text>
          </BlurView>
        </ImageBackground>

        <View className='p-4 bg-[#2b2b2b] flex-row items-center'>
          <Text className='text-3xl text-white mr-2 font-semibold'>
            Special Discount %{' '}
          </Text>
        </View>

        {
          restuarnats.length > 0 ?
            (<FlatList data={restuarnats} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} horizontal contentContainerStyle={{ padding: 16 }} showsHorizontalScrollIndicator={false} scrollEnabled={true} />) : (<ActivityIndicator animating color={'#fb9b33'} />)
        }

        <View className='p-4 bg-[#2b2b2b] flex-row items-center'>
          <Text className='text-3xl text-white mr-2 font-semibold'>
            Our Restaurents
          </Text>
        </View>

        {
          restuarnats.length > 0 ?
            (<FlatList data={restuarnats} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} horizontal contentContainerStyle={{ padding: 16 }} showsHorizontalScrollIndicator={false} scrollEnabled={true} />) : (<ActivityIndicator animating color={'#fb9b33'} />)
        }

      </ScrollView>

    </SafeAreaView>
  )
}

export default Home