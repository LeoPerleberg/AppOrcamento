import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Pricing: undefined;
  Templates: undefined;
  Catalog: undefined;
  Approved: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Summary: undefined;
  ApprovedDetail: { id: string };
};
