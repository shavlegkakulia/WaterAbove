import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ArchiveHomeScreen, CourseDetailScreen, LessonDetailVideoScreen } from '@/screens/Auth';
import { DrawerContent } from '@/components';
import { RootStackParamList } from './types';
import { getWindowWidth, moderateScale } from '@/utils';

const Drawer = createDrawerNavigator<RootStackParamList>();

export const MainDrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      initialRouteName="CourseDetail"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: 'transparent', // backgroundDark
          width: getWindowWidth() - moderateScale(80),
        },
        overlayColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* <Drawer.Screen name="ArchiveHome" component={ArchiveHomeScreen} /> */}
      <Drawer.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen}
        initialParams={{ courseId: '1' }}
      />
      <Drawer.Screen name="LessonDetailVideo" component={LessonDetailVideoScreen} />
    </Drawer.Navigator>
  );
};

