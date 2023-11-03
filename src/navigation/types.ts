import { NavigationProp } from "@react-navigation/native"

export enum AppRoutes {
    LoginScreen = 'LoginScreen',
  }

  export interface AppRouteParms {
  }
  
  export type AppNavigatorParamList = Record<keyof typeof AppRoutes, AppRouteParms | undefined>
  
  export type AppNavigation = NavigationProp<AppNavigatorParamList>