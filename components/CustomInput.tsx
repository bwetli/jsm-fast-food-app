import {View, Text, TextInput} from 'react-native'
import React from 'react'
import cn from 'clsx';

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    label,

}:CustomInputProps) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View className="w-full">
            <Text className="label">{label}</Text>

            <TextInput
                autoCapitalize="none"
                 autoCorrect={false}
                 placeholder={placeholder}
                 value={value}
                 onChangeText={onChangeText}
                 secureTextEntry={secureTextEntry}
                 keyboardType={keyboardType}
                 className={cn("input", isFocused ? 'border-primary' : 'border-gray-300')}
                 onFocus={() => setIsFocused(true)}
                 onBlur={() => setIsFocused(false)}
                 placeholderTextColor="#888"
                />
        </View>
    )
}
export default CustomInput
