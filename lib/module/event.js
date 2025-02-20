import { useEffect, useState } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
export const useOnDataReceived = address => {
  const [data, setData] = useState('');
  useEffect(() => {
    if (!address) {
      console.error('Device address is required');
      return;
    }
    const onDataReceived = event => {
      setData(event.data);
    };
    const subscription = RNBluetoothClassic.onDeviceRead(address, onDataReceived);
    return () => subscription.remove();
  }, [address]);
  return [data, () => {}];
};
//# sourceMappingURL=event.js.map