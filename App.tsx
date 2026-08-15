import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { HomeScreen } from "./src/screens/home";
import { GameScreen } from "./src/screens/game";

// Home screen gates level load behind a user tap (see src/screens/home) —
// GameScreen (and the audio players it creates) doesn't mount until Start
// is pressed.
export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {started ? <GameScreen /> : <HomeScreen onStart={() => setStarted(true)} />}
    </GestureHandlerRootView>
  );
}
