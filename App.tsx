import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GameScreen } from "./src/screens/game";

// No home screen / menu — load directly into the level (beatup.md).
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameScreen />
    </GestureHandlerRootView>
  );
}
