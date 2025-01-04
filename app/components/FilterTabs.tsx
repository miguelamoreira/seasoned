import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

type TabKey = string | null; 
type Tab = {
  label: string; 
  key: TabKey;
};

type FilterTabsProps = {
  tabs: Tab[]; 
  onTabChange: (tab: TabKey) => void; 
  initialTab?: TabKey; 
  allowNoneSelected?: boolean; 
};

function FilterTabs(props: FilterTabsProps) {
  const { tabs, onTabChange, initialTab = null, allowNoneSelected = true } = props;

  const [selectedTab, setSelectedTab] = useState<TabKey>(initialTab); 

  const handleTabPress = (tabKey: TabKey) => {
    const newSelection = selectedTab === tabKey && allowNoneSelected ? null : tabKey; 
    setSelectedTab(newSelection);
    onTabChange(newSelection); 
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => {
        const isActive = selectedTab === tab.key;

        const TabContent = (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(tab.key)}
            style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        );

        return isActive ? (
          <Shadow key={index} distance={1} startColor={'#211B17'} offset={[1, 2]}>
            {TabContent}
          </Shadow>
        ) : (
          TabContent
        );
      })}
    </View>
  );
}

export default FilterTabs;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF4E0',
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  activeTab: {
    backgroundColor: '#D8A84E',
    borderWidth: 2,
    borderColor: '#211B17',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Arimo',
    color: '#211B17',
  },
  activeTabText: {
    color: '#211B17',
  },
});
