import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface MascotProps {
  size?: number;
  breathe?: boolean; // subtle idle animation
  fadeIn?: boolean;
}

// The mascot's minimalist white-line-on-black identity must stay consistent
// everywhere it appears (spec section 4) — never recolored, never redrawn.
export function Mascot({ size = 160, breathe = true, fadeIn = true }: MascotProps) {
  const opacity = useSharedValue(fadeIn ? 0 : 1);
  const scale = useSharedValue(fadeIn ? 0.9 : 1);
  const breatheScale = useSharedValue(1);

  useEffect(() => {
    if (fadeIn) {
      opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
      scale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    }
    if (breathe) {
      breatheScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [breathe, fadeIn]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * breatheScale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={require('../../assets/mascot.png')}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
        accessibilityLabel="Training mascot"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
