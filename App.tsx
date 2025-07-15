
import { Buffer } from "buffer";
import './global.css';
import FileUploader from '~/components/FileUploader';
import { SafeAreaView, View } from 'react-native';
global.Buffer = global.Buffer || Buffer;
export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <FileUploader />
    </View>
  );
}
