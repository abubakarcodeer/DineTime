import AsynStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter()

  const handleGuest = async()=>{
    await AsynStorage.setItem('isGuest', 'true')
    router.push('/home')
  }
  return (
    <SafeAreaView className="bg-[#2b2b2b] flex-1">
      <StatusBar barStyle={'light-content'} backgroundColor={'#2b2b2b'} />
      <ScrollView
        contentContainerStyle={{ height: '100%' }}
        showsVerticalScrollIndicator={false}>

        <View className="m-2 flex justify-center items-center">

          <Image source={require('../assets/images/dinetimelogo.png')} style={{ width: 300, height: 300 }} />

          <View className="w-3/4">
            <TouchableOpacity onPress={()=>router.push('/signup')} className="p-2 my-2 bg-[#f49b33] text-black rounded-lg max-w-fit">
              <Text className="text-lg font-semibold text-center">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGuest} className="p-2 my-2  text-black border-[#f49b33] border rounded-lg max-w-fit">
              <Text className="text-lg text-[#f49b33] font-semibold text-center">Guest User</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-white font-semibold text-base text-center my-4">
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24"></View> or{" "}
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24"></View>
            </Text>
          </View>

          <View className="flex-row">
            <Text className="text-white font-semibold">Already a user? </Text>
            <TouchableOpacity onPress={() => router.push('/signin')}>
              <Text className="text-base font-semibold underline text-[#f49b33]">Sign in</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View className="flex-1">
          <Image className="w-full h-full" source={require('../assets/images/Frame.png')} resizeMode="contain" />
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}
