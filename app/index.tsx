import { useState } from "react";
import { Redirect } from "expo-router";

import { HomeScreen } from "../src/screens/home";

export default function HomeRoute() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <Redirect href="/game" />;
  }

  return <HomeScreen onStart={() => setStarted(true)} />;
}
