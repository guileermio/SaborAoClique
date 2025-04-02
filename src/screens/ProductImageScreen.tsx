import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const AnimatedImage = Animated.createAnimatedComponent(Animated.Image);

const ProductImageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { image } = route.params as { image: string };

  // Valores animados
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const imageLayout = useSharedValue({ width: 0, height: 0, x: 0, y: 0 });

  // Valores salvos
  const savedValues = useSharedValue({
    scale: 1,
    translateX: 0,
    translateY: 0
  });

  // Função worklet para calcular limites
  const calculateBounds = (currentScale: number) => {
    'worklet';
    if (currentScale <= 1) return { maxX: 0, maxY: 0 };
    
    const scaledWidth = imageLayout.value.width * currentScale;
    const scaledHeight = imageLayout.value.height * currentScale;
    
    return {
      maxX: Math.max(0, (scaledWidth - imageLayout.value.width) / 2),
      maxY: Math.max(0, (scaledHeight - imageLayout.value.height) / 2)
    };
  };

  // Gesto de Pinch (zoom)
  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      const relativeX = e.focalX - imageLayout.value.x;
      const relativeY = e.focalY - imageLayout.value.y;
      
      if (
        relativeX < 0 ||
        relativeX > imageLayout.value.width ||
        relativeY < 0 ||
        relativeY > imageLayout.value.height
      ) {
        return;
      }
    })
    .onUpdate((e) => {
      const newScale = savedValues.value.scale * e.scale;
      scale.value = Math.min(Math.max(newScale, 1), 4);
    })
    .onEnd(() => {
      if (scale.value < 1.1) {
        scale.value = withTiming(1, { duration: 300 });
        translateX.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
        savedValues.value = { scale: 1, translateX: 0, translateY: 0 };
      } else {
        const clampedScale = Math.min(Math.max(scale.value, 1), 4);
        scale.value = withTiming(clampedScale, { duration: 200 });
        savedValues.value = {
          scale: clampedScale,
          translateX: translateX.value,
          translateY: translateY.value
        };
      }
    });

  // Gesto de Pan (movimento)
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      if (scale.value > 1) {
        const bounds = calculateBounds(scale.value);
        
        const newX = savedValues.value.translateX + e.translationX;
        const newY = savedValues.value.translateY + e.translationY;
        
        translateX.value = Math.max(-bounds.maxX, Math.min(bounds.maxX, newX));
        translateY.value = Math.max(-bounds.maxY, Math.min(bounds.maxY, newY));
      }
    })
    .onEnd(() => {
      if (scale.value > 1) {
        savedValues.value = {
          ...savedValues.value,
          translateX: translateX.value,
          translateY: translateY.value
        };
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (!image) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Imagem não disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View 
        style={styles.imageContainer}
        onLayout={(e) => {
          imageLayout.value = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            x: e.nativeEvent.layout.x,
            y: e.nativeEvent.layout.y
          };
        }}
      >
        <GestureDetector gesture={composedGesture}>
          <AnimatedImage
            source={{ uri: `data:image/jpeg;base64,${image}` }}
            style={[styles.image, animatedStyle]}
            resizeMode="contain"
          />
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: '#fff',
    fontSize: 18
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 5
  }
});

export default ProductImageScreen;