import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import {COLORS} from '../../../constants';

const MenuPopup = ({items, triggerButton, optionsContainerStyle}) => {
  return (
    <Menu>
      <MenuTrigger>{triggerButton}</MenuTrigger>
      <MenuOptions optionsContainerStyle={optionsContainerStyle}>
        {items?.map(item => (
          <MenuOption
            style={{
              height: 40,
              borderBottomWidth: 1,
              borderBottomColor: '#DEE1E9',
              justifyContent: 'center',
              paddingHorizontal: 15,
              backgroundColor: COLORS.bg,
            }}
            customStyles={{optionText: {color: '#172850'}}}
            onSelect={() => item.onPress(item.value)}
            key={item.value}
            text={item.label}
            value={item.value}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default MenuPopup;
