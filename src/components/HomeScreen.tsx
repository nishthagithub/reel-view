import { Dimensions, StyleSheet, View, TouchableWithoutFeedback, FlatList, ViewToken } from 'react-native';
import React, { useRef, useState, useCallback } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';


const { height: SCREEN_HEIGHT } = Dimensions.get('window');


const videos = [
  require("../../assets/video1.mp4"),
  require("../../assets/video2.mp4"),
  require("../../assets/video3.mp4"),
  require("../../assets/video5.mp4")
];

// Individual Video Component
type VideoItemProps = {
  videoSource: number; 
  isActive: boolean;
  onPress: () => void;
};
const VideoItem: React.FC<VideoItemProps> = ({ videoSource, isActive }) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.volume = 1.0;
    if (isActive) {
      player.play();
    }
  });

  
  React.useEffect(() => {
    if (isActive) {
        player.play();
    } else {
      player.pause();
    }
  }, [isActive]);

  // Pause on long press, resume on release
  const handlePressIn = () => {
    if (isActive) {
      player.pause();
    }
  };

  const handlePressOut = () => {
    if (isActive) {
      player.play();
    }
  };

  return (
    <View style={styles.videoContainer}>
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false} 
          contentFit='cover'
          pointerEvents='box-none'    
        />
    </TouchableWithoutFeedback>
    </View>
  );
};

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const flatListRef = useRef<FlatList<any>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      const nextIndex = viewableItems[0]?.index;
      if (typeof nextIndex === 'number') {
        if (nextIndex === videos.length) {
          // If at the end, loop to first
          flatListRef.current?.scrollToIndex({ index: 0, animated: false });
          setCurrentIndex(0);
        } else if (nextIndex === -1) {
          // If before start, loop to last
          flatListRef.current?.scrollToIndex({ index: videos.length - 1, animated: false });
          setCurrentIndex(videos.length - 1);
        } else {
          setCurrentIndex(nextIndex);
        }
      }
    }
  );



  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isActive = index === currentIndex;
    
    return (
     
<VideoItem
        videoSource={item}
        isActive={isActive && isPlaying}
        onPress={togglePlayPause}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        pagingEnabled={true}
        keyExtractor={(_, index) => index.toString()}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80, // item must be 80% visible to trigger change
        }}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged.current}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        // snapToInterval={SCREEN_HEIGHT}
        decelerationRate="normal"
        snapToAlignment="start"
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    // height:"100%",
  },
  videoContainer: {
    flex:1,
  },
  video: {
    // flex:1,
    height: SCREEN_HEIGHT,
  },
});