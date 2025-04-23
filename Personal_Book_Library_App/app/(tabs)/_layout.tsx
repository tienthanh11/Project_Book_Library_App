import { View, Image, StyleSheet, Animated, Easing, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Tabs } from 'expo-router'
import { icons } from '@/constants/icons'

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
}

const TabIcon = ({ focused, icon, title }: TabIconProps) => {
  const scrollAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const glowAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(focused ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scrollAnim, {
        toValue: focused ? 1 : 0,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.1 : 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  const scrollOffset = scrollAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });

  return (
    <View style={styles.tabIconWrapper}>
      <Animated.View style={[styles.glowEffect, { opacity: glowAnim }]} />
      <Animated.View style={[styles.tabIconContainer, { transform: [{ translateX: scrollOffset }, { scale: scaleAnim }] }]}>
        <View style={[styles.tabIconContent, focused && styles.tabIconContentFocused]}>
          <Image
            source={icon}
            style={styles.icon}
            tintColor={focused ? '#F4D19B' : '#2A4D6E'}
          />
        </View>
      </Animated.View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {title}
      </Text>
    </View>
  );
};

const _Layout = () => {
  return (
    <>
      <View style={styles.secondaryBar}>
        <Text style={styles.secondaryBarText}>Books Saved: 8</Text>
        <TouchableOpacity style={styles.secondaryBarButton}>
          <Text style={styles.secondaryBarButtonText}>Sync</Text>
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <TabIcon focused={focused} icon={icons.search} title="Search" />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <TabIcon focused={focused} icon={icons.save} title="Saved" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              <TabIcon focused={focused} icon={icons.person} title="Profile" />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

const styles = StyleSheet.create({
  secondaryBar: {
    position: 'absolute',
    bottom: 85,
    left: 30,
    right: 30,
    height: 30,
    backgroundColor: '#4A3728',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F4D19B',
    shadowColor: '#4A3728',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryBarText: {
    color: '#F4D19B',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryBarButton: {
    backgroundColor: '#F4D19B',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  secondaryBarButtonText: {
    color: '#4A3728',
    fontSize: 10,
    fontWeight: '600',
  },

  tabBar: {
    backgroundColor: '#D4B992',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 55,
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F4D19B',
    shadowColor: '#4A3728',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    paddingBottom: 0,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    height: 45,
  },
  glowEffect: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(244, 209, 155, 0.3)',
    shadowColor: '#F4D19B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#D4B992',
    borderWidth: 1,
    borderColor: '#F4D19B',
    shadowColor: '#4A3728',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabIconContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  tabIconContentFocused: {
    backgroundColor: '#4A3728',
    borderWidth: 1,
    borderColor: '#F4D19B',
  },
  icon: {
    width: 20,
    height: 20,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 9,
    color: '#2A4D6E',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#F4D19B',
    fontWeight: '700',
  },
});

export default _Layout;